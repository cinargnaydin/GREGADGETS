"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type GlowButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function GlowButton({ href, children, className }: GlowButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Link href={href} className="inline-block">
      <motion.span
        className={clsx(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-3 text-sm font-semibold text-white shadow-glow",
          "bg-gradient-to-r from-brand-red to-brand-red-dark transition-all duration-300 hover:shadow-glow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red",
          className
        )}
        whileHover={reducedMotion ? undefined : { scale: 1.04, boxShadow: "0 0 44px rgba(203, 30, 39, 0.62)" }}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
      >
        <span className="absolute inset-0 animate-glow-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent motion-reduce:hidden" />
        <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/35 to-transparent motion-reduce:hidden" />
        <span className="relative z-10">{children}</span>
      </motion.span>
    </Link>
  );
}
