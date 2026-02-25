/**
 * Centralized Stripe configuration.
 * All allowed plans and redirect domain validation live here.
 * The client never sees raw Stripe price IDs.
 */

export type PlanId = "monthly" | "annual";

interface PlanConfig {
  name: string;
  envVar: string;
}

const PLANS: Record<PlanId, PlanConfig> = {
  monthly: {
    name: "Premium Monthly",
    envVar: "STRIPE_PRICE_MONTHLY",
  },
  annual: {
    name: "Premium Annual",
    envVar: "STRIPE_PRICE_ANNUAL",
  },
};

const ALLOWED_LOCALES = ["es", "en"] as const;
export type AllowedLocale = (typeof ALLOWED_LOCALES)[number];

/** Resolve a client-facing planId to the internal Stripe priceId. Returns undefined if invalid or unconfigured. */
export function resolveStripePriceId(planId: string): string | undefined {
  const plan = (PLANS as Record<string, PlanConfig>)[planId];
  if (!plan) return undefined;
  const priceId = process.env[plan.envVar];
  return priceId || undefined;
}

export function isValidPlanId(planId: string): planId is PlanId {
  return planId in PLANS;
}

export function isValidLocale(locale: string): locale is AllowedLocale {
  return (ALLOWED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Build trusted redirect URLs for Stripe checkout.
 * Uses NEXTAUTH_URL as the canonical app origin; falls back to NEXT_PUBLIC_APP_URL.
 */
export function buildCheckoutUrls(locale: AllowedLocale): {
  successUrl: string;
  cancelUrl: string;
} {
  const baseUrl = (
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    ""
  ).replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("Missing NEXTAUTH_URL or NEXT_PUBLIC_APP_URL for checkout redirect URLs");
  }

  return {
    successUrl: `${baseUrl}/${locale}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}/${locale}/pricing`,
  };
}
