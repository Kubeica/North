# Domain layer

Northern Meteor keeps CMS write paths and data access in a small domain layer under `src/domain/`.

## Layers

```
Action / API route / page
       ↓
   Domain service   (rules, transactions, audit, public reads)
       ↓
   Repository       (Prisma only)
       ↓
   Database
```

1. **Action / API / page** — Authenticate and authorize, parse input (FormData → object), validate with Zod schemas from `src/domain/*/validation`, call a service, map errors with `mapDomainError`, revalidate caches. No Prisma. No `createAuditLog` for CMS mutations (services record audit).
2. **Service** — Accept `DomainActor` + validated input for writes. Enforce business rules, run multi-step writes inside `runTransaction`, call `auditService.record` for every mutation. Public read methods omit actor.
3. **Repository** — Own all Prisma access for that entity. Methods may accept an optional transaction client. Unique conflicts are mapped to `ConflictError` in repositories where relevant.
4. **Prisma** — Re-exported from `src/domain/shared/prisma` for repositories (and `$transaction` via `shared/transaction`).

## Prisma import rules

**Allowed** to import/use the Prisma client:

| Location | Role |
| --- | --- |
| `lib/db/prisma.ts` | Client singleton |
| `src/domain/shared/prisma.ts` | Domain re-export |
| `src/domain/shared/transaction.ts` | `$transaction` helper |
| `src/domain/**/repository.ts` | Entity queries only |
| `prisma/seed.ts` | CLI seed script (**exception**) |

**Not allowed:** `app/**` pages/layouts/actions/API routes, `lib/data/**`, `lib/security/**`, `auth.ts`, `scripts/**`, and other application code. Those call **domain services only** (never repositories or Prisma).

Type-only imports from `@prisma/client` in UI (e.g. `import type { Service }`) are fine.

## Seed exception

`prisma/seed.ts` may construct its own `PrismaClient` and run direct queries. It is a one-off CLI tool, not application runtime. Do not copy that pattern into app or lib code.

## Audit

Domain services must record audit events through `auditService.record`. Sensitive metadata keys are sanitized in the audit service. Auth LOGIN/LOGOUT also call `auditService.record`. `lib/audit/log.createAuditLog` remains a thin wrapper for legacy callers.

## Validation

Canonical Zod schemas live in `src/domain/<entity>/validation.ts`. `lib/validation/*` re-exports them so existing imports and tests keep working.

## Shared query types

`src/domain/shared/query.ts` defines `ListParams`, `PaginatedResult`, and pagination helpers used by list methods across repositories.

## Public API

Import services from `@/src/domain` (barrel) or a specific module, e.g. `@/src/domain/project/service`.
