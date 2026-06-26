"use client";

import { useReducedMotion } from "framer-motion";

/**
 * A custom hook to safely determine if the user has requested reduced motion.
 * Returns true if reduced motion is preferred, false otherwise.
 */
export function useReducedMotionSafe(): boolean {
  const shouldReduce = useReducedMotion();
  return shouldReduce === true;
}
