import { NextRequest, NextResponse } from 'next/server';
import { contactMessageSchema } from '@/lib/security/zod-schemas';
import { isRateLimited } from '@/lib/security/rate-limiter';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'messages.json');

// Fallback message logger for local simulations
function saveMessageLocally(messageData: { name: string; email: string; subject: string; message: string }) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let messages = [];
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      messages = JSON.parse(content || '[]');
    }

    const newMessage = {
      id: Math.random().toString(36).substring(2, 11),
      ...messageData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(dbPath, JSON.stringify(messages, null, 2));
    return newMessage;
  } catch (error) {
    console.error('Failed to log message locally:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // Rate Limiting Gate (3 inquiries per 5 minutes)
  if (isRateLimited(ip, 3, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Too many messages sent. Please throttle submissions.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const result = contactMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Input validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    // Honeypot anti-spam check (if bot filled the hidden input field)
    if (honeypot) {
      return NextResponse.json(
        { error: 'Spam validation check failed.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = (await createServerSupabaseClient()) as any;
      const { error } = await supabase.from('contact_messages').insert([
        {
          name,
          email,
          subject,
          message,
          status: 'new',
          rate_limit_ip: ip,
          spam_token_checked: true,
        },
      ]);
      if (error) throw error;
    } else {
      saveMessageLocally({ name, email, subject, message });
    }

    return NextResponse.json({
      success: true,
      message: 'Message successfully cataloged. Vraj will respond shortly.',
    });
  } catch (error) {
    console.error('API Contact Error:', error);
    return NextResponse.json(
      { error: 'Database synchronization failed. Please try again.' },
      { status: 500 }
    );
  }
}
