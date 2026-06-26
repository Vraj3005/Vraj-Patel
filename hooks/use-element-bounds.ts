"use client";

import { useState, useEffect, RefObject } from "react";

interface Bounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Tracks the bounding rect dimensions and position of a target element.
 * Updates dynamically on resize, scroll, or element dimension shifts.
 */
export function useElementBounds(ref: RefObject<HTMLElement | null>): Bounds {
  const [bounds, setBounds] = useState<Bounds>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      setBounds({
        width: rect.width,
        height: rect.height,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    // Initialize bounds
    updateBounds();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        updateBounds();
      });
      observer.observe(element);

      window.addEventListener("resize", updateBounds, { passive: true });
      window.addEventListener("scroll", updateBounds, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateBounds);
        window.removeEventListener("scroll", updateBounds);
      };
    } else {
      // Fallback if ResizeObserver is not supported
      window.addEventListener("resize", updateBounds, { passive: true });
      window.addEventListener("scroll", updateBounds, { passive: true });

      return () => {
        window.removeEventListener("resize", updateBounds);
        window.removeEventListener("scroll", updateBounds);
      };
    }
  }, [ref]);

  return bounds;
}
