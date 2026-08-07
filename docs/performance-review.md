# Performance review (production polish)

**Date:** 2026-08-08  
**Score:** **7.5 / 10** (service detail moved from `force-dynamic` → ISR `revalidate = 60`)

Lab Core Web Vitals were not measured in this pass — scores are readiness assessments from code structure.

## What’s in good shape

- ISR (`revalidate = 60`) on major public pages including service detail
- `unstable_cache` on projects/services list reads
- `experimental.optimizePackageImports` for lucide / framer-motion / date-fns
- `next/image` with AVIF/WebP, tuned device sizes, 30-day cache TTL
- Hero images use `priority` / `fetchPriority="high"` where intended
- `next/font` with `display: "swap"` and preload
- Home `ClientsMarquee` is dynamically imported
- Map iframes use `loading="lazy"`

## Gaps / risks

| Severity | Topic | Detail |
|----------|-------|--------|
| Medium | LCP / hero | Home hero is a client island with motion (`opacity: 0` until Framer runs) — can delay LCP |
| Medium | Streaming | Few `loading.tsx` / Suspense boundaries; pages await data then render |
| Medium | Cache coverage | Company, clients, statistics, team, milestones, service-by-slug less cached than projects list |
| Medium | Fonts | Inter + IBM Plex Arabic both loaded; Arabic-first still pays Inter cost |
| Medium | Slug static params | Project/service detail rely on on-demand ISR (no `generateStaticParams`) |
| Low | Remote images | `remotePatterns` limited to Unsplash + placehold.co |
| Low | Autoplay video | Hero video may ignore reduced-motion (also a11y) |

## Recommendations (no redesign required)

1. **Server-first hero text/image** — keep parallax in a small client child so LCP HTML/image is not gated on hydration.
2. **Add `loading.tsx`** under `app/[locale]` and heavy admin lists for perceived TTFB.
3. **Extend `unstable_cache`** to company profile and other public facades with tag invalidation on CMS writes.
4. **`generateStaticParams`** for published project/service slugs at build time.
5. **Measure CWV** on staging with Lighthouse / CrUX after deploy; tune LCP element specifically.

## Bundle notes

- Framer Motion is pulled into public chrome via Navbar/Hero/Reveal — acceptable for a premium marketing site; avoid adding it to admin tables.
- Admin is a separate tree; keep `"use client"` limited to forms and interactive widgets (current pattern is mostly sound).
