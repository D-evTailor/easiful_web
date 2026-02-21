# SPEC-0021-001: Production Hardening

**Status:** ⬜ Pending  
**Branch:** `21-production-hardening`  
**Date:** 2026-02-21  
**Author:** Fernando  
**Base analysis:** [SPEC_ANALISIS_2026-02-18](../../docs/SPEC_ANALISIS_2026-02-18.md)

---

## 1. Objective

Stabilize `easiful-web` for production by resolving all critical security, build, and operational issues identified in the February 2026 analysis. The project must emerge from this spec with a strict build pipeline, clean documentation, and zero known high-severity vulnerabilities.

## 2. Scope

### In scope

| Area | Description |
|------|-------------|
| Security | Stripe checkout hardening, log hygiene, input validation |
| Build strictness | Remove `ignoreBuildErrors` / `ignoreDuringBuilds`, fix all resulting errors |
| CI/CD | Fix secret mapping, align Node/pnpm versions, enforce quality gates |
| Functional fixes | Broken links, download URLs, locale-aware redirects |
| Code quality | Remove `any` in auth/payments, clean test artifacts from git |
| Documentation | Resolve README merge conflicts, update all stale docs |
| Project identity | Fix package.json name (`my-v0-project` → `easiful-web`) |

### Out of scope

- Visual redesign or new features
- Full migration to Tailwind v4 or Next.js major upgrade
- Firebase Functions changes (separate repo)
- New page creation

## 3. Requirements

### RF-01: Stripe Checkout Security

The checkout API route must reject all client-controlled abuse vectors.

**Acceptance criteria:**
1. The API route accepts only a `planId` string (`"monthly"` | `"annual"`), resolved server-side to a Stripe price ID from an internal allowlist in `lib/stripe-config.ts`.
2. `success_url` and `cancel_url` are constructed entirely server-side using `NEXTAUTH_URL` or an explicit `ALLOWED_REDIRECT_DOMAINS` env var. No client-supplied URLs are accepted.
3. Invalid `planId` values return HTTP 400 with a generic error message (no internal details leaked).
4. Automated tests cover: valid plan, invalid plan, missing plan.

### RF-02: Log Hygiene

No sensitive data in client or server logs.

**Acceptance criteria:**
1. Zero `console.log` statements in client-side auth/login/header/checkout code paths (use structured server-side logging only where necessary).
2. Server-side logs never include: full tokens, session payloads, `oobCode`, private keys, or complete Stripe objects.
3. Error responses to the client contain only a user-facing message and an error code — no stack traces or internal details.

### RF-03: Build Strictness

The build must fail on real errors.

**Acceptance criteria:**
1. `next.config.mjs`: no `ignoreDuringBuilds` for ESLint, no `ignoreBuildErrors` for TypeScript.
2. All TypeScript errors surfaced by removing these flags are fixed.
3. All ESLint errors surfaced by removing these flags are fixed.
4. `pnpm build` succeeds with zero errors and zero warnings that indicate real issues.

### RF-04: CI/CD Hardening

The pipeline must be correct and reproducible.

**Acceptance criteria:**
1. `.github/workflows/firebase-deploy.yml`: `FIREBASE_PRIVATE_KEY_ID` maps to the correct GitHub secret.
2. Node version in workflow matches the project's target runtime (Node 20).
3. pnpm version in workflow matches `.npmrc` / `packageManager` field.
4. The pipeline runs: lint → type-check → unit tests → build → deploy (in order, failing fast).

### RF-05: Functional Fixes

Broken user-facing behavior must be corrected.

**Acceptance criteria:**
1. Download buttons use URLs from `NEXT_PUBLIC_GOOGLE_PLAY_URL` and `NEXT_PUBLIC_APP_STORE_URL` env vars, with a sensible fallback (not `#` or a YouTube link).
2. The `/forgot-password` link either navigates to a real page or is removed/replaced with the correct auth flow.
3. Auth redirects (login, error, signOut) respect the active locale (`/es/login` not `/login`).
4. Checkout success/cancel URLs preserve the active locale.

### RF-06: Code Quality

Eliminate maintenance hazards.

**Acceptance criteria:**
1. Zero uses of `any` in `lib/auth-config.ts`, `lib/stripe-config.ts`, `app/api/stripe/checkout/route.ts`, and `app/api/auth/` routes. Replace with explicit types or `unknown` + type guards.
2. `package.json` `name` field updated from `my-v0-project` to `easiful-web`.
3. Test artifacts (`test-results/`, `playwright-report/`) added to `.gitignore` and removed from version control if present.
4. No commented-out code blocks in production source files.

### RF-07: Documentation

Docs must reflect the real, current state of the project.

**Acceptance criteria:**
1. `README.md`: merge conflicts resolved, content matches actual pages/routes/capabilities/env vars.
2. `docs/estado-del-proyecto.md`: updated or removed if superseded.
3. `PRODUCTION_CHECKLIST.md`: updated to reflect current hosting (Firebase, not Vercel) and current env var requirements.
4. A "Known State" section in README documents the current date and functional status.

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | No sensitive data exposed in HTTP responses or browser console |
| NFR-02 | `pnpm build` completes in < 60s on CI |
| NFR-03 | Lighthouse Performance score > 90 on landing page |
| NFR-04 | All user-facing text exists in both `languages/es.ts` and `languages/en.ts` |
| NFR-05 | Pipeline is reproducible: same commit → same result locally and in CI |

## 5. Technical Constraints

- **Framework**: Next.js 15 App Router — no pages router
- **Hosting**: Firebase Hosting (static export via `FIREBASE_BUILD=true`) — not Vercel
- **Auth**: NextAuth v4 with JWT strategy — no database sessions
- **Payments**: Stripe Checkout (redirect mode) — no embedded forms
- **i18n**: `next-intl` + custom `LanguageContext` — translations in `languages/*.ts`
- **Package manager**: pnpm 10 — no npm/yarn

## 6. Files Expected to Change

| File/Directory | Change type |
|----------------|-------------|
| `package.json` | Fix name, verify scripts |
| `next.config.mjs` | Remove ignore flags, verify config |
| `app/api/stripe/checkout/route.ts` | Harden validation |
| `lib/stripe-config.ts` | Ensure allowlist pattern |
| `lib/auth-config.ts` | Fix types, locale-aware redirects |
| `app/[locale]/login/page.tsx` | Fix forgot-password link, remove debug logs |
| `components/header.tsx` | Remove debug logs |
| `components/download-button.tsx` | Use env var URLs |
| `.github/workflows/firebase-deploy.yml` | Fix secrets, versions |
| `.gitignore` | Add test artifacts |
| `README.md` | Resolve conflicts, update content |
| `PRODUCTION_CHECKLIST.md` | Update for Firebase hosting |
| `docs/estado-del-proyecto.md` | Update or remove |

## 7. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing `ignoreBuildErrors` surfaces many TS errors | Build blocked | Fix errors incrementally; prioritize auth/payments |
| Removing `ignoreDuringBuilds` surfaces lint errors | Build blocked | Fix errors; disable only non-critical rules if needed |
| Checkout hardening breaks existing flow | Payments broken | Test with Stripe test mode; keep existing test coverage |
| README rewrite loses information | Knowledge loss | Preserve all factual content, only restructure |

## 8. Success Metrics

1. `pnpm build` succeeds with strict config (no ignore flags).
2. `pnpm lint` passes with zero errors.
3. `npx tsc --noEmit` passes with zero errors.
4. `pnpm test:unit` passes — including new checkout validation tests.
5. CI pipeline runs green on a test PR.
6. Zero `console.log` in client-side production paths.
7. README has zero merge conflict markers.
