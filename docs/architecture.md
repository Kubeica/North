# Architecture

Northern Meteor is a Next.js App Router application with a bilingual public marketing site and a role-based CMS under `/admin`.

## High-level layout

```text
app/
  [locale]/          Public pages (ar | en) — home, about, services, projects, contact
  admin/             CMS (Auth.js protected; login at /admin/login)
  api/               Auth + media upload routes
  actions/           Server actions (contact + admin CRUD)
  sitemap.ts         Dynamic sitemap (NEXT_PUBLIC_SITE_URL)
  robots.ts          robots.txt (disallows /admin, /api)
components/
  public/            Marketing UI
  admin/             CMS shell + forms
  layout/            Navbar, footer, logo
  seo/               JSON-LD
lib/
  data/              Public read models (Prisma + safeQuery fallbacks)
  validation/        Zod schemas
  permissions/       ADMIN / EDITOR capability checks
  storage/           Upload provider abstraction (local)
  seo/               Metadata helpers
  security/          Rate limiting
  audit/             Audit log writer
  i18n/              Locale helpers + localized field picker
i18n/                next-intl routing + request config
messages/            UI chrome translations (ar.json / en.json)
prisma/              Schema + seed
```

## Public site

- Locale prefix is always present (`localePrefix: "always"`): `/ar/...`, `/en/...`.
- Default locale is Arabic (`ar`); Arabic pages use RTL via `dir` on the locale layout wrapper.
- UI chrome (nav, buttons, labels) comes from `next-intl` message files.
- CMS content (projects, services, company profile, etc.) is stored as `*Ar` / `*En` columns and selected with `localized()` from `lib/i18n/get-localized.ts`.
- Public data access goes through `lib/data/*`, which uses `safeQuery` so a missing DB degrades to empty/null rather than crashing the page shell in development.

## Admin CMS

- Routes under `/admin` (except `/admin/login`) require an authenticated session (`auth.config.ts` `authorized` callback, composed in `proxy.ts` with next-intl middleware).
- Roles: `ADMIN` and `EDITOR` (`lib/permissions`).
- Mutations live in `app/actions/*` and are guarded with session/permission helpers from `lib/auth/session.ts` and `lib/admin/action.ts`.
- Soft archive (`archivedAt`) / `published` flags are preferred over hard deletes for content entities; users are deactivated (`active: false`).

## Auth

- Auth.js v5 Credentials provider (`auth.ts`).
- Passwords hashed with bcrypt (`lib/auth/password.ts`).
- JWT session strategy; role is embedded in the token but privileged actions re-check permissions server-side.
- Login events write an `AuditLog` entry when possible.

## Media

- `getStorageProvider()` resolves `STORAGE_PROVIDER` (default `local`).
- `LocalStorageProvider` stores files under `public/uploads` and returns public `/uploads/...` URLs.
- Upload API: `app/api/media/upload/route.ts` plus admin media actions/UI.

## SEO

- Page metadata via `buildPageMetadata()` (`lib/seo/metadata.ts`) — used by locale pages.
- `app/sitemap.ts` / `app/robots.ts` use `NEXT_PUBLIC_SITE_URL`.
- `components/seo/JsonLd.tsx` emits Organization + WebSite structured data in the locale layout (no fabricated certifications).

## Cross-cutting

- Contact form and login flows can use DB-backed rate limiting (`lib/security/rate-limit.ts` + `RateLimitBucket`).
- Audit logging for admin mutations / login (`lib/audit/log.ts`).
- Design tokens: charcoal / navy / gold; fonts Inter + IBM Plex Sans Arabic (root layout).

## Related ADRs

See [architecture-decisions.md](./architecture-decisions.md) for locale routing, Auth.js, soft archive, storage abstraction, next-intl vs CMS columns, Docker Postgres, and Vitest choices.
