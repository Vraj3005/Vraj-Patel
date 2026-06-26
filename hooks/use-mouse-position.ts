"use client";

import { useEffect, useState, RefObject } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks the mouse cursor position.
 * If a container ref is provided, coordinates are relative to that container.
 * Otherwise, coordinates are relative to the client viewport.
 */
export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    let frameId: number;

    const handleMouseMove = (event: MouseEvent) => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        } else {
          setMousePosition({
            x: event.clientX,
            y: event.clientY,
          });
        }
      });
    };

    if (ref?.current) {
      const element = ref.current;
      element.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(frameId);
      };
    } else {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(frameId);
      };
    }
  }, [ref]);

  return mousePosition;
}
