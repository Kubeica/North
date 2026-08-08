"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type AnimatedCounterProps = {
  value: string;
  className?: string;
};

function parseStat(value: string) {
  const match = value.trim().match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return { target: Number.NaN, suffix: "" };
  return {
    target: Number(match[1].replace(",", "")),
    suffix: match[2] ?? "",
  };
}

/**
 * Animates numeric portions of CMS statistic values (e.g. "320+" → count up).
 * SSR and first client paint always show the final value to avoid hydration mismatches.
 */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { target, suffix } = useMemo(() => parseStat(value), [value]);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduceMotion || !Number.isFinite(target)) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, target]);

  useEffect(() => {
    if (!started || reduceMotion || !Number.isFinite(target)) return;

    const duration = 1200;
    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(target * eased);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, reduceMotion, target, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
