"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";
import { zIndex } from "@/components/public/theme/tokens";
import { cn } from "@/components/public/theme/utils";
import { Logo } from "@/components/layout/Logo";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/projects", key: "projects" as const },
  { href: "/contact", key: "contact" as const },
];

type NavbarProps = {
  shortName?: string;
};

export function Navbar({ shortName }: NavbarProps) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled || open
          ? "border-b border-border/80 bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
      style={{ zIndex: zIndex.nav }}
    >
      <div className="nm-container flex h-16 items-center justify-between gap-4">
        <Logo shortName={shortName} />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={t("mainNav")}
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          <PublicButton
            href="/contact"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {tCta("contactUs")}
          </PublicButton>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border bg-background/95 backdrop-blur-md lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          className="nm-container flex flex-col gap-1 py-4"
          aria-label={t("mainNav")}
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className="rounded-md px-3 py-3 text-sm text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {t(item.key)}
              </Link>
            );
          })}
          <PublicButton
            href="/contact"
            className="mt-2 w-full"
            onClick={closeMenu}
          >
            {tCta("contactUs")}
          </PublicButton>
        </nav>
      </div>
    </header>
  );
}
