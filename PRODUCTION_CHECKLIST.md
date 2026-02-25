# Production Checklist - Easiful Web

## Pre-Deploy Verification

### Environment Variables (GitHub Secrets)

Ensure these secrets are configured in GitHub repository settings for CI/CD:

#### Firebase Client SDK (Frontend)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Firebase Admin SDK (Backend)
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_PRIVATE_KEY_ID`
- [ ] `FIREBASE_PRIVATE_KEY` (multi-line key, no wrapping quotes)
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_CLIENT_ID`
- [ ] `FIREBASE_CLIENT_X509_CERT_URL`

#### NextAuth
- [ ] `NEXTAUTH_SECRET` (generated with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` (production URL, e.g., `https://easiful.com`)

#### Google OAuth
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

#### Stripe
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PRICE_MONTHLY`
- [ ] `STRIPE_PRICE_ANNUAL`

#### App Store URLs
- [ ] `NEXT_PUBLIC_GOOGLE_PLAY_URL`
- [ ] `NEXT_PUBLIC_APP_STORE_URL`

#### Firebase Hosting Deployment
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON service account for Firebase CLI)

---

## Firebase Configuration

### Action Links (Email Templates)

Configure in Firebase Console > Authentication > Templates:

- **Email Verification URL**: `https://your-domain/es/auth-action`
- **Password Reset URL**: `https://your-domain/es/auth-action`
- Parameters are appended automatically: `mode=verifyEmail&oobCode=...`

### Authorized Domains
- [ ] Add production domain in Firebase Console > Authentication > Settings > Authorized domains

---

## Build Verification

### Local Build Test
```bash
# Quality checks
npx tsc --noEmit    # TypeScript type check
pnpm lint           # ESLint
pnpm test:unit      # Unit tests

# Production build (Firebase static export)
FIREBASE_BUILD=true pnpm build
```

### CI/CD Pipeline
- [ ] Build completes without errors
- [ ] Lint passes with zero warnings
- [ ] Type check passes with zero errors
- [ ] Unit tests pass

---

## Frontend Checks

- [ ] `/es/auth-action?mode=verifyEmail&oobCode=test` shows error UI (invalid code)
- [ ] `/es/auth-action?mode=resetPassword&oobCode=test` shows error UI (invalid code)
- [ ] `/es/login` login flow works
- [ ] `/es/dashboard` accessible only with auth
- [ ] `/es/pricing` pricing page works
- [ ] Download buttons show correct store URLs (or hidden when unconfigured)

---

## Security Checks

- [ ] `.env.local` NOT in repo (in `.gitignore`)
- [ ] `service-account-key.json` NOT in repo
- [ ] No `console.log` in production client code
- [ ] Logs do not expose `oobCode`, tokens, or private keys
- [ ] Stripe price IDs not exposed to client
- [ ] Checkout URLs constructed server-side only

---

## Performance

- [ ] Lighthouse Score > 90 (Performance)
- [ ] No console errors in production

---

## i18n

- [ ] `/es/...` works correctly
- [ ] `/en/...` works correctly
- [ ] Language selector in header works
- [ ] All translation keys exist in `languages/es.ts` and `languages/en.ts`

---

**Last updated**: 2026-02-22
**Hosting**: Firebase Hosting (static export via `FIREBASE_BUILD=true`)
