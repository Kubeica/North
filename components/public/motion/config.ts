import type { Transition } from "framer-motion";

import { motion as motionTokens } from "@/components/public/theme/tokens";

export const easeOutExpo = motionTokens.easeOutExpo;

export const duration = {
  fast: motionTokens.durationFast,
  base: motionTokens.durationBase,
  slow: motionTokens.durationSlow,
} as const;

export function transition(
  durationKey: keyof typeof duration = "base",
  delay = 0,
): Transition {
  return {
    duration: duration[durationKey],
    delay,
    ease: easeOutExpo,
  };
}

export const fadeUpOffset = 24;
export const scaleFrom = 0.96;

export const viewportOnce = {
  once: true,
  margin: "-10% 0px",
} as const;

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: fadeUpOffset },
  show: {
    opacity: 1,
    y: 0,
    transition: transition("base"),
  },
} as const;
