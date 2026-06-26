import { Transition } from "framer-motion";

export const transitions = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as Transition,
  
  springSloppy: {
    type: "spring",
    stiffness: 150,
    damping: 15,
  } as Transition,
  
  springStiff: {
    type: "spring",
    stiffness: 500,
    damping: 40,
  } as Transition,
  
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  } as Transition,
  
  slow: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.6,
  } as Transition,
  
  linear: {
    type: "tween",
    ease: "linear",
    duration: 0.2,
  } as Transition,
};
