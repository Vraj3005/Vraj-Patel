import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

export async function GET(_req: NextRequest) {
  try {
    const supabase = supabaseAdmin as any;

    let allEvents: any[] = [];
    let allMetrics: any[] = [];
    let dbViewsCount = 0;
    let dbAiRequestsCount = 0;
    let dbInquiriesCount = 0;
    let dbDownloadsCount = 0;
    let dbLatencyAvg = 0;
    let recentEvents: any[] = [];

    // 1. Fetch system_events from Supabase
    try {
      const { data: dbEvents, error: dbErr } = await supabase
        .from('system_events')
        .select('*');
      if (dbEvents && !dbErr) {
        allEvents = dbEvents;
      }
    } catch (err) {
      console.warn('Supabase system_events fetch failed:', err);
    }

    // 2. Read events from local fallback JSON file
    try {
      const dbPath = path.join(process.cwd(), 'db', 'system_events.json');
      if (fs.existsSync(dbPath)) {
        const content = fs.readFileSync(dbPath, 'utf-8');
        const localEvents = JSON.parse(content || '[]');
        if (Array.isArray(localEvents)) {
          // Merge and deduplicate by event ID
          const eventMap = new Map();
          allEvents.forEach(e => {
            if (e.id) eventMap.set(e.id, e);
          });
          localEvents.forEach(e => {
            if (e && e.id && !eventMap.has(e.id)) {
              eventMap.set(e.id, e);
            }
          });
          allEvents = Array.from(eventMap.values());
        }
      }
    } catch (fsErr) {
      console.warn('Error reading fallback JSON in stats API:', fsErr);
    }

    // 3. Count views & AI requests
    dbViewsCount = allEvents.filter(e => e && e.event_type === 'portfolio' && e.severity === 'info').length;
    dbAiRequestsCount = allEvents.filter(e => e && e.event_type === 'ask-vraj').length;

    // 4. Inquiries
    dbInquiriesCount = allEvents.filter(e => e && e.event_type === 'contact' && e.severity === 'success').length;
    try {
      const messagesPath = path.join(process.cwd(), 'db', 'messages.json');
      if (fs.existsSync(messagesPath)) {
        const content = fs.readFileSync(messagesPath, 'utf-8');
        const localMessages = JSON.parse(content || '[]');
        if (Array.isArray(localMessages)) {
          dbInquiriesCount = Math.max(dbInquiriesCount, localMessages.length);
        }
      }
    } catch (e) {
      console.warn('Error reading fallback messages JSON:', e);
    }
    try {
      const { count } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
      if (count) dbInquiriesCount = Math.max(dbInquiriesCount, count);
    } catch (_e) {}

    // 5. Resume downloads
    dbDownloadsCount = allEvents.filter(e => e && e.event_type === 'portfolio' && e.severity === 'success').length;
    try {
      const { count } = await supabase.from('resume_downloads').select('*', { count: 'exact', head: true });
      if (count) dbDownloadsCount = Math.max(dbDownloadsCount, count);
    } catch (_e) {}

    // 6. Fetch metrics_snapshots from Supabase
    try {
      const { data: dbMetrics } = await supabase
        .from('metrics_snapshots')
        .select('*')
        .eq('metric_name', 'api_latency_ms');
      if (dbMetrics) allMetrics = dbMetrics;
    } catch (_e) {}

    // 7. Read metrics from local fallback JSON file
    try {
      const dbPath = path.join(process.cwd(), 'db', 'metrics_snapshots.json');
      if (fs.existsSync(dbPath)) {
        const content = fs.readFileSync(dbPath, 'utf-8');
        const localMetrics = JSON.parse(content || '[]');
        if (Array.isArray(localMetrics)) {
          const filteredLocal = localMetrics.filter(m => m.metric_name === 'api_latency_ms');
          const metricMap = new Map();
          allMetrics.forEach(m => { if (m.id) metricMap.set(m.id, m); });
          filteredLocal.forEach(m => {
            if (m && m.id && !metricMap.has(m.id)) {
              metricMap.set(m.id, m);
            }
          });
          allMetrics = Array.from(metricMap.values());
        }
      }
    } catch (_e) {}

    // 8. Calculate avg latency
    if (allMetrics.length > 0) {
      const sum = allMetrics.reduce((acc: number, curr: any) => acc + Number(curr.metric_value), 0);
      dbLatencyAvg = Math.round(sum / allMetrics.length);
    } else {
      dbLatencyAvg = 112; // default fallback if no latency metrics exist yet
    }

    // 9. Calculate system health availability dynamically
    const totalEventsCount = allEvents.length;
    const errorEventsCount = allEvents.filter(e => e && (e.severity === 'error' || e.severity === 'danger' || e.severity === 'critical')).length;
    let systemHealth = '100.0%';
    if (totalEventsCount > 0) {
      const successRate = ((totalEventsCount - errorEventsCount) / totalEventsCount) * 100;
      systemHealth = `${successRate.toFixed(2)}%`;
    }

    // 10. Generate last 7 days timeline dynamically
    const timeline = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`; // YYYY-MM-DD

      const viewsOnDay = allEvents.filter(e => {
        if (!e) return false;
        const eDate = e.created_at || e.timestamp;
        if (typeof eDate !== 'string') return false;
        return eDate.startsWith(dateKey) && e.event_type === 'portfolio' && e.severity === 'info';
      }).length;

      const aiOnDay = allEvents.filter(e => {
        if (!e) return false;
        const eDate = e.created_at || e.timestamp;
        if (typeof eDate !== 'string') return false;
        return eDate.startsWith(dateKey) && e.event_type === 'ask-vraj';
      }).length;

      const downloadsOnDay = allEvents.filter(e => {
        if (!e) return false;
        const eDate = e.created_at || e.timestamp;
        if (typeof eDate !== 'string') return false;
        return eDate.startsWith(dateKey) && e.event_type === 'portfolio' && e.severity === 'success';
      }).length;

      timeline.push({
        date: dateStr,
        'Page Views': viewsOnDay,
        'AI Queries': aiOnDay,
        'Resume Downloads': downloadsOnDay,
      });
    }

    // 11. Generate recent 5 public events
    const publicEvents = allEvents
      .filter(e => e && e.is_public === true)
      .sort((a, b) => {
        if (!a || !b) return 0;
        const aTime = new Date(a.created_at || a.timestamp || 0).getTime() || 0;
        const bTime = new Date(b.created_at || b.timestamp || 0).getTime() || 0;
        return bTime - aTime;
      });

    recentEvents = publicEvents.slice(0, 5).map(e => ({
      id: e.id || Math.random().toString(36).substring(2, 9),
      timestamp: e.created_at || e.timestamp || new Date().toISOString(),
      type: e.event_type || 'portfolio',
      severity: e.severity || 'info',
      message: e.message || 'No description provided.',
    }));

    const isDemoMode = !isSupabaseAdminConfigured || allEvents.length === 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalViews: dbViewsCount,
        totalAiQueries: dbAiRequestsCount,
        totalInquiries: dbInquiriesCount,
        totalResumeDownloads: dbDownloadsCount,
        avgLatency: dbLatencyAvg,
        systemHealth,
        isDemoMode,
      },
      timeline,
      recentEvents,
    });
  } catch (err) {
    console.error('Error compiling public dashboard stats:', err);
    return NextResponse.json({ error: 'Failed to retrieve telemetry stats.' }, { status: 500 });
  }
}
