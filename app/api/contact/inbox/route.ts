import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    // Verify passcode against environment variable exclusively (fail-closed if missing)
    const correctPasscode = process.env.INBOX_PASSCODE;
    if (!correctPasscode) {
      console.error('Inbox Secure Gate Error: INBOX_PASSCODE is not configured in server environment.');
      return NextResponse.json({ error: 'System configuration error. Access denied.' }, { status: 500 });
    }

    if (!passcode || passcode !== correctPasscode) {
      return NextResponse.json({ error: 'Unauthorized: Invalid passcode.' }, { status: 401 });
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
          // Map fields if local messages have slightly different keys
          const normalizedLocal = localMessages.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            status: m.status || 'new',
            created_at: m.createdAt || m.created_at || new Date().toISOString()
          }));
          
          // Merge local and remote data, deduplicate by email + subject + created_at combinations if needed,
          // or just merge if supabase failed. If supabase worked, we might want to display both or combine.
          if (messages.length === 0) {
            messages = normalizedLocal;
          } else {
            // Deduplicate by comparing keys
            const keySet = new Set(messages.map(m => `${m.email}-${m.subject}-${m.created_at?.substring(0, 16)}`));
            normalizedLocal.forEach((m: any) => {
              const key = `${m.email}-${m.subject}-${m.created_at?.substring(0, 16)}`;
              if (!keySet.has(key)) {
                messages.push(m);
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
  } catch (err: any) {
    console.error('Error in secure inbox API:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
