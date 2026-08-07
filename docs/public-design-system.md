# Public Design System

Premium corporate components for the Northern Meteor Construction marketing site.

Import from the barrel:

```tsx
import {
  Container,
  Section,
  SectionTitle,
  PublicButton,
  Hero,
  PageHero,
  CTASection,
  Reveal,
} from "@/components/public";
```

## Brand tokens

| Token | Value |
| --- | --- |
| Background | `#0B0D0F` |
| Surface | `#12161A` |
| Gold | `#C9A227` |
| Muted | `#A7ADB4` |
| Navy | `#0F1A2B` |

TypeScript constants live in `components/public/theme/tokens.ts`. CSS variables (`--nm-*`) and utilities (`.nm-container`, `.nm-section`, `.nm-grid-features`, `.nm-grid-projects`) are in `app/globals.css`.

## Layout

```tsx
<Section tone="surface" padded>
  <Container>
    <SectionTitle
      eyebrow="Capabilities"
      title="Built for complex delivery"
      description="One short supporting line."
    />
  </Container>
</Section>
```

Section tones: `dark` | `surface` | `navy` | `transparent`. Use `alternate` + `alternateIndex` for stacked banding.

## Buttons

Prefer `PublicButton` (avoids clashing with shadcn `Button`):

```tsx
<PublicButton href="/contact">Contact</PublicButton>
<PublicButton variant="outline" size="lg">Secondary</PublicButton>
```

Variants: `primary` | `secondary` | `ghost` | `outline` | `link` | `icon`.  
Sizes: `sm` | `md` | `lg`. Supports `href` (next-intl `Link`) or `asChild`.

## Motion

All motion wrappers respect `useReducedMotion` / `prefers-reduced-motion`.

```tsx
<Reveal>
  <Heading as="h2">Title</Heading>
</Reveal>
```

Also available: `FadeUp`, `FadeIn`, `ScaleIn`, `Stagger` / `StaggerItem`.

Existing imports of `@/components/motion/Reveal` continue to work via re-export.

## Hero

- `Hero` — full-viewport home hero (`brandName`, `title`, `subtitle`, `imageUrl`)
- `PageHero` — shorter inner-page hero with optional breadcrumb
- `HeroBackground` — image/video + overlay layers

## Content cards

Presentational: `FeatureCard`, `StatisticCard`, `ClientLogo`, `Timeline`, `Gallery`, `CTASection` (`sections/CTASection.tsx`), `ProjectGrid`.

Data-aware wrappers keep prior APIs:

- `ServiceCard` / `ProjectCard` (locale + Prisma models)
- `CtaSection` (locale) → composes `CTASection` (separate path to avoid Windows filename casing clashes)

## Chrome

`Navbar`, `Footer`, `LanguageSwitcher`, `Breadcrumb`, `SocialLinks`, `ContactCard` live under `components/public/`.  
`components/layout/Navbar` and `Footer` re-export them for `app/[locale]/layout.tsx`.

## Icons

Lucide React only. No emoji.
