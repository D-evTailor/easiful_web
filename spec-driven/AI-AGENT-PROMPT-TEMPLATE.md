# AI Agent Prompt Template

This document contains prompt templates for assigning spec implementations to AI agents working on **Easiful Web**.

---

## Main Template

Copy and paste the following prompt, replacing `[SPEC-{issue}-XXX-name]` with the spec identifier (e.g. `SPEC-0042-001-checkout-retry`):

```
Act as a Senior Software Engineer expert in Next.js (App Router), TypeScript, Tailwind CSS, Firebase and Stripe.

## Your Task

Implement the feature defined in @spec-driven/[SPEC-{issue}-XXX-name]/SPEC.md following the Spec-Driven Development methodology.

## Instructions

1. **MANDATORY READING** (in this order):
   - @spec-driven/[SPEC-{issue}-XXX-name]/SPEC.md - Complete technical specification
   - @spec-driven/[SPEC-{issue}-XXX-name]/AGENT_GUIDE.md - Step-by-step guide
   - @spec-driven/[SPEC-{issue}-XXX-name]/CONFIG_SOURCES.md - Configuration sources
   - @spec-driven/[SPEC-{issue}-XXX-name]/TESTS.md - Test cases

2. **IMPLEMENT** following the phases defined in AGENT_GUIDE.md

3. **DOCUMENT** your progress by updating @spec-driven/[SPEC-{issue}-XXX-name]/IMPLEMENTATION.md after each completed phase

4. **VERIFY** by running the tests defined in TESTS.md

## Project Context

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript 5
- **Styling**: Tailwind CSS 3 + shadcn/ui (Radix UI) — components in `components/ui/`
- **Auth**: NextAuth v4 (JWT) synced with Firebase Auth — config in `lib/auth-config.ts`
- **Payments**: Stripe Checkout — config in `lib/stripe-config.ts`, API route in `app/api/stripe/`
- **Backend**: Firebase Admin SDK (Firestore) — config in `lib/firebase-admin-config.ts`
- **i18n**: Custom LanguageContext (`lib/language-context.tsx`), translations in `languages/es.ts` and `languages/en.ts`
- **Routing**: All pages under `app/[locale]/` with `es` (default) and `en` locales
- **Package manager**: pnpm

## Critical Rules

- Do NOT modify files outside the scope defined in the spec
- DO document any deviation from the spec with justification
- DO ask if something is unclear before assuming
- Use `cn()` from `lib/utils.ts` for Tailwind class merging
- Follow existing patterns: server components for auth-protected pages (`getServerSession` + `redirect`), client components for interactive pages
- Stripe price IDs must never be exposed to the client — use the `planId` pattern in `lib/stripe-config.ts`
- Add translation keys to both `languages/es.ts` and `languages/en.ts` for any new user-facing text

## When Finishing

1. Update IMPLEMENTATION.md with the final status
2. Run the tests and document results in TESTS.md
3. Verify: `npx tsc --noEmit` (type check), `pnpm lint`, `pnpm test:unit`
4. Indicate that it is ready for review

Start by reading the spec files!
```

---

## Short Template (For Agents With Context)

When the agent is already familiar with the project:

```
Implement @spec-driven/[SPEC-{issue}-XXX-name] following the spec-driven methodology:

1. Read SPEC.md, AGENT_GUIDE.md, CONFIG_SOURCES.md, TESTS.md
2. Implement the phases in order
3. Update IMPLEMENTATION.md with your progress
4. Run tests and document results

Start now.
```

---

## Review Template

When the implementation is complete, use this prompt for review:

```
Act as a Senior Software Engineer code reviewer.

## Your Task

Review the implementation of @spec-driven/[SPEC-{issue}-XXX-name]

## Instructions

1. Read @spec-driven/[SPEC-{issue}-XXX-name]/SPEC.md to understand the requirements
2. Read @spec-driven/[SPEC-{issue}-XXX-name]/IMPLEMENTATION.md to see what was implemented
3. Review the modified files listed in IMPLEMENTATION.md
4. Verify acceptance criteria compliance
5. Run/verify the tests from TESTS.md
6. Document your review in @spec-driven/[SPEC-{issue}-XXX-name]/REVIEW.md

## Review Checklist

- [ ] Code follows existing project patterns (App Router, shadcn/ui, cn() utility)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No commented-out code or debug console.logs
- [ ] Unit tests pass (`pnpm test:unit`)
- [ ] i18n: all new text has keys in both `languages/es.ts` and `languages/en.ts`
- [ ] Spec compliance: all acceptance criteria met
- [ ] No regressions in existing functionality

## Final Decision

When done, indicate one of:
- ✅ APPROVED - Ready for merge
- 🔄 CHANGES REQUESTED - List of required changes
- ❌ REJECTED - Reasons and suggested alternatives
```

---

## Template for SPEC-0021-001: Production Hardening

```
Act as a Senior Software Engineer expert in Next.js (App Router), TypeScript, Tailwind CSS, Firebase, and Stripe.

## Your Task

Harden the `easiful-web` project for production by implementing all requirements in the spec-driven methodology. This is a stabilization task — no new features, only security fixes, build strictness, code quality, CI/CD fixes, and documentation updates.

## Instructions

1. **MANDATORY READING** (read these files in this exact order before writing any code):
   - `spec-driven/SPEC-0021-001-production-hardening/SPEC.md` — Complete technical specification with 7 requirements (RF-01 through RF-07)
   - `spec-driven/SPEC-0021-001-production-hardening/AGENT_GUIDE.md` — Step-by-step guide with 7 phases
   - `spec-driven/SPEC-0021-001-production-hardening/CONFIG_SOURCES.md` — Authoritative configuration sources
   - `spec-driven/SPEC-0021-001-production-hardening/TESTS.md` — Required test cases
   - `docs/SPEC_ANALISIS_2026-02-18.md` — Original analysis that identified all issues

2. **ALSO READ** these project files to understand the current state:
   - `README.md` — Has merge conflicts you must resolve (lines 121-269)
   - `next.config.mjs` — Current build config (you will modify this)
   - `package.json` — Name is wrong (`my-v0-project`), needs fixing
   - `lib/auth-config.ts` — Auth configuration with potential `any` types
   - `lib/stripe-config.ts` — Stripe plan configuration
   - `app/api/stripe/checkout/route.ts` — Checkout API route to harden
   - `.github/workflows/firebase-deploy.yml` — CI/CD pipeline to fix
   - `firebase.json` — Firebase hosting config
   - `.gitignore` — Needs test artifact entries
   - `PRODUCTION_CHECKLIST.md` — Needs update for Firebase hosting

3. **IMPLEMENT** following the 7 phases defined in AGENT_GUIDE.md, in order:
   - Phase 1: Project Identity & Housekeeping
   - Phase 2: Build Strictness (remove ignore flags, fix all TS/lint errors)
   - Phase 3: Security — Stripe Checkout (harden validation)
   - Phase 4: Security — Log Hygiene (remove debug logs, sanitize server logs)
   - Phase 5: Functional Fixes (broken links, download URLs, locale-aware redirects)
   - Phase 6: CI/CD Hardening (fix secrets, versions, pipeline order)
   - Phase 7: Documentation (resolve README conflicts, update all docs)

4. **DOCUMENT** your progress by updating `spec-driven/SPEC-0021-001-production-hardening/IMPLEMENTATION.md` after each completed phase

5. **VERIFY** after all phases by running:
   ```
   npx tsc --noEmit
   pnpm lint
   pnpm test:unit
   pnpm build
   ```

## Project Context

- **Framework**: Next.js 15.2.8 (App Router) with React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui (Radix UI) — components in `components/ui/`
- **Auth**: NextAuth v4 (JWT strategy) synced with Firebase Auth — config in `lib/auth-config.ts`
- **Payments**: Stripe Checkout (redirect mode) — config in `lib/stripe-config.ts`, API route in `app/api/stripe/checkout/`
- **Backend**: Firebase Admin SDK (Firestore) — config in `lib/firebase-admin-config.ts`
- **Hosting**: Firebase Hosting (static export via `FIREBASE_BUILD=true`) — NOT Vercel
- **i18n**: `next-intl` + custom LanguageContext (`lib/language-context.tsx`), translations in `languages/es.ts` and `languages/en.ts`
- **Routing**: All pages under `app/[locale]/` with `es` (default) and `en`
- **Package manager**: pnpm 10
- **Testing**: Vitest (unit in `test/unit/`), Playwright (E2E in `test/`)
- **CI/CD**: GitHub Actions → Firebase Hosting (preview channels for PRs, production for main)
- **Functions**: Managed in separate repo (`easiful-functions`) per ADR-001 — do NOT add functions to this repo

## Critical Rules

- Do NOT add new features — this is strictly stabilization and hardening
- Do NOT modify files outside the scope defined in the spec (see SPEC.md §6 "Files Expected to Change")
- DO document any deviation from the spec with justification in IMPLEMENTATION.md
- DO ask if something is unclear before assuming
- Use `cn()` from `lib/utils.ts` for Tailwind class merging
- Follow existing patterns: server components for auth-protected pages (`getServerSession` + `redirect`), client components for interactive pages
- Stripe price IDs must never be exposed to the client — use the `planId` → server-side lookup pattern
- Add translation keys to both `languages/es.ts` and `languages/en.ts` for any new user-facing text
- Make small, atomic commits after each phase with descriptive messages (e.g., `fix: harden Stripe checkout validation (SPEC-0021-001 Phase 3)`)
- Do NOT use `@ts-ignore` or `@ts-expect-error` unless absolutely unavoidable — document the reason if you must

## Key Issues to Fix (Summary)

1. **`package.json` name** is `my-v0-project` → change to `easiful-web`
2. **`next.config.mjs`** may have `ignoreBuildErrors` / `ignoreDuringBuilds` → remove them, fix all surfaced errors
3. **Checkout route** may accept client-controlled `priceId` and URLs → harden with server-side allowlist and URL construction
4. **Debug `console.log`** scattered in client components → remove all
5. **`any` types** in auth/payments code → replace with explicit types
6. **README.md** has merge conflict markers (lines 121-269) → resolve
7. **CI workflow** has incorrect secret mapping for `FIREBASE_PRIVATE_KEY_ID` → fix
8. **Download buttons** may link to `#` or wrong URL → use env vars
9. **`/forgot-password` link** in login page → remove or replace
10. **Auth redirects** hardcoded to `/es/login` → make locale-aware
11. **Test artifacts** tracked in git → add to `.gitignore`, remove from tracking
12. **`PRODUCTION_CHECKLIST.md`** references Vercel → update for Firebase
13. **`firebase.json`** may have orphan functions config → remove if functions are in separate repo

## When Finishing

1. Update `spec-driven/SPEC-0021-001-production-hardening/IMPLEMENTATION.md` with the final status of all phases
2. Fill in the test results table in IMPLEMENTATION.md
3. Verify all 4 commands pass: `npx tsc --noEmit`, `pnpm lint`, `pnpm test:unit`, `pnpm build`
4. Confirm zero `console.log` in client production paths
5. Confirm zero merge conflict markers in any file
6. Confirm zero `any` types in auth/payments code
7. Indicate that the implementation is ready for review

Start by reading the spec files in the order listed above, then proceed with Phase 1.
```

---


## Usage Notes

### When to Use Each Template

| Situation | Template |
|-----------|----------|
| New implementation, agent with no context | Main Template |
| Agent already familiar with the project | Short Template |
| Review completed implementation | Review Template |

### Tips for Better Results

1. **Initial context**: For a new agent, include key project files as context (`lib/auth-config.ts`, `lib/stripe-config.ts`, relevant page under `app/[locale]/`)

2. **Incremental verification**: Ask the agent to confirm understanding after reading each file before implementing

3. **Frequent commits**: Instruct the agent to make small, descriptive commits after each phase

4. **Ask first**: Encourage the agent to ask if something is unclear rather than assume

### Example Full Session

```
User: [Paste Main Template for SPEC-0042-001]

Agent: I have read the files. I understand I must implement:
       - Retry logic for failed Stripe checkout sessions
       - Error toast with actionable message
       - Unit tests for the retry flow
       Proceed with Phase 1?

User: Yes, proceed.

Agent: [Implements Phase 1, updates IMPLEMENTATION.md]
       Phase 1 complete. Proceed with Phase 2?

User: Yes.

[... continues until complete ...]

Agent: Implementation complete. IMPLEMENTATION.md updated.
       Tests run: 8/8 passing.
       Ready for review.

User: [Paste Review Template]
```
