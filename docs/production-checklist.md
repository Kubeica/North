# Production checklist

Use this before the first production cutover and before each major release.

## Pre-deploy

- [ ] `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` are the public HTTPS origin (no localhost)
- [ ] `AUTH_SECRET` is a unique high-entropy value (`openssl rand -base64 32`)
- [ ] `DATABASE_URL` points at production Postgres (not the local Docker demo)
- [ ] Demo seed is **not** run against production (or passwords rotated immediately)
- [ ] Admin accounts use strong unique passwords; deactivate unused users
- [ ] `STORAGE_PROVIDER=local` has a persistent volume, **or** a remote provider is planned
- [ ] Rate-limit env knobs reviewed (`RATE_LIMIT_*`)
- [ ] Reverse proxy terminates TLS and sets/overwrites `X-Forwarded-For` / `X-Real-IP`
- [ ] Security headers confirmed in responses (see `next.config.ts`)
- [ ] CSP Report-Only reviewed; promote to enforcing CSP after tuning
- [ ] Backups scheduled (database + uploads volume)
- [ ] Restore drill completed at least once

## Quality gate

```bash
npx prisma validate
npm run typecheck
npm run lint
npm test
npm run build
```

CI mirrors this in `.github/workflows/ci.yml`.

## Database

- [ ] `npx prisma migrate deploy` succeeds
- [ ] Indexes present via migrations (no ad-hoc `db push` in prod)
- [ ] Connection pool / idle timeouts appropriate for the host

## Application

- [ ] Public pages return 200 for `/ar`, `/en`, about, services, projects, contact
- [ ] Project/service detail 404 for unknown slugs
- [ ] Admin login rate-limits after repeated failures
- [ ] EDITOR cannot open `/admin/users`, `/admin/settings`, `/admin/audit-logs`
- [ ] Quote + contact forms validate and rate-limit
- [ ] Sitemap / robots reference the production host
- [ ] Open Graph previews look correct for home + a project

## Post-deploy

- [ ] Smoke-test login / logout / create draft project
- [ ] Confirm audit log entries for admin mutations
- [ ] Monitor error logs and CSP report endpoint (when configured)
- [ ] Verify uploads persist across container restart (if local storage)

## Do not ship

- Seed credentials (`admin@northernmeteor.com` / demo passwords)
- `.env` files in git
- Unrestricted SVG uploads (disabled by design)
- Unauthenticated admin routes
