"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

import { fadeUpOffset, transition } from "./config";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function FadeUp({
  children,
  className,
  delay = 0,
  y = fadeUpOffset,
}: FadeUpProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition("base", delay)}
    >
      {children}
    </motion.div>
  );
}
