/**
 * Northern Meteor — Public Design System tokens.
 *
 * CSS variable counterparts (see `app/globals.css`):
 * - colors → --background, --surface, --surface-2, --foreground, --muted-foreground,
 *   --gold, --gold-light, --navy, --border (+ --nm-* aliases where noted)
 * - spacing → --nm-section-y, --nm-section-y-md, --nm-gutter, --nm-gap
 * - radii → --nm-radius-sm|md|lg
 * - shadows → --nm-shadow-subtle, --nm-shadow-elevate
 * - typography → --nm-text-display|h1|h2|h3|h4|lead|body|caption
 * - containers → --nm-container-sm|md|lg|xl (and --nm-container for lg)
 * - motion → --nm-duration-fast|base|slow, --nm-ease-out-expo
 * - zIndex → --nm-z-nav, --nm-z-overlay
 */

export const colors = {
  background: "#0B0D0F",
  surface: "#12161A",
  surface2: "#181D22",
  text: "#F5F5F5",
  muted: "#A7ADB4",
  gold: "#C9A227",
  goldLight: "#E0BD4F",
  navy: "#0F1A2B",
  border: "rgb(255 255 255 / 0.1)",
} as const;

export const spacing = {
  sectionY: "4rem",
  sectionYMd: "6rem",
  gutter: "1.5rem",
  gap: "1.5rem",
} as const;

/** Architectural radii — restrained, not pill-like. */
export const radii = {
  none: "0",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
} as const;

export const shadows = {
  subtle: "0 1px 2px rgb(0 0 0 / 0.24)",
  elevate: "0 12px 40px rgb(0 0 0 / 0.35)",
} as const;

export const typography = {
  display: {
    fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    fontWeight: "600",
  },
  h1: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    fontWeight: "600",
  },
  h2: {
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
    lineHeight: "1.2",
    letterSpacing: "-0.015em",
    fontWeight: "600",
  },
  h3: {
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
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
    lineHeight: "1.65",
    fontWeight: "400",
  },
  body: {
    fontSize: "1rem",
    lineHeight: "1.7",
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
  lg: "64rem",
  xl: "80rem",
  full: "100%",
} as const;

export const motion = {
  durationFast: 0.2,
  durationBase: 0.45,
  durationSlow: 0.7,
  /** cubic-bezier(0.22, 1, 0.36, 1) */
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
