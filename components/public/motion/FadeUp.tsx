"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Keep content visible immediately — no opacity:0 empty regions in PDF/SSR.
 */
export function FadeUp({ children, className }: FadeUpProps) {
  return (
    <motion.div className={cn(className)} initial={false}>
      {children}
    </motion.div>
  );
}
