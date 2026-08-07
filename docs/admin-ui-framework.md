# Admin UI Framework

Reusable internal component system for the Northern Meteor CMS. All entity screens should compose these primitives instead of inventing one-off layouts.

## Import

```ts
import {
  PageHeader,
  TableToolbar,
  DataTable,
  ActionMenu,
  LanguageTabs,
  SeoPanel,
  SaveBar,
  // …
} from "@/components/admin";
```

## List page pattern

1. `requirePermission("<entity>:read")` at the top of the page (and nested layout for ADMIN-only areas).
2. `parseListParams(searchParams, { pageSize, filterKeys })` from `@/lib/admin/list-params`.
3. `PageHeader` + primary Create action.
4. `TableToolbar` (search + filters).
5. `DataTable` + `ActionMenu` (View / Edit / Duplicate / Archive).
6. `Pagination` + `EmptyState` via `DataTable.empty`.

Reference implementation: `app/admin/projects/page.tsx`.

## Editor page pattern

1. `requirePermission("<entity>:write")` on the page / server action.
2. `EntityHeader` or `PageHeader`.
3. Sections via `FormSection` / `FormCard`:
   - Basic information
   - Localized content → `LanguageTabs` (EN / AR)
   - Images → `ImageUploader` + `GalleryUploader`
   - SEO → `SeoPanel`
   - Publishing flags
4. Sticky `SaveBar` (explicit Save; no autosave).

Reference implementation: `components/admin/forms/ProjectForm.tsx`.

## RBAC

| Area | ADMIN | EDITOR |
|------|-------|--------|
| Dashboard, Projects, Services, Clients, Messages, Media, Team | ✓ | ✓ |
| Users, Settings, Audit Logs | ✓ | ✗ |

Enforcement layers:

1. **Middleware** (`auth.config.ts` `authorized`) — session required for `/admin/*`; ADMIN-only prefixes redirected to `/admin/unauthorized`.
2. **Nested layouts** — `users/`, `settings/`, `audit-logs/` call `requirePermission`.
3. **Pages & server actions** — `requirePermission` / write checks; UI nav hiding is cosmetic only.

## Audit logging

Mutations and auth events use `AuditAction` from `@/lib/audit/actions` via `createAuditLog` in server-side business logic (never in the client).

## Dashboard

`app/admin/dashboard/page.tsx` uses `StatCard`, `DashboardCard`, `AuditPanel` with live Prisma counts.
