# Security review (production polish)

**Date:** 2026-08-08  
**Scope:** Existing application only (auth, admin, public forms, uploads, headers).  
**Score after polish:** **7.5 / 10** (was ~6.5 before hardening in this phase)

This is an engineering review, not a penetration test or certification.

## Summary

The app has solid application-layer controls: RBAC on mutations, Zod validation, bcrypt passwords, audit logging with secret redaction, and public form rate limits. Production polish added security headers (CSP Report-Only), login rate limiting, session revalidation for inactive/role changes, admin route-guard enforcement, SVG upload removal, and MIME-derived upload extensions.

## Controls reviewed

| Area | Status | Notes |
|------|--------|-------|
| Authentication | Good | Auth.js credentials + bcrypt; login rate-limited |
| Authorization | Good | `can` / `requirePermission`; layout + page + edge ADMIN prefixes |
| Cookies | Good | Auth.js defaults (`httpOnly`, `sameSite=lax`); HTTPS + HSTS in prod |
| Headers | Good | nosniff, frame deny, referrer, permissions-policy, HSTS (prod), CSP Report-Only |
| CSP | Partial | Report-Only starter; tighten `script-src` then enforce |
| Rate limiting | Good | Contact, quote, login (env-driven); fixed-window DB buckets |
| Input validation | Good | Zod on actions/forms |
| Output escaping | Good | React text nodes; JSON-LD escapes `<` |
| SQL safety | Good | Prisma only in repositories; no raw SQL found |
| File uploads | Improved | SVG blocked; extension from MIME; size from env |
| Secrets | Good | `.env` gitignored; example placeholders only |
| Audit logging | Good | Broad CMS coverage; login/logout; quote export |

## Findings remaining

### High → addressed this phase

- Login rate limit (wired via `assertLoginAllowed` + `RATE_LIMIT_LOGIN_*`)
- Security headers + CSP Report-Only
- JWT role/active recheck every 5 minutes
- Admin `route-guards` enforced from layout via `x-pathname`
- Dashboard audit hidden without `audit:read`
- SVG uploads removed; safe extension mapping

### Medium (still open)

1. **Trusted proxy IP** — rate limits trust `X-Forwarded-For`; configure the reverse proxy to overwrite client-supplied values.
2. **Non-atomic rate limiter** — concurrent bursts can slightly exceed max; acceptable for CMS traffic; Redis/atomic upsert later if needed.
3. **Contact form** — weaker than quote (no honeypot / sanitize / audit). Align when spam appears.
4. **Failed-login audit** — not recorded (successful LOGIN is).
5. **Magic-byte sniffing** — MIME still partly client-declared; extension is now MIME-mapped, but deep content sniffing is not implemented.

### Low / info

- Password policy is length-based (min 8).
- Quote attachments remain stubbed (no storage yet) — intentional.
- Seed demo passwords must never hit production DB.

## CSP recommendations (next steps)

1. Keep `Content-Security-Policy-Report-Only` for 1–2 weeks; collect violations.
2. Move Auth.js / Next inline needs to nonces or hashes; drop `'unsafe-eval'` if unused.
3. Promote header name to `Content-Security-Policy`.
4. Keep `frame-src` limited to OpenStreetMap (or your map provider).
5. Serve uploads with restrictive `Content-Type` and consider a separate cookie-less media host later.

## Upload hardening recommendations

1. Prefer object storage (S3 / Cloudinary / Azure) outside the app origin.
2. Virus scanning for PDFs if untrusted clients upload.
3. When quote attachments go live, reuse MIME allow-list + size env + virus scan.

## Authorization model (reminder)

- **ADMIN** — full access including users, settings, audit.
- **EDITOR** — content + messages + quotes; no users/settings/audit.
- Edge middleware blocks ADMIN-only prefixes; layout enforces `ADMIN_ROUTE_PERMISSIONS`; pages still call `requirePermission` for defense in depth.
