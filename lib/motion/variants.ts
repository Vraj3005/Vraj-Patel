import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", ...custom },
  }),
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20, ...custom },
  }),
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20, ...custom },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerChildren ?? 0.1,
      delayChildren: custom.delayChildren ?? 0,
      ...custom,
    },
  }),
};

export const hoverScale: Variants = {
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.98,
  },
};
