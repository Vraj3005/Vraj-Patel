"use client";

import React from "react";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * Next.js App Router Template.
 * Instantiated on every page navigation to trigger entrance transitions reliably.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
