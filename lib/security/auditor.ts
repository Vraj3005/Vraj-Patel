import { ServerLogger } from '../telemetry/server-logger';
import { EventBus } from '../events/event-bus';

/**
 * Service to execute security audits and trace threat detection signatures
 */
export class SecurityAuditor {
  /**
   * Log an audit trail entry for administrative resource operations (e.g. login, edit)
   */
  public static async logAudit(
    action: string,
    username: string,
    success: boolean,
    details: Record<string, any> = {}
  ): Promise<void> {
    const message = success
      ? `Security Audit: Admin User '${username}' successfully executed action '${action}'.`
      : `Security Audit: Admin User '${username}' FAILED action '${action}'.`;

    const severity = success ? 'info' : 'warning';

    // 1. Log to event bus (trigger real-time logs alerts on developer console)
    await EventBus.publish('admin', severity, message, {
      action,
      username,
      success,
      ...details
    }, false);
  }

  /**
   * Logs blocked threat signatures (CORS, CSP, Rate limit overflows)
   */
  public static async logThreatBlocked(
    sourceIp: string,
    layerName: string,
    threatDetails: string
  ): Promise<void> {
    const message = `Threat Blocked: Layer '${layerName}' blocked request from IP '${sourceIp}'. Reason: ${threatDetails}`;

    await EventBus.publish('admin', 'error', message, {
      sourceIp,
      layerName,
      details: threatDetails
    }, false);

    // Accumulate blocked counts in metrics table
    await ServerLogger.logMetric('security_blocked_threats_count', 1, { layer: layerName });
  }
}
