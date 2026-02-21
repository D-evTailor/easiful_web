# TESTS: Production Hardening

**Spec:** SPEC-0021-001  
**Test framework:** Vitest (unit), Playwright (E2E)  
**Test location:** `test/unit/` (unit), `test/` (E2E)

---

## Unit Tests

### UT-01: Stripe Checkout Validation

**File:** `test/unit/checkout-validation.test.ts`

| ID | Test Case | Input | Expected |
|----|-----------|-------|----------|
| UT-01-A | Valid monthly plan | `{ planId: "monthly" }` | 200, returns checkout URL |
| UT-01-B | Valid annual plan | `{ planId: "annual" }` | 200, returns checkout URL |
| UT-01-C | Invalid plan ID | `{ planId: "hacked" }` | 400, error message |
| UT-01-D | Missing plan ID | `{}` | 400, error message |
| UT-01-E | Empty string plan | `{ planId: "" }` | 400, error message |
| UT-01-F | Numeric plan ID | `{ planId: 123 }` | 400, error message |

### UT-02: Plan Config Allowlist

**File:** `test/unit/stripe-config.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| UT-02-A | PLAN_CONFIG contains "monthly" | Key exists, has priceId |
| UT-02-B | PLAN_CONFIG contains "annual" | Key exists, has priceId |
| UT-02-C | PLAN_CONFIG has no extra keys | Only "monthly" and "annual" |
| UT-02-D | All priceIds are non-empty strings | Truthy string values |

### UT-03: URL Construction (Checkout)

**File:** `test/unit/checkout-urls.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| UT-03-A | Success URL uses NEXTAUTH_URL base | Starts with configured base URL |
| UT-03-B | Cancel URL uses NEXTAUTH_URL base | Starts with configured base URL |
| UT-03-C | Success URL preserves locale | Contains `/{locale}/` |
| UT-03-D | Cancel URL preserves locale | Contains `/{locale}/` |
| UT-03-E | No client-supplied URL fragments | URL is fully server-constructed |

### UT-04: Error Response Format

**File:** `test/unit/error-responses.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| UT-04-A | 400 response has error field | `{ error: string }` |
| UT-04-B | 400 response has no stack trace | No `stack` field |
| UT-04-C | 400 response has no internal details | No Stripe error codes/messages |

---

## Static Analysis Checks

These are not test files but must pass as part of the verification:

### SA-01: Build Strictness

| ID | Command | Expected |
|----|---------|----------|
| SA-01-A | `npx tsc --noEmit` | Exit 0, zero errors |
| SA-01-B | `pnpm lint` | Exit 0, zero errors |
| SA-01-C | `pnpm build` | Exit 0, zero errors |

### SA-02: Log Hygiene (grep-based)

| ID | Check | Expected |
|----|-------|----------|
| SA-02-A | `console.log` in `app/[locale]/` client files | Zero matches (excluding server components with structured logging) |
| SA-02-B | `console.log` in `components/` | Zero matches |
| SA-02-C | Token/key/secret patterns in any log statement | Zero matches |

### SA-03: Code Quality

| ID | Check | Expected |
|----|-------|----------|
| SA-03-A | `: any` in `lib/auth-config.ts` | Zero matches |
| SA-03-B | `: any` in `lib/stripe-config.ts` | Zero matches |
| SA-03-C | `: any` in `app/api/stripe/checkout/route.ts` | Zero matches |
| SA-03-D | `: any` in `app/api/auth/` | Zero matches |
| SA-03-E | Merge conflict markers in `README.md` | Zero matches |

### SA-04: Project Metadata

| ID | Check | Expected |
|----|-------|----------|
| SA-04-A | `package.json` name field | `"easiful-web"` |
| SA-04-B | `.gitignore` includes `test-results/` | Present |
| SA-04-C | `.gitignore` includes `playwright-report/` | Present |

---

## Smoke Tests (Manual or E2E)

These validate end-to-end behavior. Implement as Playwright tests if feasible, otherwise document as manual verification.

### ST-01: Landing Page

| ID | Test Case | Expected |
|----|-----------|----------|
| ST-01-A | Navigate to `/es` | Page loads, hero section visible |
| ST-01-B | Navigate to `/en` | Page loads, English content |
| ST-01-C | Download buttons visible | Correct store URLs or graceful fallback |
| ST-01-D | No console errors | Browser console clean |

### ST-02: Auth Flow

| ID | Test Case | Expected |
|----|-----------|----------|
| ST-02-A | Navigate to `/es/login` | Login page renders |
| ST-02-B | No broken links on login page | No `/forgot-password` 404 |
| ST-02-C | Unauthenticated → `/es/dashboard` | Redirects to `/es/login` |

### ST-03: Pricing & Checkout

| ID | Test Case | Expected |
|----|-----------|----------|
| ST-03-A | Navigate to `/es/pricing` | Plans display correctly |
| ST-03-B | Checkout with valid session | Redirects to Stripe |
| ST-03-C | Checkout without session | Returns 401 |

---

## Test Execution

```bash
# Unit tests
pnpm test:unit

# Type check
npx tsc --noEmit

# Lint
pnpm lint

# Build verification
pnpm build

# E2E (requires dev server running)
pnpm dev &
pnpm test
```

---

## Test Results Template

After running tests, fill in:

| Suite | Result | Notes |
|-------|--------|-------|
| Unit tests (`pnpm test:unit`) | ⬜ | |
| Type check (`tsc --noEmit`) | ⬜ | |
| Lint (`pnpm lint`) | ⬜ | |
| Build (`pnpm build`) | ⬜ | |
| Log hygiene (grep) | ⬜ | |
| Code quality (grep) | ⬜ | |
| Smoke tests | ⬜ | |
