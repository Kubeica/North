# Database

PostgreSQL via Prisma. Schema: `prisma/schema.prisma`. Seed: `prisma/seed.ts`.

## Local database

```bash
docker compose up -d
```

Compose service `db` runs `postgres:16-alpine` with:

- User / password: `postgres` / `postgres`
- Database: `northern_meteor`
- Port: `5432`
- Volume: `nm_pg_data`

Connection string (`.env.example`):

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/northern_meteor?schema=public"
```

## Commands

```bash
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate dev
npm run db:push       # prisma db push (no migration history)
npm run db:seed       # tsx prisma/seed.ts
npm run db:validate   # prisma validate
npm run db:studio     # Prisma Studio
```

If the repo has no migration history yet, `db:migrate` creates the initial migration from the schema, or use `db:push` for a quick local sync.

## Models (overview)

| Model | Role |
| --- | --- |
| `User` | Admin users (`ADMIN` / `EDITOR`), bcrypt `passwordHash`, `active` |
| `CompanyProfile` | Singleton-style company content (bilingual fields + contact/social) |
| `SiteSetting` | Key/value settings (SEO defaults, locale, maintenance flag in seed) |
| `Project` / `ProjectCategory` / `ProjectImage` | Portfolio with status, featured, SEO fields, `isDemo` |
| `Service` | Service catalog (`slug`, bilingual copy, `isDemo`) |
| `Client` | Client logos / partners |
| `Statistic` | Home stats strip |
| `TeamMember` | Team page |
| `ContactMessage` | Contact form inbox (`UNREAD` / `READ` / `ARCHIVED`) |
| `Media` | Media library metadata |
| `AuditLog` | Admin/login audit trail |
| `RateLimitBucket` | Fixed-window rate limit counters |

## Enums

- `Role`: `ADMIN`, `EDITOR`
- `ProjectStatus`: `PLANNED`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`
- `MessageStatus`: `UNREAD`, `READ`, `ARCHIVED`

## Soft delete / publish

Content models commonly use:

- `published` — visible on the public site when true (and not archived)
- `archivedAt` — soft archive; public queries filter `archivedAt: null`
- `isDemo` — marks seed/demo content on projects, services, team

Users are not hard-deleted; set `active: false`.

## Seed data

`npm run db:seed` upserts:

- 2 users (admin + editor)
- Company profile, site settings, 6 statistics
- 5 project categories, 8 clients, 9 services, 8 projects (with images)
- 4 team members, 2 contact messages, 1 media row, 1 sample LOGIN audit log

All marketing copy is labeled demo/sample. Seed passwords are documented in the README — change them outside local demo use.
