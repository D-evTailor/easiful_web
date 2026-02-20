# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build
pnpm lint             # ESLint (next lint)
npx tsc --noEmit      # TypeScript type check
pnpm test:unit        # Unit tests (Vitest)
pnpm test             # E2E tests (Playwright, requires running dev server)
pnpm test:ui          # Playwright UI mode

FIREBASE_BUILD=true pnpm build   # Static export to /out/ for Firebase Hosting
```

## Architecture

**Next.js 15 App Router** with TypeScript, React 19, pnpm, Tailwind CSS 3 + shadcn/ui.

### Routing

All pages are under `app/[locale]/` with locale prefix (`es` default, `en`). The middleware (`middleware.ts`) redirects bare paths to `/{defaultLocale}/path`. The `/ios` path is excluded from locale redirect (OTA installation).

- **Server components** (use `getServerSession` + `redirect` for auth): `dashboard`, `pricing`, `sobre-nosotros`, `faq`, `legal/*`
- **Client components**: landing page, `login`, `auth-action`, `contacto`
- **API routes**: `/api/auth/[...nextauth]`, `/api/auth/firebase-token`, `/api/stripe/checkout`

### Auth: Dual NextAuth + Firebase

The app uses **NextAuth v4** as primary auth (JWT strategy) with two providers:
- **GoogleProvider**: OAuth, verifies user exists in Firebase Auth before allowing sign-in
- **CredentialsProvider**: email/password validated against Firebase Auth

After NextAuth login, `FirebaseAuthProvider` (`components/providers/firebase-auth-provider.tsx`) syncs to Firebase client SDK via a custom token from `/api/auth/firebase-token`. This enables client-side Firestore reads using the mobile app's existing security rules.

Config: `lib/auth-config.ts` (NextAuth options), `lib/firebase-config.ts` (client SDK), `lib/firebase-admin-config.ts` (Admin SDK).

**Web is login-only** — user registration happens exclusively via the mobile app.

### Stripe Integration

Client sends a logical `planId` ("monthly" | "annual") to `/api/stripe/checkout`. The server resolves it to a Stripe price ID from an internal allowlist in `lib/stripe-config.ts` — raw price IDs are never exposed to the client. The `useSubscription` hook (`hooks/use-subscription.ts`) manages checkout state.

Stripe webhooks and Firestore subscription sync are handled by Cloud Functions in a **separate repo** (`easiful-functions`). The NextAuth session callback reads subscription data from Firestore `users/{uid}` on each session refresh.

### i18n

Custom `LanguageContext` (`lib/language-context.tsx`) provides `language` and `t()`. Translation files: `languages/es.ts`, `languages/en.ts` (flat key-value objects). Locale is derived from the `[locale]` URL segment.

### Styling

Tailwind CSS with CSS custom properties for light/dark theming (defined in `styles/globals.css`). shadcn/ui components in `components/ui/`. Brand color: `rgb(7, 150, 105)` (emerald green). Font: Quicksand. Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for class merging.

### Key Patterns

- Route protection in server components: `getServerSession()` + `redirect()` (no middleware-level auth)
- Root providers chain: `SessionProvider` → `FirebaseAuthProvider` (in `components/providers.tsx`)
- `generateStaticParams` in locale layout generates both locale variants at build time
- Firebase static export (`FIREBASE_BUILD=true`) disables API routes — NextAuth/Stripe only work in Node.js deployments (Vercel)

## Spec-Driven Development

The `spec-driven/` directory contains a methodology for planning and implementing features via AI agents. See `spec-driven/README.md` for full details.

### Workflow

1. **Specification** — Create a `SPEC-{ISSUE_ID}-{SEQ}-{kebab-name}/` directory with: `SPEC.md` (requirements), `AGENT_GUIDE.md` (step-by-step phases), `TESTS.md` (test cases), and optionally `CONFIG_SOURCES.md`.
2. **Implementation** — An AI agent reads the spec files, implements phase by phase, and logs progress in `IMPLEMENTATION.md`.
3. **Review** — Reviewer verifies compliance with the spec and documents findings in `REVIEW.md`.
4. **Merge** — PR opened with spec reference after approval.

### Naming Convention

`SPEC-{ISSUE_ID}-{SEQ}-{kebab-name}` — ISSUE_ID is the 4-digit issue number from the branch (e.g. branch `42-stripe-improvements` → `SPEC-0042-001-checkout-retry`).

### Agent Prompt Templates

`spec-driven/AI-AGENT-PROMPT-TEMPLATE.md` provides ready-to-use prompts:
- **Main Template** — For agents with no prior context; includes project stack, critical rules, and verification steps
- **Short Template** — For agents already familiar with the project
- **Review Template** — For reviewing a completed implementation

### Key Rules for Agents Working on Specs

- Read all spec files (`SPEC.md`, `AGENT_GUIDE.md`, `CONFIG_SOURCES.md`, `TESTS.md`) before writing code
- Follow the phase order in `AGENT_GUIDE.md`; update `IMPLEMENTATION.md` after each phase
- Do not modify files outside the scope defined in the spec
- Document any deviation from the spec with justification
- Verify before marking done: `npx tsc --noEmit`, `pnpm lint`, `pnpm test:unit`
