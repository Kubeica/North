# Architecture Decisions

## ADR-001: Locale routing with `[locale]` segment

**Decision:** Use App Router path prefix `/[locale]/...` for public pages (`ar`, `en`).

**Rationale:** Clear URLs, SEO-friendly, native RTL via `dir` on `<html>`, cookie persistence for preferred language.

**Default language:** Arabic (`ar`) as company primary market; English available via switcher.

## ADR-002: Auth.js credentials + database sessions

**Decision:** Auth.js (NextAuth v5) with Credentials provider; passwords hashed with bcrypt; JWT session strategy for admin (simpler deploy) with role embedded in token but **always re-checked server-side** against DB for privileged actions.

**Rationale:** No OAuth provider required for internal CMS; roles must never be trusted from the client alone.

## ADR-003: Soft archive over hard delete

**Decision:** Projects, Services, Clients, Team, Media use `archivedAt` / `published` flags. Hard delete reserved for contact messages (optional) and media with confirmation. Users are deactivated (`active: false`) instead of deleted.

## ADR-004: Storage abstraction

**Decision:** `lib/storage` interface with `LocalStorageProvider` for MVP. S3/Cloudinary providers stubbed behind the same interface.

## ADR-005: next-intl vs custom messages

**Decision:** Use `next-intl` for UI chrome (nav, buttons, labels). CMS content (projects, services, etc.) stored as `*Ar` / `*En` columns and selected by locale helper — not duplicated into message JSON files.

## ADR-006: PostgreSQL via Docker for local dev

**Decision:** Provide `docker-compose.yml` for local PostgreSQL so the project runs without a system-wide Postgres install.

## ADR-007: Testing with Vitest + Playwright

**Decision:** Vitest for unit/integration of validation, permissions, and server actions. Playwright for critical public/admin smoke paths when time allows; minimum unit/integration suite required for Phase 9.

## ADR-008: Domain service layer

**Decision:** Introduce `src/domain/` with a clear separation of concerns:

- **Server Actions / API routes** — auth (`requirePermission`), FormData → plain object parsing, Zod `safeParse` via domain validation, call a domain service, map `DomainError` → `ActionResult`, `revalidatePath`.
- **Domain services** — business rules, multi-step orchestration (`prisma.$transaction`), and audit logging via `auditService.record`.
- **Repositories** — all Prisma queries/mutations. Only repositories (and services solely for `$transaction`) import `src/domain/shared/prisma`.
- **Shared** — `DomainActor`, `DomainError` hierarchy, optional `Result` helpers.

**Rationale:** Keep Server Actions thin and free of Prisma/audit details; centralize mutations and audit so every write path is consistent; allow gradual migration (`lib/validation/*` and `createAuditLog` re-export/delegate to domain).

**Out of scope for this ADR:** Public `lib/data/*` read paths and remaining actions (users, messages) may adopt the same pattern later.
