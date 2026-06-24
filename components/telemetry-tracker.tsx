'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { EventBus } from '@/lib/events/event-bus';

export default function TelemetryTracker() {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double logging on initial mount or react strict-mode re-renders
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    const logNavigation = async () => {
      try {
        // Send navigation trace to the telemetry logger
        await EventBus.publish(
          'portfolio',
          'info',
          `Page visit recorded: ${pathname}`,
          {
            path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : '',
          },
          true
        );
      } catch (err) {
        console.warn('Telemetry page navigation logging failed:', err);
      }
    };

    logNavigation();
  }, [pathname]);

  return null;
}
