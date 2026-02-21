# CONFIG_SOURCES: Production Hardening

**Spec:** SPEC-0021-001

This document defines the authoritative source for every configuration value referenced in the spec. When in doubt, this file is the single source of truth.

---

## Environment Variables

### Source of Truth: `.env.local.example`

All environment variables are defined in `.env.local.example`. The CI/CD workflow (`.github/workflows/firebase-deploy.yml`) generates `.env.local` from GitHub Secrets at build time.

### Variable Reference

| Variable | Source | Used By | Notes |
|----------|--------|---------|-------|
| `NEXTAUTH_SECRET` | GitHub Secret | `lib/auth-config.ts` | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | GitHub Secret | `lib/auth-config.ts`, checkout route | Canonical production URL (e.g. `https://easiful.com`) |
| `GOOGLE_CLIENT_ID` | GitHub Secret | `lib/auth-config.ts` | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | GitHub Secret | `lib/auth-config.ts` | Google OAuth |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | GitHub Secret | `lib/firebase-config.ts` | Firebase client SDK |
| `FIREBASE_PROJECT_ID` | GitHub Secret | `lib/firebase-admin-config.ts` | Firebase Admin SDK |
| `FIREBASE_PRIVATE_KEY` | GitHub Secret | `lib/firebase-admin-config.ts` | Multi-line key, no wrapping quotes |
| `FIREBASE_PRIVATE_KEY_ID` | GitHub Secret | `lib/firebase-admin-config.ts` | **CI bug:** verify correct secret name mapping |
| `FIREBASE_CLIENT_EMAIL` | GitHub Secret | `lib/firebase-admin-config.ts` | Firebase Admin SDK |
| `FIREBASE_CLIENT_ID` | GitHub Secret | `lib/firebase-admin-config.ts` | Firebase Admin SDK |
| `FIREBASE_CLIENT_X509_CERT_URL` | GitHub Secret | `lib/firebase-admin-config.ts` | Firebase Admin SDK |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | GitHub Secret | Client-side Stripe.js | Stripe publishable key |
| `STRIPE_SECRET_KEY` | GitHub Secret | `app/api/stripe/checkout/route.ts` | Stripe server-side API |
| `STRIPE_WEBHOOK_SECRET` | GitHub Secret | Webhook route (separate repo) | Not used in this repo directly |
| `STRIPE_PRICE_MONTHLY` | GitHub Secret | `lib/stripe-config.ts` | Stripe price ID for monthly plan |
| `STRIPE_PRICE_ANNUAL` | GitHub Secret | `lib/stripe-config.ts` | Stripe price ID for annual plan |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | GitHub Secret | `components/download-button.tsx` | Google Play store link |
| `NEXT_PUBLIC_APP_STORE_URL` | GitHub Secret | `components/download-button.tsx` | App Store link |

---

## Configuration Files

| File | Purpose | Authority |
|------|---------|-----------|
| `next.config.mjs` | Next.js build configuration | This spec defines target state |
| `firebase.json` | Firebase Hosting + Firestore config | ADR-001 defines functions strategy |
| `.github/workflows/firebase-deploy.yml` | CI/CD pipeline | This spec defines target state |
| `tsconfig.json` | TypeScript compiler options | Must have `strict: true` |
| `tailwind.config.ts` | Tailwind CSS configuration | No changes expected |
| `.npmrc` | pnpm security policy | No changes expected |
| `.gitignore` | Version control exclusions | This spec adds test artifacts |
| `.env.local.example` | Env var template | Must match this document |

---

## Stripe Plan Configuration

### Source of Truth: `lib/stripe-config.ts`

The plan allowlist must be defined server-side. The client sends only a `planId` string; the server resolves it.

```
Client sends: { planId: "monthly" }
Server resolves: PLAN_CONFIG["monthly"].priceId → process.env.STRIPE_PRICE_MONTHLY
```

**Valid plan IDs:** `monthly`, `annual`

Any other value must be rejected with HTTP 400.

---

## Hosting Configuration

### Source of Truth: `firebase.json` + ADR-001

| Aspect | Value |
|--------|-------|
| Platform | Firebase Hosting |
| Build output | `out/` (static export) |
| Build flag | `FIREBASE_BUILD=true` |
| Region | `europe-southwest1` |
| Functions | Separate repo (`easiful-functions`) — not deployed from this repo |
| Rewrites | All routes → `/index.html` (SPA fallback) |

---

## Internationalization

### Source of Truth: `languages/es.ts` and `languages/en.ts`

| Aspect | Value |
|--------|-------|
| Default locale | `es` (Spanish) |
| Supported locales | `es`, `en` |
| Routing | `app/[locale]/` |
| Middleware | `middleware.ts` handles locale detection/redirect |
| Context | `lib/language-context.tsx` |

---

## Authentication

### Source of Truth: `lib/auth-config.ts`

| Aspect | Value |
|--------|-------|
| Provider | NextAuth v4 with JWT strategy |
| Identity | Firebase Auth (Google OAuth + Email/Password) |
| Registration | Mobile app only — web is login-only |
| Session storage | JWT (no database sessions) |
| Pages | `/[locale]/login` (must respect locale) |
