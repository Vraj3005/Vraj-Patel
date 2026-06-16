import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';

const dbPath = path.join(process.cwd(), 'db', 'messages.json');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const passcode = searchParams.get('passcode');

  const expectedPasscode = process.env.ADMIN_PASSCODE || '1234';

  // Security gate passcode validation
  if (!passcode || passcode !== expectedPasscode) {
    return NextResponse.json({ error: 'Invalid admin passcode authorization.' }, { status: 401 });
  }

  try {
    if (isSupabaseConfigured) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = (await createServerSupabaseClient()) as any;
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ messages: data || [] });
    } else {
      let messages = [];
      if (fs.existsSync(dbPath)) {
        const content = fs.readFileSync(dbPath, 'utf-8');
        messages = JSON.parse(content || '[]');
      }
      interface LocalMessage {
        createdAt: string;
      }
      // Sort messages by date descending (latest first)
      messages.sort(
        (a: LocalMessage, b: LocalMessage) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return NextResponse.json({ messages });
    }
  } catch (error) {
    console.error('Admin message retrieval failure:', error);
    return NextResponse.json({ error: 'Failed to fetch logs.' }, { status: 500 });
  }
}
