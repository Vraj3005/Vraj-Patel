import { LiveEventMessage } from '@/types/advanced';
import { TelemetryClient } from '../telemetry/telemetry-client';

type EventCallback = (event: LiveEventMessage) => void;

/**
 * High-performance application Event Bus for local and dashboard event streaming
 */
export class EventBus {
  private static subscribers = new Set<EventCallback>();

  /**
   * Subscribe to live application events
   */
  public static subscribe(callback: EventCallback): () => void {
    this.subscribers.add(callback);
    // Return unsubscribe callback
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Publish a live telemetry event message to all subscribers and write to database logs
   */
  public static async publish(
    source: 'portfolio' | 'ask-vraj' | 'contact' | 'metrics' | 'github-sync' | 'cli' | 'analytics' | 'admin',
    severity: 'info' | 'success' | 'warning' | 'error' | 'trace',
    message: string,
    metadata?: Record<string, any>,
    isPublic: boolean = true
  ): Promise<LiveEventMessage> {
    const event: LiveEventMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      type: source,
      severity,
      message,
      metadata,
      is_public: isPublic
    };

    // Notify active subscribers (real-time TTY streams)
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error executing subscriber event callback:', err);
      }
    });

    // Write asynchronously to Supabase public.system_events logs or local fallback
    await TelemetryClient.logEvent(source, severity, message, metadata, isPublic);

    return event;
  }
}
