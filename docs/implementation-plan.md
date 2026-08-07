# Northern Meteor Construction — Implementation Plan

Production-ready corporate website + CMS/Admin for **Northern Meteor Construction** (شركة النيزك الشمالي للمقاولات العامة).

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma ORM
- Auth.js (Credentials + JWT/session)
- Tailwind CSS + shadcn/ui
- Lucide React, Framer Motion, Zod, React Hook Form, date-fns
- next-intl (or custom locale routing) for AR/EN + RTL/LTR

## Phases

### PHASE 1 — Project initialization
- Next.js + TypeScript + Tailwind + ESLint
- shadcn/ui base
- Design tokens (charcoal / navy / gold)
- Folder architecture
- `.env.example`
- Typography (Inter + IBM Plex Sans Arabic)

### PHASE 2 — Database
- Prisma schema (all models)
- Migrations
- Seed data (demo/sample clearly marked)
- Indexes + soft-delete/archive where appropriate

### PHASE 3 — Authentication
- Auth.js credentials provider
- Password hashing (bcrypt)
- Roles: ADMIN / EDITOR
- Server-side authorization helpers
- Admin login page

### PHASE 4 — Public website foundation
- Locale-aware layout (ar RTL / en LTR)
- Navbar, footer, home, about, services, projects, project detail, contact
- CMS-driven content from DB
- Contact form → PostgreSQL

### PHASE 5 — CMS / Admin
- Admin shell (sidebar + mobile drawer)
- Dashboard metrics
- Projects, Services, Clients, Messages, Team, Users, Settings CRUD
- Empty / loading / error states
- Confirmation dialogs + toasts

### PHASE 6 — Media
- Storage abstraction (`local` first; S3/Cloudinary-ready)
- Media library UI
- Upload validation (MIME, size)

### PHASE 7 — SEO + a11y + performance
- Metadata, OG, Twitter, canonical
- sitemap.xml, robots.txt
- JSON-LD structured data
- next/image, reduced motion, focus states

### PHASE 8 — Audit logs + security hardening
- AuditLog on admin mutations + login
- Rate limiting architecture (contact/login)
- Permission enforcement review

### PHASE 9 — Testing
- Auth, RBAC, CRUD, contact validation, public pages, locale
- Vitest / Playwright as appropriate

### PHASE 10 — Production QA
- `lint` / `typecheck` / `test` / `build` / `prisma validate`
- Documentation: README + docs/*

## Quality gate (every phase)

1. Typecheck
2. Lint
3. Tests (when present)
4. Prisma validate (from Phase 2)
5. Fix errors
6. Ensure app remains runnable

## Non-negotiables

- No fake CMS state
- No plaintext passwords
- No secrets in repo
- No hard-coded projects/services/stats in pages
- Server-side authorization
- Seed content marked as demo/sample
