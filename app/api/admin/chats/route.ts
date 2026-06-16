import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('passcode');

  const expectedPasscode = process.env.ADMIN_PASSCODE || '1234';

  // Passcode security gate
  if (!passcode || passcode !== expectedPasscode) {
    return NextResponse.json({ error: 'Invalid admin passcode authorization.' }, { status: 401 });
  }

  try {
    if (!isSupabaseConfigured) {
      // Mock chat sessions for offline dev environment
      const mockSessions = [
        {
          id: 'mock-session-1',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          title: 'Query: Who is Vraj Patel?...',
          user_ip: '127.0.0.1',
          messages: [
            { role: 'user', content: 'Who is Vraj Patel?' },
            { role: 'assistant', content: 'Vraj Patel is a 4th-year CSE student at Nirma University. He builds full-stack applications, ERP systems, dashboards, and quantitative research platforms.' }
          ]
        },
        {
          id: 'mock-session-2',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          title: 'Query: Explain Enermass Solar...',
          user_ip: '192.168.1.50',
          messages: [
            { role: 'user', content: 'Explain Enermass Solar ERP.' },
            { role: 'assistant', content: 'Enermass Solar Calculator & ERP is a custom project management software combining 3D roof mapping, quotation calculation, pricing logic, and subsidy handling. It achieved a 99.4% solar forecast accuracy and offloaded calculations to client-side GPU shaders.' }
          ]
        }
      ];
      return NextResponse.json({ sessions: mockSessions });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createServerSupabaseClient()) as any;
    
    // Fetch sessions
    const { data: sessionsData, error: sessionsErr } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionsErr) throw sessionsErr;

    if (!sessionsData || sessionsData.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    // Fetch messages
    const { data: messagesData, error: messagesErr } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (messagesErr) throw messagesErr;

    // Group messages by session_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messagesBySession: Record<string, any[]> = {};
    if (messagesData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messagesData.forEach((msg: any) => {
        if (!messagesBySession[msg.session_id]) {
          messagesBySession[msg.session_id] = [];
        }
        messagesBySession[msg.session_id].push({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        });
      });
    }

    // Combine sessions with their messages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions = sessionsData.map((session: any) => ({
      id: session.id,
      created_at: session.created_at,
      title: session.title,
      user_ip: session.user_ip,
      messages: messagesBySession[session.id] || []
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Admin chat logs retrieval failure:', error);
    return NextResponse.json({ error: 'Failed to fetch chat logs.' }, { status: 500 });
  }
}
