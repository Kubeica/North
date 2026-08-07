import { ExternalLink, Globe, Link2, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/components/public/theme/utils";

export type SocialLink = {
  network: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube" | string;
  href: string;
  label?: string;
};

/** Lucide no longer ships brand marks — use restrained generic icons. */
const ICONS: Record<string, LucideIcon> = {
  facebook: Globe,
  instagram: Share2,
  linkedin: Link2,
  twitter: Globe,
  youtube: ExternalLink,
};

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
};

export function SocialLinks({ links, className }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => {
        const Icon = ICONS[link.network.toLowerCase()] ?? Share2;
        return (
          <li key={`${link.network}-${link.href}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label ?? link.network}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-gold"
            >
              <Icon className="size-4" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
