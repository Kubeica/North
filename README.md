# Northern Meteor Construction

Corporate website and CMS for **Northern Meteor Construction** (شركة النيزك الشمالي للمقاولات العامة): bilingual public site (Arabic RTL / English LTR) plus an Auth.js-protected admin panel.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Auth.js (Credentials, JWT sessions)
- next-intl (AR/EN)
- Zod, React Hook Form, Framer Motion, Vitest

## Requirements

- Node.js 20+ (recommended)
- npm
- Docker (for local PostgreSQL via `docker-compose.yml`)

## Install

```bash
npm install
cp .env.example .env
```

Generate an Auth secret and put it in `.env`:

```bash
openssl rand -base64 32
```

## Environment

Copy `.env.example` to `.env`. Important variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auth.js signing secret |
| `AUTH_URL` | App URL used by Auth.js (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL (sitemap, robots, metadata, JSON-LD) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale (`ar`) |
| `STORAGE_PROVIDER` | `local` (only implemented provider) |
| `STORAGE_LOCAL_DIR` | Local upload directory (default `public/uploads`) |
| `STORAGE_MAX_FILE_SIZE_MB` | Upload size limit |
| `RATE_LIMIT_*` | Contact / login rate-limit windows |

See `.env.example` for the full list.

## Docker PostgreSQL

```bash
docker compose up -d
```

Default connection (matches `.env.example`):

```text
postgresql://postgres:postgres@localhost:5432/northern_meteor?schema=public
```

## Database: migrate & seed

Generate the Prisma client, apply the schema, then seed demo data:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

If you prefer pushing the schema without creating a migration history locally:

```bash
npm run db:push
npm run db:seed
```

> Seed content is explicitly marked as demo/sample. It is for development and UI exercise only — not real project claims.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest (unit tests) |
| `npm run test:watch` | Vitest watch mode |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` |
| `npm run db:seed` | Run `prisma/seed.ts` |
| `npm run db:validate` | `prisma validate` |
| `npm run db:studio` | Prisma Studio |

## Development

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

- Public site: [http://localhost:3000/ar](http://localhost:3000/ar) (default locale) or `/en`
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Admin logins (from seed)

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@northernmeteor.com` | `Admin@12345!` |
| EDITOR | `editor@northernmeteor.com` | `Editor@12345!` |

Change these immediately in any shared or production environment.

## Build

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Storage

Uploads use `lib/storage` with a `LocalStorageProvider` that writes under `public/uploads` (configurable via `STORAGE_LOCAL_DIR` / env). Remote providers (`s3`, `cloudinary`) are reserved in env docs but **not implemented** — setting `STORAGE_PROVIDER` to anything other than `local` throws.

Uploaded files under `public/uploads/` are gitignored except `.gitkeep`.

## Deployment

See [docs/deployment.md](docs/deployment.md) for production checklist (env, Postgres, migrations, build, storage, Auth URL).

Additional docs:

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
- [Admin guide](docs/admin-guide.md)
