import { NextRequest, NextResponse } from 'next/server';
import { ServerLogger } from '@/lib/telemetry/server-logger';
import * as z from 'zod';

const metricPayloadSchema = z.object({
  metricName: z.string().min(1).max(100),
  metricValue: z.number(),
  tags: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = metricPayloadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid metric payload structure.', details: result.error.flatten() },
        { status: 400 }
      );
    }
    const { metricName, metricValue, tags } = result.data;
    await ServerLogger.logMetric(metricName, metricValue, tags || {});
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error ingesting telemetry metric via API:', err);
    return NextResponse.json({ error: 'Internal telemetry ingestion failure.' }, { status: 500 });
  }
}
