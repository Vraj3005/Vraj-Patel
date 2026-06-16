import { NextRequest, NextResponse } from 'next/server';
import { askVrajAI, askVrajAIStream } from '@/lib/ai/gemini';
import { isRateLimited } from '@/lib/security/rate-limiter';
import { aiChatInputSchema } from '@/lib/security/zod-schemas';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Limit AI requests to 10 queries per minute per client IP
  if (isRateLimited(ip, 10, 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please throttle your inquiries.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const result = aiChatInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload values.', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, sessionId, stream, history } = result.data;

    // 1. Establish or lookup the session ID context
    let activeSessionId = sessionId;

    if (isSupabaseConfigured && !activeSessionId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = (await createServerSupabaseClient()) as any;
      
      const { data: sessionData, error: sessionErr } = await supabase
        .from('ai_chat_sessions')
        .insert([{ title: `Query: ${prompt.substring(0, 30)}...`, user_ip: ip }])
        .select()
        .single();

      if (!sessionErr && sessionData) {
        activeSessionId = sessionData.id;
      }
    } else if (!activeSessionId) {
      activeSessionId = crypto.randomUUID();
    }

    // 2. Handle streaming
    if (stream) {
      const streamResult = await askVrajAIStream(prompt, history || []);

      let responseStream: ReadableStream;

      if (streamResult instanceof ReadableStream) {
        // Simulated stream fallback
        const reader = streamResult.getReader();
        const decoder = new TextDecoder();
        responseStream = new ReadableStream({
          async start(controller) {
            try {
              let fullText = '';
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullText += decoder.decode(value, { stream: true });
                controller.enqueue(value);
              }
              controller.close();

              // Log to database AFTER streaming completes
              if (isSupabaseConfigured && activeSessionId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const supabase = (await createServerSupabaseClient()) as any;
                await supabase.from('ai_chat_messages').insert([
                  { session_id: activeSessionId, role: 'user', content: prompt },
                  { session_id: activeSessionId, role: 'assistant', content: fullText }
                ]);
              }
            } catch (err) {
              controller.error(err);
            }
          }
        });
      } else {
        // Real Gemini stream response
        const encoder = new TextEncoder();
        responseStream = new ReadableStream({
          async start(controller) {
            try {
              let fullText = '';
              for await (const chunk of streamResult.stream) {
                const text = chunk.text();
                fullText += text;
                controller.enqueue(encoder.encode(text));
              }
              controller.close();

              // Log to database AFTER streaming completes
              if (isSupabaseConfigured && activeSessionId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const supabase = (await createServerSupabaseClient()) as any;
                await supabase.from('ai_chat_messages').insert([
                  { session_id: activeSessionId, role: 'user', content: prompt },
                  { session_id: activeSessionId, role: 'assistant', content: fullText }
                ]);
              }
            } catch (err) {
              controller.error(err);
            }
          }
        });
      }

      const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      });
      if (activeSessionId) {
        headers.set('x-session-id', activeSessionId);
      }

      return new Response(responseStream, { headers });
    }

    // 3. Fallback standard JSON response (non-streaming, e.g. for homepage preview)
    const aiResponse = await askVrajAI(prompt, history || []);

    if (isSupabaseConfigured && activeSessionId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = (await createServerSupabaseClient()) as any;
      await supabase.from('ai_chat_messages').insert([
        { session_id: activeSessionId, role: 'user', content: prompt },
        { session_id: activeSessionId, role: 'assistant', content: aiResponse }
      ]);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (activeSessionId) {
      headers['x-session-id'] = activeSessionId;
    }

    return new Response(JSON.stringify({ response: aiResponse, sessionId: activeSessionId }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('API Error in /api/ask:', error);
    return NextResponse.json({ error: 'Failed to process AI query.' }, { status: 500 });
  }
}
