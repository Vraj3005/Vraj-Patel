"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { transitions } from "@/lib/motion/transition-presets";
import { RouteLoader } from "./route-loader";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Main wrapper that applies smooth slide, fade, and blur entry animations on page changes.
 * Tracks Next.js navigation events to show the HUD Route Loader.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotionSafe();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: shouldReduce ? 0 : 8,
      filter: shouldReduce ? "none" : "blur(4px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      <RouteLoader active={isTransitioning} />
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}

interface PageTitleRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Cinematic slide and blur title reveal animation for page headers.
 */
export function PageTitleReveal({ children, className }: PageTitleRevealProps) {
  const shouldReduce = useReducedMotionSafe();

  if (shouldReduce) {
    return <h1 className={className}>{children}</h1>;
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
        delay: 0.08,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={titleVariants}
      className="w-full"
    >
      <h1 className={className}>{children}</h1>
    </motion.div>
  );
}

interface SectionStaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerTime?: number;
}

/**
 * Standard container that staggers the animations of nested SectionItem components.
 */
export function SectionStagger({
  children,
  className,
  delay = 0.05,
  staggerTime = 0.06,
}: SectionStaggerProps) {
  const shouldReduce = useReducedMotionSafe();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerTime,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SectionItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard staggered animation item used inside SectionStagger.
 */
export function SectionItem({ children, className }: SectionItemProps) {
  const shouldReduce = useReducedMotionSafe();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        ...transitions.spring,
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
