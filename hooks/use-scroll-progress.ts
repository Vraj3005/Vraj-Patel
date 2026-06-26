"use client";

import { useState, useEffect, RefObject } from "react";

/**
 * Tracks the scroll progress of a window or container.
 * Returns a number between 0 and 1 representing the scroll progress.
 */
export function useScrollProgress(ref?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (ref?.current) {
          const element = ref.current;
          const scrollTop = element.scrollTop;
          const scrollHeight = element.scrollHeight - element.clientHeight;
          setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
        } else {
          const scrollTop = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
        }
      });
    };

    if (ref?.current) {
      const element = ref.current;
      element.addEventListener("scroll", handleScroll, { passive: true });
      // Initial trigger
      handleScroll();
      return () => {
        element.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(frameId);
      };
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
      // Initial trigger
      handleScroll();
      return () => {
        window.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(frameId);
      };
    }
  }, [ref]);

  return progress;
}
