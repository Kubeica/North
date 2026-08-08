"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Layout wrapper that keeps section content visible immediately.
 * Avoids opacity:0 / translate placeholders that read as empty space in PDF/exports.
 */
export function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div className={cn(className)} initial={false}>
      {children}
    </motion.div>
  );
}
