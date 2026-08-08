# Deployment guide

Production deployment for Northern Meteor Construction (Next.js App Router + PostgreSQL + Auth.js).

Related: [production-checklist.md](./production-checklist.md), [security-review.md](./security-review.md).

## Architecture (runtime)

```
Internet → TLS reverse proxy → Next.js app (Node 20) → PostgreSQL 16
                              ↓
                         uploads volume (if STORAGE_PROVIDER=local)
```

## Environment variables

Copy `.env.example` and set **at least**:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Auth.js signing secret |
| `AUTH_URL` | Public origin used by Auth.js |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap / OG / JSON-LD base |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Usually `ar` |
| `STORAGE_PROVIDER` | `local` (only implemented provider today) |
| `STORAGE_MAX_FILE_SIZE_MB` | Upload size cap (default 5) |
| `RATE_LIMIT_*` | Contact, quote, login windows |
| `NOTIFICATION_PROVIDER` | `noop` until email is wired |
| `QUOTE_ATTACHMENT_PROVIDER` | `stub` until object storage is wired |

Never commit real `.env` / `.env.production` files.

## Option A — Docker Compose (recommended baseline)

```bash
# 1. Create production env file
cp .env.example .env.production
# Edit: AUTH_SECRET, AUTH_URL, NEXT_PUBLIC_SITE_URL, POSTGRES_PASSWORD

# 2. Build and start
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build

# 3. Logs
docker compose -f docker-compose.production.yml logs -f app
```

The app container runs `prisma migrate deploy` then `npm start`.

Compose services:

- `db` — Postgres 16 with named volumes for data + backups mount point
- `app` — multi-stage `Dockerfile` build; uploads on `nm_uploads_prod`

Expose only the app port (or put a reverse proxy in front and do not publish Postgres).

## Option B — Platform (Vercel / VM) + managed DB

1. Provision managed Postgres.
2. Set env vars in the platform.
3. Build: `npm ci && npx prisma generate && npm run build`
4. Release migrate: `npx prisma migrate deploy`
5. Start: `npm start`
6. Attach persistent storage for `public/uploads` **or** implement remote storage before scaling.

Avoid `prisma db seed` on production.

## First production ADMIN (required)

Do **not** use `npm run db:seed` or any demo credentials. Provision the first ADMIN with the idempotent CLI (uses `hashPassword` + `userRepository`, role `ADMIN`, active):

```bash
# After the app image is rebuilt/redeployed with this script:
docker compose -f docker-compose.production.yml --env-file .env.production exec \
  -e ADMIN_EMAIL='your-admin@example.com' \
  -e ADMIN_PASSWORD='use-a-long-unique-password' \
  -e ADMIN_NAME='Site Admin' \
  app npm run admin:provision
```

- Pass credentials only via `-e` (or a one-shot env file you delete afterward). Do not bake them into `docker-compose.production.yml`.
- Exit `0` + `status=created` on first run; `status=exists` if that email is already an active ADMIN (no duplicate, password unchanged).
- Exit `2` + `status=exists_conflict` if the email exists but is not an active ADMIN.
- The password is never printed. Sign in at `/admin/login` — ADMIN has full `can()` permissions including `/admin`.

Rebuild the app image once so `scripts/`, `lib/`, `src/`, and `tsconfig.json` are present in the runner stage.

## Database migrations

```bash
npx prisma migrate deploy
```

Development-only:

```bash
npx prisma migrate dev
```

## Backup strategy

### PostgreSQL

Daily logical backup (example):

```bash
docker compose -f docker-compose.production.yml exec -T db \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
  > "backup-$(date +%Y%m%d-%H%M%S).dump"
```

Store dumps off-box (S3 / encrypted disk). Retain per policy (e.g. 7 daily + 4 weekly).

Optional in-compose volume `nm_pg_backups` can hold on-host copies — still copy off the machine.

### Uploads

If `STORAGE_PROVIDER=local`, back up the `nm_uploads_prod` volume (or host bind mount) on the same cadence as the DB. Media rows in Postgres without files are broken; files without rows are orphans.

## Restore procedure

1. Stop the app (keep DB if restoring DB only).
2. Restore dump:

```bash
docker compose -f docker-compose.production.yml exec -T db \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  < backup-YYYYMMDD-HHMMSS.dump
```

3. Restore uploads volume from the matching backup timestamp.
4. Start app; run smoke checks from the production checklist.
5. Rotate `AUTH_SECRET` only if it may have been compromised (forces re-login).

## Reverse proxy notes

- Terminate TLS (HTTPS).
- Forward `Host`, and set trusted client IP headers.
- Do not allow clients to spoof `X-Forwarded-For` without proxy overwrite.
- HSTS is emitted by Next in production (`next.config.ts`).

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:

1. Prisma validate + migrate (ephemeral Postgres)
2. Typecheck
3. ESLint
4. Vitest
5. `next build`

Deploy jobs are intentionally not included — wire your host after CI is green.

## Rollback

1. Redeploy previous image / git SHA.
2. Database: only roll forward with new migrations when possible; if a bad migration shipped, restore from backup taken before deploy.
3. Clear CDN caches if any sit in front of HTML.

## Health signals

- App responds on `/ar` and `/en`
- `/admin/login` loads
- Postgres `pg_isready`
- Disk free space on DB + uploads volumes
