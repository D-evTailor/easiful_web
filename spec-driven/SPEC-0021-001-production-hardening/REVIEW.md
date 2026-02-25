# REVIEW: Production Hardening

**Spec:** SPEC-0021-001  
**Status:** Changes requested  
**Reviewer:** Codex (independent review)  
**Date:** 2026-02-22

---

## Findings (ordered by severity)

### 1) RF-05 not met: NextAuth redirects are not locale-aware

- **Evidence:** `lib/auth-config.ts:150` and `lib/auth-config.ts:151` hardcode `pages.signIn` and `pages.error` to `/login`.
- **Evidence:** `middleware.ts:4` and `middleware.ts:17` force non-localized paths to default locale `es`.
- **Impact:** Users on `/en/*` can be redirected to `/es/login` instead of staying on the active locale, violating RF-05 acceptance criterion 3.

### 2) RF-01 deviation: checkout route accepts client-controlled field beyond `planId`

- **Evidence:** `app/api/stripe/checkout/route.ts:37` destructures `{ planId, locale }` from request body.
- **Evidence:** `app/api/stripe/checkout/route.ts:46` and `app/api/stripe/checkout/route.ts:47` use client-provided `locale` (validated) to build redirect URLs.
- **Impact:** Spec requires the route to accept only `planId` (`monthly` or `annual`). Current implementation accepts additional client input, which is a strict spec deviation.

### 3) RF-03 not fully met: build has warnings indicating real issues

- **Evidence:** `pnpm build` succeeds but emits warnings about missing `metadataBase` (Open Graph/Twitter URL resolution defaults to `http://localhost:3000`).
- **Evidence:** Metadata objects are defined without `metadataBase` in `app/layout.tsx:12` and `app/[locale]/layout.tsx:9`.
- **Impact:** Violates RF-03 criterion requiring zero warnings that indicate real issues.

### 4) RF-05 partial: login download CTA has no visible fallback state when URL is missing

- **Evidence:** `app/[locale]/login/page.tsx:87` to `app/[locale]/login/page.tsx:92` silently no-ops when `NEXT_PUBLIC_GOOGLE_PLAY_URL` is unset.
- **Evidence:** CTA still renders unconditionally at `app/[locale]/login/page.tsx:167`.
- **Impact:** Behavior is not broken, but UX fallback is weaker than the spec intent ("sensible fallback") compared with `components/download-button.tsx`, which hides unavailable buttons.

---

## Requirement Verification Summary

| Requirement | Result | Notes |
|---|---|---|
| RF-01 Stripe checkout security | Partial | Plan allowlist exists; invalid plan handling is correct; route still accepts `locale` from client |
| RF-02 Log hygiene | Pass | No `console.log` found in checked client paths; logs in reviewed files are sanitized |
| RF-03 Build strictness | Partial | No ignore flags; `tsc`/`lint` pass; build warning remains (`metadataBase`) |
| RF-04 CI/CD hardening | Pass | Node 20 + pnpm 10 + correct step order + `FIREBASE_PRIVATE_KEY_ID` mapping verified |
| RF-05 Functional fixes | Partial | Download button component fixed; forgot-password link absent; locale-aware NextAuth page redirects still not compliant |
| RF-06 Code quality | Pass | No `: any`/`as any` in scoped auth/payments files; package name and gitignore entries correct |
| RF-07 Documentation | Pass | README conflict-free with Known State; checklist is Firebase-specific; archive path exists |

---

## Command Results

| Command | Result | Notes |
|---|---|---|
| `npx tsc --noEmit` | Pass | Exit 0 |
| `pnpm lint` | Pass | Exit 0, no warnings/errors |
| `pnpm test:unit` | Pass | 38 passed, 0 failed, 3 files |
| `pnpm build` | Pass with warnings | Build completed; emitted `metadataBase` warnings |

---

## Additional Checks Requested

- **Remaining `console.log` in client code:** none found via `rg -n "console\\.log" app components lib hooks`.
- **Remaining `: any` in auth/payments files:** none found via `rg -n "(:\\s*any\\b|\\bas\\s+any\\b)" app/api/auth app/api/stripe lib/auth-config.ts lib/stripe-config.ts`.
- **Error response internal leak:** reviewed checkout/auth token routes return generic client-facing errors only.
- **Hardcoded secrets/price IDs in runtime source:** none found in `app/`, `components/`, `lib/`, `hooks/`.
- **Download button behavior with missing env vars:** `components/download-button.tsx` correctly conditionally renders; login CTA behavior is the only fallback gap noted above.

---

## Deviations Not Justified in IMPLEMENTATION.md

1. NextAuth pages remain hardcoded to `/login` (`lib/auth-config.ts:150`), which does not satisfy locale-aware redirect acceptance criteria.
2. Checkout route accepts and uses client `locale` (`app/api/stripe/checkout/route.ts:37`), while RF-01 specifies only `planId` input.
3. Build still emits actionable warnings (`metadataBase`) despite RF-03 requirement for zero real-issue warnings.

---

## Decision

Do not approve yet. Address the findings above and re-run the same verification commands before final approval.