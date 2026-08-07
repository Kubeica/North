# Security

Practices implemented in this codebase (not a certification claim).

For the production polish audit (findings, scores, CSP plan), see [security-review.md](./security-review.md).

## Authentication

- Auth.js Credentials provider; no OAuth required for the CMS.
- Passwords hashed with bcrypt (`lib/auth/password.ts`); plaintext passwords are never stored.
- Login input validated with Zod (`lib/validation/auth.ts`).
- JWT sessions; role is available on the session but mutations must still pass server-side permission checks.
- Unauthenticated access to `/admin/*` (except login) is blocked in `auth.config.ts` via the `authorized` callback (wired through `proxy.ts`).

## Authorization (RBAC)

`lib/permissions`:

- **ADMIN** — all permissions, including users, settings, and audit logs.
- **EDITOR** — content CRUD (projects, services, clients, team, statistics, media, messages, company) but **not** `users:*`, `settings:*`, or `audit:read`.

Helpers: `can()`, `requirePermission()`, `requireRole()`, `requireSession()` in `lib/auth/session.ts`.

## Audit logging

`lib/audit/log.ts` records actions such as login and admin mutations (entity, entityId, optional metadata). Credentials are not stored in audit metadata.

## Rate limiting

`lib/security/rate-limit.ts` uses a PostgreSQL `RateLimitBucket` table (fixed window). Env knobs from `.env.example`:

- Contact: `RATE_LIMIT_CONTACT_MAX` / `RATE_LIMIT_CONTACT_WINDOW_MS`
- Login: `RATE_LIMIT_LOGIN_MAX` / `RATE_LIMIT_LOGIN_WINDOW_MS`

## Input validation

Zod schemas under `lib/validation/` for contact, auth, and CMS entities. Server actions should parse with these schemas before writing to the database.

## Uploads

- Local storage only in MVP (`STORAGE_PROVIDER=local`).
- Size limit via `STORAGE_MAX_FILE_SIZE_MB`.
- Storage keys are sanitized; path traversal (`..`) is rejected in `LocalStorageProvider`.
- Media MIME/size validation is enforced on the upload path (API / actions).

## Secrets & config

- `.env*` is gitignored. Use `.env.example` as the template (no real secrets).
- Required production secrets: `DATABASE_URL`, `AUTH_SECRET`, correct `AUTH_URL` / `NEXT_PUBLIC_SITE_URL`.
- Seed admin passwords are for local demo only — rotate before any shared environment.

## Public surface

- `robots.ts` disallows crawling `/admin/` and `/api/`.
- Admin layout metadata sets `robots: { index: false, follow: false }`.
- Contact form writes to PostgreSQL; do not expose admin APIs without auth.

## What this does not claim

- No WAF, CAPTCHA, or email verification is implemented by default.
- No S3/Cloudinary security model until those providers are added.
- No fabricated compliance certifications in SEO/JSON-LD.
