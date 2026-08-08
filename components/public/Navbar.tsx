"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

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
  logoUrl?: string | null;
};

export function Navbar({ shortName, logoUrl }: NavbarProps) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
        scrolled || open
          ? "border-b border-border/80 bg-background/96 shadow-[0_1px_0_rgb(201_162_39/0.14)] backdrop-blur-md"
          : "border-b border-white/10 bg-transparent",
      )}
      style={{ zIndex: zIndex.nav }}
    >
      <div className="nm-container flex h-[4.25rem] items-center justify-between gap-4 md:h-[4.75rem]">
        <Logo
          shortName={shortName}
          logoUrl={logoUrl}
          className="text-[1.05rem] sm:text-xl"
        />

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
                  "relative px-3.5 py-2 text-[0.9375rem] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active
                    ? "font-medium text-gold"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {t(item.key)}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold"
                  />
                ) : null}
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
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        className={cn(
          "border-t border-border/80 bg-background lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          className="nm-container flex flex-col gap-1 py-5"
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
                className={cn(
                  "rounded-sm px-3 py-3.5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active
                    ? "bg-surface text-gold"
                    : "text-foreground hover:bg-surface/80",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <PublicButton
            href="/contact"
            className="mt-3 w-full"
            onClick={closeMenu}
          >
            {tCta("contactUs")}
          </PublicButton>
        </nav>
      </div>
    </header>
  );
}
