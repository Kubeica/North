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
 * Non-numeric strings render as-is. Respects prefers-reduced-motion.
 */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { target, suffix } = useMemo(() => parseStat(value), [value]);
  const canAnimate = !reduceMotion && Number.isFinite(target);

  const [display, setDisplay] = useState(canAnimate ? `0${suffix}` : value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!canAnimate) return;

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
  }, [canAnimate]);

  useEffect(() => {
    if (!started || !canAnimate) return;

    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
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
  }, [started, canAnimate, target, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {canAnimate ? display : value}
    </span>
  );
}
