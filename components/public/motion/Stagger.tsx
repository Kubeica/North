"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

import { staggerContainer, staggerItem, viewportOnce } from "./config";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
};

/** Stagger children stay visible — no opacity:0 empty regions. */
export function Stagger({ children, className, once = true }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial={false}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ ...viewportOnce, once, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={reduceMotion ? undefined : staggerItem}
      initial={false}
    >
      {children}
    </motion.div>
  );
}
