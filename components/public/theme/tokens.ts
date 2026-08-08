/**
 * Northern Meteor — Public Design System tokens.
 * Tuned to the Design D reference: cinematic charcoal, graphite, construction gold.
 */

export const colors = {
  background: "#0A0C0E",
  surface: "#111418",
  surface2: "#171C21",
  text: "#F4F2ED",
  muted: "#8B93A0",
  gold: "#C9A227",
  goldLight: "#DDBB4A",
  navy: "#0C1522",
  border: "rgb(255 255 255 / 0.08)",
} as const;

export const spacing = {
  sectionY: "3.5rem",
  sectionYMd: "5.5rem",
  gutter: "1.25rem",
  gap: "1.25rem",
} as const;

/** Architectural radii — sharp, corporate (≈4–6px). */
export const radii = {
  none: "0",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
} as const;

export const shadows = {
  subtle: "0 1px 0 rgb(255 255 255 / 0.04)",
  elevate: "0 24px 64px rgb(0 0 0 / 0.45)",
} as const;

export const typography = {
  display: {
    fontSize: "clamp(2.35rem, 5.5vw, 4.5rem)",
    lineHeight: "1.08",
    letterSpacing: "-0.025em",
    fontWeight: "700",
  },
  h1: {
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)",
    lineHeight: "1.12",
    letterSpacing: "-0.02em",
    fontWeight: "700",
  },
  h2: {
    fontSize: "clamp(1.55rem, 3vw, 2.5rem)",
    lineHeight: "1.18",
    letterSpacing: "-0.015em",
    fontWeight: "600",
  },
  h3: {
    fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
    fontWeight: "600",
  },
  h4: {
    fontSize: "1.125rem",
    lineHeight: "1.35",
    letterSpacing: "-0.01em",
    fontWeight: "600",
  },
  lead: {
    fontSize: "1.125rem",
    lineHeight: "1.7",
    fontWeight: "400",
  },
  body: {
    fontSize: "1rem",
    lineHeight: "1.75",
    fontWeight: "400",
  },
  caption: {
    fontSize: "0.8125rem",
    lineHeight: "1.5",
    fontWeight: "400",
  },
} as const;

export const containers = {
  sm: "40rem",
  md: "48rem",
  lg: "68rem",
  xl: "84rem",
  full: "100%",
} as const;

export const motion = {
  durationFast: 0.2,
  durationBase: 0.5,
  durationSlow: 0.8,
  easeOutExpo: [0.22, 1, 0.36, 1] as const,
} as const;

export const zIndex = {
  nav: 50,
  overlay: 60,
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  containers,
  motion,
  zIndex,
} as const;

export type SectionTone = "dark" | "surface" | "navy" | "transparent";
export type ContainerSize = keyof typeof containers;
export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";
