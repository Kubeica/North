import { cn } from "@/lib/utils";

import type { SectionTone } from "./tokens";

export { cn };

const toneClasses: Record<SectionTone, string> = {
  dark: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  navy: "bg-navy text-foreground",
  transparent: "bg-transparent text-foreground",
};

/** Background / tone utility for public sections. */
export function sectionToneClass(tone: SectionTone = "dark"): string {
  return toneClasses[tone];
}
