# AGENT_GUIDE: Production Hardening

**Spec:** SPEC-0021-001  
**Estimated phases:** 7  
**Estimated effort:** Medium-High

---

## Pre-Implementation Checklist

Before writing any code:

- [ ] Read `SPEC.md` in full
- [ ] Read `CONFIG_SOURCES.md` for environment variable sources
- [ ] Read `TESTS.md` for required test cases
- [ ] Read `README.md` (note merge conflicts — you will fix them)
- [ ] Read `next.config.mjs` to understand current build flags
- [ ] Read `lib/stripe-config.ts` and `app/api/stripe/checkout/route.ts`
- [ ] Read `lib/auth-config.ts`
- [ ] Read `.github/workflows/firebase-deploy.yml`
- [ ] Read `docs/SPEC_ANALISIS_2026-02-18.md` for full analysis context

---

## Phase 1: Project Identity & Housekeeping

**Goal:** Fix metadata and clean version-controlled artifacts.

### Steps

1. **Fix `package.json`:**
   - Change `"name": "my-v0-project"` → `"name": "easiful-web"`

2. **Clean `.gitignore`:**
   - Ensure these entries exist:
     ```
     test-results/
     playwright-report/
     blob-report/
     ```
   - If `test-results/` or `playwright-report/` directories are tracked in git, remove them with `git rm -r --cached`.

3. **Remove commented-out code blocks** in production source files (scan `app/`, `components/`, `lib/`).

### Verification
- `git status` shows only intended changes
- No test artifact directories tracked

### Update IMPLEMENTATION.md
Document: files changed, artifacts removed.

---

## Phase 2: Build Strictness

**Goal:** Make the build fail on real errors, then fix all surfaced issues.

### Steps

1. **Update `next.config.mjs`:**
   - Remove any `eslint: { ignoreDuringBuilds: true }` block
   - Remove any `typescript: { ignoreBuildErrors: true }` block
   - Keep the existing `FIREBASE_BUILD` conditional, `productionBrowserSourceMaps`, `experimental`, and `webpack` config

2. **Run `npx tsc --noEmit`** and fix all TypeScript errors:
   - Focus first on `lib/auth-config.ts`, `lib/stripe-config.ts`, `app/api/` routes
   - Replace `any` with explicit types or `unknown` + type guards
   - Do NOT suppress errors with `@ts-ignore` or `@ts-expect-error` unless absolutely unavoidable (document reason)

3. **Run `pnpm lint`** and fix all ESLint errors:
   - Fix auto-fixable issues first (`pnpm lint --fix`)
   - Manually fix remaining errors
   - If a rule is genuinely inapplicable, disable it per-line with a comment explaining why

4. **Run `pnpm build`** and confirm success with zero errors.

### Verification
- `npx tsc --noEmit` → exit 0
- `pnpm lint` → exit 0
- `pnpm build` → exit 0

### Update IMPLEMENTATION.md
Document: flags removed, number of TS/lint errors fixed, any suppressions added with justification.

---

## Phase 3: Security — Stripe Checkout

**Goal:** Harden the checkout API route against client-controlled abuse.

### Steps

1. **Review `lib/stripe-config.ts`:**
   - Confirm there is a `PLAN_ALLOWLIST` (or equivalent) mapping `planId` → Stripe price ID
   - If missing, create one:
     ```typescript
     export const PLAN_CONFIG: Record<string, { priceId: string; name: string }> = {
       monthly: {
         priceId: process.env.STRIPE_PRICE_MONTHLY!,
         name: 'Monthly',
       },
       annual: {
         priceId: process.env.STRIPE_PRICE_ANNUAL!,
         name: 'Annual',
       },
     };
     ```

2. **Harden `app/api/stripe/checkout/route.ts`:**
   - Accept ONLY `{ planId: string }` from the request body
   - Look up `planId` in `PLAN_CONFIG` — if not found, return 400
   - Construct `success_url` and `cancel_url` entirely server-side using `process.env.NEXTAUTH_URL` and the user's locale
   - Do NOT accept any URL parameters from the client
   - Return generic error messages (no Stripe error details to client)

3. **Add proper TypeScript types** for request/response shapes.

### Verification
- Send POST with `planId: "monthly"` → 200 + checkout URL
- Send POST with `planId: "hacked"` → 400
- Send POST with no body → 400
- URLs in Stripe session are all server-constructed

### Update IMPLEMENTATION.md
Document: changes to checkout route, new types added, validation logic.

---

## Phase 4: Security — Log Hygiene

**Goal:** Remove debug logs and sanitize server-side logging.

### Steps

1. **Scan for `console.log` in client components:**
   - Search all files under `app/[locale]/`, `components/`, `lib/` (client-side files)
   - Remove all `console.log` that output debug/development information
   - Keep only `console.error` for genuine error handling (and ensure they don't leak sensitive data)

2. **Audit server-side logs** (`app/api/`, `lib/auth-config.ts`, `lib/firebase-admin-config.ts`):
   - Ensure no log statement includes: full tokens, session objects, `oobCode`, private keys, Stripe customer/subscription objects
   - Replace verbose logs with structured, minimal messages: `console.error('[checkout] Invalid planId', { planId })`

3. **Verify error responses:**
   - API routes must return `{ error: "descriptive but generic message" }` — no stack traces

### Verification
- `grep -r "console.log" app/ components/ lib/` returns only intentional, safe logs
- No tokens, keys, or codes visible in any log statement

### Update IMPLEMENTATION.md
Document: number of logs removed/sanitized, files changed.

---

## Phase 5: Functional Fixes

**Goal:** Fix broken links, download URLs, and locale-aware redirects.

### Steps

1. **Download buttons (`components/download-button.tsx` or similar):**
   - Use `process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL` and `process.env.NEXT_PUBLIC_APP_STORE_URL`
   - Fallback: if env var is empty, hide the button or show a "Coming soon" state — never link to `#` or an unrelated URL

2. **Forgot password link:**
   - Search for `/forgot-password` references in `app/[locale]/login/`
   - Either: (a) remove the link, (b) point it to the Firebase password reset flow via `/auth-action`, or (c) implement the page
   - Recommended: remove or point to the existing auth-action flow since password reset is already handled

3. **Locale-aware auth redirects in `lib/auth-config.ts`:**
   - NextAuth `pages.signIn` should be `/${locale}/login` (not hardcoded `/login` or `/es/login`)
   - `signOut` callback should redirect to `/${locale}` preserving the active locale
   - If NextAuth doesn't support dynamic locale in pages config, use the `redirect` callback to inject locale

4. **Checkout success/cancel URLs:**
   - In the checkout route, read the user's locale from the session or a request header
   - Construct URLs as `${baseUrl}/${locale}/dashboard?checkout=success` and `${baseUrl}/${locale}/pricing?checkout=cancelled`

### Verification
- Download buttons show correct store URLs (or graceful fallback)
- No links to `/forgot-password` in the codebase
- Login redirect after signIn goes to `/{locale}/dashboard`
- Checkout success redirects to `/{locale}/dashboard`

### Update IMPLEMENTATION.md
Document: links fixed, locale handling approach, files changed.

---

## Phase 6: CI/CD Hardening

**Goal:** Fix the deployment pipeline.

### Steps

1. **Fix `.github/workflows/firebase-deploy.yml`:**
   - Verify `FIREBASE_PRIVATE_KEY_ID` maps to the correct GitHub secret name
   - Verify Node version matches project target (Node 20)
   - Verify pnpm version matches project config (pnpm 10)
   - Verify pipeline order: checkout → setup → install → lint → type-check → test:unit → build → deploy

2. **Verify `.env` template generation step:**
   - The workflow creates `.env.local` from GitHub secrets — verify all required vars are mapped
   - Cross-reference with `.env.local.example`

3. **Remove any Firebase Functions configuration** from `firebase.json` if functions are managed in a separate repo (per ADR-001):
   - Remove `functions` key and any `predeploy` scripts that reference local functions
   - Keep `hosting` and `firestore` configuration

### Verification
- Workflow YAML is valid (check with `actionlint` or manual review)
- All secret names match what's expected
- No functions predeploy in `firebase.json` if using separate repo

### Update IMPLEMENTATION.md
Document: secrets fixed, versions aligned, firebase.json cleaned.

---

## Phase 7: Documentation

**Goal:** Make all documentation accurate and current.

### Steps

1. **Fix `README.md`:**
   - Resolve the merge conflict (lines 121-269)
   - Keep the best content from both sides:
     - "Known State" section from HEAD
     - "Auth Action" documentation from the other branch (move to its own doc or keep inline)
   - Remove duplicate/stale sections (TODO lists that are already done, Vercel references if hosting is Firebase)
   - Ensure the pages table, env vars table, and deployment instructions are accurate
   - Remove emoji headers — use plain markdown

2. **Update `PRODUCTION_CHECKLIST.md`:**
   - Replace Vercel references with Firebase Hosting where applicable
   - Update env var checklist to match current `.env.local.example`
   - Update date

3. **Update or archive `docs/estado-del-proyecto.md`:**
   - This document is from January 2025 and severely outdated
   - Either update it with current data or rename to `docs/archive/estado-del-proyecto-2025-01.md`

4. **Verify `docs/SPEC_ANALISIS_2026-02-18.md`:**
   - Add a note at the top indicating which items have been addressed by this spec

### Verification
- `README.md` has zero merge conflict markers (`<<<<`, `====`, `>>>>`)
- All links in README resolve to real pages/files
- PRODUCTION_CHECKLIST references correct hosting platform

### Update IMPLEMENTATION.md
Document: files updated, conflicts resolved, content decisions.

---

## Final Checklist

After all phases are complete:

- [ ] `npx tsc --noEmit` → exit 0
- [ ] `pnpm lint` → exit 0
- [ ] `pnpm test:unit` → all pass (including new checkout tests)
- [ ] `pnpm build` → exit 0
- [ ] Zero `console.log` in client production code
- [ ] Zero merge conflict markers in any file
- [ ] Zero `any` types in auth/payments code
- [ ] `IMPLEMENTATION.md` fully updated
- [ ] Ready for review → mark status 🔄
