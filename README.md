# Easiful Web

Corporate web application for **Easiful** — a personal organization mobile app. This web portal provides marketing pages, user authentication (login only, registration via mobile app), subscription management through Stripe, and a user dashboard.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + Radix UI + shadcn/ui
- **Auth**: NextAuth v4 (Google OAuth + Email/Password via Firebase Auth)
- **Payments**: Stripe Checkout (subscriptions)
- **Backend**: Firebase Admin SDK (Firestore for user/subscription data)
- **Hosting**: Firebase Hosting (static export)
- **i18n**: Spanish (default) / English via `next-intl` and custom language context
- **Package Manager**: pnpm

## Pages

| Route | Description |
|---|---|
| `/[locale]` | Landing page with hero, features, CTA |
| `/[locale]/login` | Login (email/password + Google). No registration — users register via mobile app |
| `/[locale]/dashboard` | Authenticated user dashboard with subscription status |
| `/[locale]/pricing` | Subscription plans (Free, Monthly 3.50€, Annual 12€) |
| `/[locale]/sobre-nosotros` | About us |
| `/[locale]/contacto` | Contact form |
| `/[locale]/faq` | Frequently asked questions |
| `/[locale]/legal/*` | Legal notice, privacy policy, cookie policy |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication endpoints |
| `/api/auth/firebase-token` | GET | Generates Firebase custom tokens for authenticated users |
| `/api/stripe/checkout` | POST | Creates Stripe checkout sessions (validates planId against server allowlist) |

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd easiful-web
pnpm install

# Configure environment (copy and fill values)
cp .env.local.example .env.local

# Development
pnpm dev        # http://localhost:3000

# Quality checks
pnpm lint       # ESLint
pnpm test:unit  # Vitest unit tests
npx tsc --noEmit # TypeScript check

# Production build
pnpm build
```

## Environment Variables

See `.env.local.example` for the full list. Required variables:

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption secret |
| `NEXTAUTH_URL` | Yes | Canonical app URL (e.g., `https://easiful.com`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_FIREBASE_*` | Yes | Firebase client SDK config (6 vars) |
| `FIREBASE_PROJECT_ID` | Yes | Firebase Admin project ID |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase Admin private key |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase Admin client email |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_PRICE_MONTHLY` | No | Override monthly plan Stripe price ID |
| `STRIPE_PRICE_ANNUAL` | No | Override annual plan Stripe price ID |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | No | Google Play store URL for download buttons |
| `NEXT_PUBLIC_APP_STORE_URL` | No | App Store URL for download buttons |

## Deployment

### Firebase Hosting (CI/CD)

The GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`) handles deployment:

- **Pull requests**: Deploy to preview channel (`pr-<number>`)
- **Push to main/master**: Deploy to production

Secrets must be configured in the GitHub repository settings.

### Manual Build for Firebase

```bash
FIREBASE_BUILD=true pnpm build
# Output in /out/ directory
firebase deploy --only hosting
```

## Architecture Notes

- **Functions**: Firebase Cloud Functions are managed in a separate repository (`easiful-functions`). See [ADR-001](docs/adr/001-functions-separate-repo.md).
- **Auth flow**: Web supports login only. User registration happens exclusively via the mobile app. The web verifies users exist in Firebase Auth before allowing sign-in.
- **Checkout flow**: Client sends a `planId` (e.g., "monthly"); the server resolves it to a Stripe price ID from an internal allowlist and constructs redirect URLs server-side.
- **Subscription sync**: Stripe webhooks (in `easiful-functions`) update Firestore. The NextAuth session callback reads subscription data from Firestore on each session refresh.

## Testing

```bash
pnpm test:unit     # Unit tests (vitest) — validation, checkout route
pnpm test          # E2E tests (Playwright) — requires running dev server
```

## Known State (2026-02-18)

- Login, dashboard, pricing, and all public pages functional.
- Stripe checkout hardened with server-side plan validation.
- App store download URLs require configuration via env vars (currently default to `#`).
- Contact form is a UI mock (no backend API yet — tracked as TODO).
- E2E test suite exists for auth flows but requires test credentials to run.
