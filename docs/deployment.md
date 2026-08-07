# Deployment

Checklist for running Northern Meteor in a production-like environment.

Full Docker / backup / restore / CI instructions: [deployment-guide.md](./deployment-guide.md) and [production-checklist.md](./production-checklist.md).

## 1. Runtime

- Node.js 20+ recommended
- Managed PostgreSQL (or self-hosted Postgres 16+)
- Persistent disk **or** object storage for uploads if you keep `STORAGE_PROVIDER=local`

## 2. Environment variables

Set at least:

```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=<strong random secret>
AUTH_URL=https://your-domain.example
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_DEFAULT_LOCALE=ar
STORAGE_PROVIDER=local
STORAGE_LOCAL_DIR=public/uploads
STORAGE_MAX_FILE_SIZE_MB=5
```

Optional: tune `RATE_LIMIT_*` for contact and login.

Notes:

- `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` must match the public HTTPS origin.
- `NEXT_PUBLIC_SITE_URL` drives sitemap, robots, canonical URLs, Open Graph, and JSON-LD.
- Do not commit `.env` files.

## 3. Database

```bash
npx prisma generate
npx prisma migrate deploy   # preferred when migrations exist
# or: npx prisma db push    # only if you intentionally skip migrations
npx prisma db seed          # optional; avoid demo seed in real production
```

For a real company launch: seed only what you need, or enter content via admin — do not ship demo passwords/projects to production.

## 4. Build & start

```bash
npm ci
npm run build
npm start
```

Quality gate before release:

```bash
npm run typecheck
npm run lint
npm test
npm run db:validate
npm run build
```

## 5. Storage

Current implementation: **local filesystem** under `public/uploads`.

Implications:

- The process user must be able to write that directory.
- On ephemeral hosts (many serverless/container platforms), local files are lost on redeploy unless you mount a volume.
- `STORAGE_PROVIDER` values other than `local` are not implemented and will throw at runtime.

Plan a volume mount or implement a remote provider before scaling beyond a single persistent instance.

## 6. Reverse proxy / platform

- Terminate TLS at the proxy or platform.
- Forward the correct host so Auth.js cookies and redirects work with `AUTH_URL`.
- Ensure `/uploads/*` is served if using local storage (Next.js serves `public/` statically).

## 7. Post-deploy hardening

1. Change or delete seed users; create real admin accounts.
2. Confirm `/admin` redirects unauthenticated users to login.
3. Confirm EDITOR cannot open users/settings/audit.
4. Submit a test contact message and verify rate limiting behaves as configured.
5. Check `/sitemap.xml` and `/robots.txt` use the production site URL.
6. Verify Organization/WebSite JSON-LD on a public page (view source) — only real company fields, no invented certifications.

## 8. What is not covered here

- CI/CD provider choice (GitHub Actions, etc.) is not prescribed by the repo.
- Email delivery for contact messages is not implemented — messages are stored in PostgreSQL for the admin inbox.
- CDN / image optimization beyond Next.js defaults depends on your host.
