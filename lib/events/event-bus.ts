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
    source: 'portfolio' | 'ask-vraj' | 'ask_vraj' | 'contact' | 'metrics' | 'github-sync' | 'github_sync' | 'cli' | 'analytics' | 'admin' | 'dashboard',
    severity: 'info' | 'success' | 'warning' | 'warn' | 'error' | 'trace',
    message: string,
    metadata?: Record<string, any>,
    isPublic: boolean = true
  ): Promise<LiveEventMessage> {
    const event: LiveEventMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      type: source as any,
      severity: severity as any,
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

    // Separated Server and Client paths to prevent silent drops of server events
    if (typeof window === 'undefined') {
      const { ServerLogger } = await import('../telemetry/server-logger');
      await ServerLogger.logEvent(source, severity, message, metadata || {}, isPublic);
    } else {
      await TelemetryClient.logEvent(source, severity, message, metadata, isPublic);
    }

    return event;
  }
}
