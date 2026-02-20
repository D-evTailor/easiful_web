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
