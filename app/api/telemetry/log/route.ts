import { NextRequest, NextResponse } from 'next/server';
import { ServerLogger } from '@/lib/telemetry/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/simple';
import fs from 'fs';
import path from 'path';
import * as z from 'zod';

const telemetryLogSchema = z.object({
  source: z.enum(['portfolio', 'ask-vraj', 'contact', 'metrics', 'github-sync', 'cli', 'analytics', 'admin']),
  severity: z.enum(['info', 'success', 'warning', 'error', 'trace']),
  message: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  isPublic: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = telemetryLogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid telemetry payload structure.', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { source, severity, message, metadata, isPublic } = result.data;

    // Execute server-side logging using ServerLogger
    await ServerLogger.logEvent(source, severity, message, metadata || {}, isPublic);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error logging telemetry event through API gateway:', err);
    return NextResponse.json({ error: 'Internal telemetry ingestion failure.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // 1. Resolve authorization boundary (check if admin is authenticated)
    let isAdmin = false;
    if (isSupabaseConfigured) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: adminUser } = await (supabase as any)
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();
          isAdmin = !!adminUser;
        }
      } catch (e) {
        // Safe catch
      }
    }

    // 2. Fetch logs from either database or JSON file fallback
    if (isSupabaseConfigured) {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase.from('system_events').select('*');

        // public users are restricted to public logs
        if (!isAdmin) {
          query = query.eq('is_public', true);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Reverse chronological order for linear streaming feel (oldest at top, newest at bottom)
        const formatted = (data || []).map((e: any) => ({
          id: e.id,
          timestamp: e.created_at,
          type: e.event_type as any,
          severity: e.severity as any,
          message: e.message,
          metadata: e.metadata,
          is_public: e.is_public,
        }));

        return NextResponse.json({ data: formatted.reverse() });
      } catch (dbErr) {
        console.warn('Supabase telemetry query failed, falling back to local JSON datastore:', dbErr);
      }
    }

    // Fallback: Local JSON file query
    const dbPath = path.join(process.cwd(), 'db', 'system_events.json');
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ data: [] });
    }

    const content = fs.readFileSync(dbPath, 'utf-8');
    let events = JSON.parse(content || '[]');

    if (!isAdmin) {
      events = events.filter((e: any) => e.is_public === true);
    }

    // Slice last N and map properties
    let slice = events.slice(-limit);
    const formatted = slice.map((e: any) => ({
      id: e.id,
      timestamp: e.created_at,
      type: e.event_type,
      severity: e.severity,
      message: e.message,
      metadata: e.metadata,
      is_public: e.is_public,
    }));

    return NextResponse.json({ data: formatted });
  } catch (err) {
    console.error('Error fetching telemetry logs:', err);
    return NextResponse.json({ error: 'Failed to fetch telemetry events.' }, { status: 500 });
  }
}
