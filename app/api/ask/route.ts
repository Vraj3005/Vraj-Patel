import { NextRequest, NextResponse } from 'next/server';
import { askVrajAI, askVrajAIStream } from '@/lib/ai/gemini';
import { isRateLimited } from '@/lib/security/rate-limiter';
import { aiChatInputSchema } from '@/lib/security/zod-schemas';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { ServerLogger } from '@/lib/telemetry/server-logger';
import { MetricsCollector } from '@/lib/metrics/metrics-collector';

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  throw new Error('This API endpoint can only be run on the server.');
}

function sanitizeOutput(text: string): string {
  if (!text) return text;
  let sanitized = text;
  
  const sensitiveKeys = [
    process.env.GEMINI_API_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ].filter(Boolean) as string[];

  for (const key of sensitiveKeys) {
    if (key.length >= 4) {
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedKey, 'gi');
      sanitized = sanitized.replace(regex, '[REDACTED]');
    }
  }
  
  return sanitized;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Check content length limit (128KB max)
  const contentLength = Number(req.headers.get('content-length') || '0');
  if (contentLength > 131072) {
    return NextResponse.json(
      { error: 'Payload too large. Request body must be under 128KB.' },
      { status: 413 }
    );
  }

  // 2. Limit AI requests to 10 queries per minute per client IP
  if (await isRateLimited(ip, 'ai', 10, 60 * 1000)) {
    await ServerLogger.logEvent(
      'ask-vraj',
      'warning',
      'Rate limit triggered on Ask Vraj AI endpoint.',
      { ipHash: ip.substring(0, 10) },
      true
    );
    return NextResponse.json(
      { error: 'Too many requests. Please throttle your inquiries.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const result = aiChatInputSchema.safeParse(body);

    if (!result.success) {
      await ServerLogger.logEvent(
        'ask-vraj',
        'warning',
        'AI Assistant input validation failed.',
        { errors: result.error.flatten().fieldErrors },
        true
      );
      return NextResponse.json(
        { error: 'Invalid payload values.', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, sessionId, stream, history } = result.data;

    // 1. Establish or lookup the session ID context
    let activeSessionId = sessionId;

    if (isSupabaseAdminConfigured && !activeSessionId) {
      try {
        const { data: sessionData, error: sessionErr } = await (supabaseAdmin as any)
          .from('ai_chat_sessions')
          .insert([{ title: `Query: ${prompt.substring(0, 30)}...`, user_ip: ip }])
          .select()
          .single();

        if (!sessionErr && sessionData) {
          activeSessionId = sessionData.id;
        }
      } catch (dbErr) {
        console.error('Supabase session log failed:', dbErr);
      }
    }
    
    if (!activeSessionId) {
      activeSessionId = crypto.randomUUID();
    }

    // Log successful telemetry query
    await ServerLogger.logEvent(
      'ask-vraj',
      'success',
      `Processed Ask Vraj AI query: "${prompt.substring(0, 30)}..."`,
      { promptLength: prompt.length, sessionId: activeSessionId },
      true
    );

    // 2. Handle streaming
    const shouldStream = !!(
      stream ||
      req.headers.get('accept')?.includes('text/event-stream') ||
      req.headers.get('accept')?.includes('text/plain')
    );

    if (shouldStream) {
      const streamResult = await askVrajAIStream(prompt, history || []);

      let responseStream: ReadableStream;
      const encoder = new TextEncoder();

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
                const text = decoder.decode(value, { stream: true });
                const sanitizedText = sanitizeOutput(text);
                fullText += sanitizedText;
                controller.enqueue(encoder.encode(sanitizedText));
              }
              controller.close();

              // Log to database AFTER streaming completes
              if (isSupabaseAdminConfigured && activeSessionId) {
                try {
                  await (supabaseAdmin as any).from('ai_chat_messages').insert([
                    { session_id: activeSessionId, role: 'user', content: prompt },
                    { session_id: activeSessionId, role: 'assistant', content: fullText }
                  ]);
                } catch (dbErr) {
                  console.error('Supabase message log failed in simulated stream:', dbErr);
                }
              }
            } catch (err) {
              controller.error(err);
            }
          }
        });
      } else {
        // Real Gemini stream response
        responseStream = new ReadableStream({
          async start(controller) {
            try {
              let fullText = '';
              for await (const chunk of streamResult) {
                const text = chunk.text || '';
                const sanitizedText = sanitizeOutput(text);
                fullText += sanitizedText;
                controller.enqueue(encoder.encode(sanitizedText));
              }
              controller.close();

              // Log to database AFTER streaming completes
              if (isSupabaseAdminConfigured && activeSessionId) {
                try {
                  await (supabaseAdmin as any).from('ai_chat_messages').insert([
                    { session_id: activeSessionId, role: 'user', content: prompt },
                    { session_id: activeSessionId, role: 'assistant', content: fullText }
                  ]);
                } catch (dbErr) {
                  console.error('Supabase message log failed in real stream:', dbErr);
                }
              }
            } catch (err) {
              controller.error(err);
            }
          }
        });
      }

      const headers = new Headers({
        'Content-Type': 'text/plain; charset=utf-8',
      });
      if (activeSessionId) {
        headers.set('x-session-id', activeSessionId);
      }

      await MetricsCollector.recordApiLatency('/api/ask', Date.now() - startTime);
      return new Response(responseStream, { headers });
    }

    // 3. Fallback standard JSON response (non-streaming, e.g. for homepage preview)
    const aiResponse = await askVrajAI(prompt, history || []);
    const sanitizedResponse = sanitizeOutput(aiResponse);

    if (isSupabaseAdminConfigured && activeSessionId) {
      try {
        await (supabaseAdmin as any).from('ai_chat_messages').insert([
          { session_id: activeSessionId, role: 'user', content: prompt },
          { session_id: activeSessionId, role: 'assistant', content: sanitizedResponse }
        ]);
      } catch (dbErr) {
        console.error('Supabase message log failed in standard JSON ask:', dbErr);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (activeSessionId) {
      headers['x-session-id'] = activeSessionId;
    }

    await MetricsCollector.recordApiLatency('/api/ask', Date.now() - startTime);
    return new Response(JSON.stringify({ response: sanitizedResponse, sessionId: activeSessionId }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('API Error in /api/ask:', error);
    await ServerLogger.logEvent(
      'ask-vraj',
      'error',
      `AI Assistant query failed: ${error instanceof Error ? error.message : String(error)}`,
      { error: String(error) },
      false
    );
    await MetricsCollector.recordApiLatency('/api/ask', Date.now() - startTime);
    return NextResponse.json({ error: 'Failed to process AI query.' }, { status: 500 });
  }
}
