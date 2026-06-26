"use client";

import { useState, useEffect, RefObject } from "react";

interface IntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * Tracks whether a target element is in the viewport using IntersectionObserver.
 */
export function useIntersection(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { triggerOnce = false, threshold, root, rootMargin } = options;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && triggerOnce && ref.current) {
        observer.unobserve(ref.current);
      }
    }, { threshold, root, rootMargin });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, root, rootMargin, triggerOnce]);

  return isIntersecting;
}
