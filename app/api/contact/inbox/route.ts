import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const correctPasscode = process.env.INBOX_PASSCODE;
    if (!correctPasscode) {
      console.error('Inbox Secure Gate Error: INBOX_PASSCODE is not configured in server environment.');
      return NextResponse.json({ error: 'System configuration error. Access denied.' }, { status: 500 });
    }

    let passcode: string | undefined;
    let lock = false;
    try {
      const body = await req.json();
      if (body) {
        passcode = body.passcode;
        lock = !!body.lock;
      }
    } catch (_) {
      // Body may be empty or missing
    }

    const cookieStore = await cookies();

    // 1. Handle lock/clear request
    if (lock || passcode === '') {
      cookieStore.delete('inbox_session');
      return NextResponse.json({ success: true, messages: [] });
    }

    // 2. If passcode is provided in payload (login attempt)
    if (passcode !== undefined) {
      if (passcode !== correctPasscode) {
        return NextResponse.json({ error: 'Unauthorized: Invalid passcode.' }, { status: 401 });
      }
      // Set HttpOnly secure session cookie
      cookieStore.set('inbox_session', passcode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours
      });
    } else {
      // 3. Mount validation (no passcode in body, read from cookie)
      const sessionValue = cookieStore.get('inbox_session')?.value;
      if (!sessionValue || sessionValue !== correctPasscode) {
        return NextResponse.json({ error: 'Unauthorized: Invalid passcode.' }, { status: 401 });
      }
    }

    let messages: any[] = [];

    // 1. Fetch from Supabase if configured
    if (isSupabaseAdminConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && !error) {
          messages = data;
        } else if (error) {
          console.warn('Supabase query error inside secure inbox API:', error);
        }
      } catch (dbErr) {
        console.warn('Supabase contact_messages query failed inside secure inbox API:', dbErr);
      }
    }

    // 2. Fetch from local fallback database
    try {
      const localPath = path.join(process.cwd(), 'db', 'messages.json');
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        const localMessages = JSON.parse(content || '[]');
        if (Array.isArray(localMessages)) {
          const normalizedLocal = localMessages.map((m: any) => {
            let status = m.status || 'new';
            if (status === 'unread') status = 'new';
            if (status === 'read') status = 'reviewed';
            return {
              id: m.id,
              name: m.name,
              email: m.email,
              subject: m.subject,
              message: m.message,
              status,
              created_at: m.createdAt || m.created_at || new Date().toISOString()
            };
          });
          
          // Merge local and remote data, deduplicate by email + subject + created_at combinations if needed,
          // or just merge if supabase failed. If supabase worked, we might want to display both or combine.
          if (messages.length === 0) {
            messages = normalizedLocal;
          } else {
            // Deduplicate by comparing keys (ID first if stable, then fallback to email + subject + created_at)
            const idSet = new Set(messages.filter(m => m.id).map(m => String(m.id)));
            const keySet = new Set();
            messages.forEach(m => {
              if (m.email && m.subject && m.created_at) {
                const dateObj = new Date(m.created_at);
                if (dateObj && !isNaN(dateObj.getTime())) {
                  keySet.add(`${m.email.toLowerCase()}-${m.subject.toLowerCase()}-${dateObj.toISOString().substring(0, 16)}`);
                }
              }
            });

            normalizedLocal.forEach((m: any) => {
              // 1. If stable ID matches an existing database message, skip
              if (m.id && idSet.has(String(m.id))) {
                return;
              }
              
              // 2. If it has no valid created_at, do NOT collapse/deduplicate it, just push it
              if (!m.created_at) {
                messages.push(m);
                return;
              }
              const dateObj = new Date(m.created_at);
              if (isNaN(dateObj.getTime())) {
                messages.push(m);
                return;
              }
              
              const dateStr = dateObj.toISOString();
              const key = `${m.email.toLowerCase()}-${m.subject.toLowerCase()}-${dateStr.substring(0, 16)}`;
              
              // 3. Deduplicate based on email + subject + created_at
              if (!keySet.has(key)) {
                messages.push(m);
                keySet.add(key);
              }
            });
          }
        }
      }
    } catch (fsErr) {
      console.warn('Local messages fallback reader failed in secure inbox API:', fsErr);
    }

    // Sort combined messages by created_at descending
    messages.sort((a, b) => {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });

    return NextResponse.json({ success: true, messages });
  } catch (err: unknown) {
    console.error('Error in secure inbox API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
