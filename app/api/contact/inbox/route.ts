import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/require-admin';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // Enforce administrative authentication check
    const { admin, error, status } = await requireAdmin();
    if (error || !admin) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: status || 401 });
    }

    let messages: any[] = [];

    // 1. Fetch from Supabase if configured
    if (isSupabaseAdminConfigured) {
      try {
        const { data, error: dbErr } = await supabaseAdmin
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && !dbErr) {
          messages = data;
        } else if (dbErr) {
          console.warn('Supabase query error inside secure inbox API:', dbErr);
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
          
          if (messages.length === 0) {
            messages = normalizedLocal;
          } else {
            // Deduplicate by comparing keys
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
              if (m.id && idSet.has(String(m.id))) {
                return;
              }
              
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
