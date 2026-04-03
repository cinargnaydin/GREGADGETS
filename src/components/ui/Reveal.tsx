"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 30,
  className,
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = () => {
    switch (direction) {
      case "up":
        return { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 } };
      case "down":
        return { initial: { opacity: 0, y: -distance }, animate: { opacity: 1, y: 0 } };
      case "left":
        return { initial: { opacity: 0, x: -distance }, animate: { opacity: 1, x: 0 } };
      case "right":
        return { initial: { opacity: 0, x: distance }, animate: { opacity: 1, x: 0 } };
      case "none":
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      default:
        return { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 } };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      whileInView={variants.animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
