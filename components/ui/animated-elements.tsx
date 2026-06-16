'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  divisor?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 1500,
  suffix = '',
  decimals = 0,
  divisor = 1,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimation]);

  const displayValue = divisor > 1
    ? (count / divisor).toFixed(decimals)
    : count.toString();

  return (
    <div ref={containerRef} className={`tabular-nums ${className}`}>
      {displayValue}{suffix}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Terminal with typing animation
   ───────────────────────────────────────────── */
interface TerminalBlockProps {
  lines: string[];
  speed?: number;
  lineDelay?: number;
}

export function TerminalBlock({ lines, speed = 30, lineDelay = 400 }: TerminalBlockProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const lineRef = useRef(0);
  const charRef = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const tick = () => {
      const li = lineRef.current;
      const ch = charRef.current;

      if (li >= lines.length) {
        setShowCursor(false);
        return;
      }

      const line = lines[li];

      if (ch <= line.length) {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[li] = line.substring(0, ch);
          return next;
        });
        charRef.current += 1;
        timeout = setTimeout(tick, speed);
      } else {
        // Move to next line
        lineRef.current += 1;
        charRef.current = 0;
        timeout = setTimeout(tick, lineDelay);
      }
    };

    timeout = setTimeout(tick, 300); // Initial delay
    return () => clearTimeout(timeout);
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-1.5 font-mono text-[13px] min-h-[200px]">
      {displayedLines.map((line, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            line.startsWith('$')
              ? 'text-secondary'
              : line.startsWith('→')
                ? 'text-foreground'
                : 'text-muted'
          }
        >
          {line}
        </motion.div>
      ))}
      {showCursor && (
        <span className="cursor-blink text-foreground">▊</span>
      )}
    </div>
  );
}
