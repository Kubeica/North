# Admin guide

CMS for Northern Meteor Construction at `/admin`.

## Sign in

1. Open `/admin/login`.
2. Use an active user account (seed accounts are listed in the README for local demo).
3. Successful login redirects to `/admin/dashboard` and records a `LOGIN` audit entry when auditing succeeds.

Sign out from the admin shell (top bar).

## Roles

| Capability | ADMIN | EDITOR |
| --- | --- | --- |
| Projects, services, clients, team, stats, media, messages, company content | Yes | Yes |
| Users | Yes | No |
| Site settings | Yes | No |
| Audit logs | Yes | No |

Denied sections redirect editors away (typically to the dashboard) via `requirePermission`.

## Sections

### Dashboard

High-level counts / overview of CMS activity (projects, messages, etc.).

### Projects

Create and edit portfolio items: bilingual titles/descriptions, slug, category, client, status (`PLANNED`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`), featured flag, cover image, gallery images, SEO fields. Soft-archive instead of hard delete where the UI offers archive.

### Services

Manage service catalog entries (slug, bilingual copy, icon/image, sort order, publish/archive).

### Clients

Partner/client logos and optional links shown on the public site.

### Team

Team member profiles (bilingual name/position/bio, image, sort order).

### Messages

Inbox for contact form submissions. Statuses: `UNREAD`, `READ`, `ARCHIVED`. Mark read / manage from the messages UI.

### Media

Upload and browse media. Files go through the storage provider (local `public/uploads` in the current app). Respect the configured max file size.

### Users (ADMIN)

Create/edit CMS users, set `ADMIN` / `EDITOR`, activate/deactivate. Passwords are hashed; never stored in plaintext.

### Settings (ADMIN)

Key/value site settings (seed includes default locale, maintenance flag, default SEO titles/descriptions, OG image URL). Edit via the settings form.

### Audit logs (ADMIN)

Read-only trail of admin/login actions for accountability.

## Content & locales

- Public UI language is chosen by URL (`/ar`, `/en`).
- Most content fields have Arabic and English columns — fill both for a complete bilingual site.
- Leave `isDemo` / demo-labeled seed content out of production marketing claims; replace with real copy and assets.

## Publishing checklist

1. Set company profile (about, contact, hero image, social links).
2. Publish services and featured projects.
3. Confirm stats, clients, and team as needed.
4. Review SEO titles/descriptions on key pages.
5. Test contact form → message appears in Messages.
6. Switch locale on the public site and verify Arabic/English content and RTL/LTR layout.

## Troubleshooting

- **Cannot access /admin** — session missing; sign in again. Ensure `AUTH_SECRET` and `AUTH_URL` are set.
- **Upload fails** — check `STORAGE_PROVIDER=local`, directory permissions on `public/uploads`, and file size/MIME limits.
- **Empty public pages** — database down or unpublished/archived content; public reads use published + non-archived filters.
- **Permission errors** — EDITOR accounts cannot manage users, settings, or audit logs.
