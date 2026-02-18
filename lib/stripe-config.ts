/**
 * Centralized Stripe configuration.
 * All allowed plans and redirect domain validation live here.
 * The client never sees raw Stripe price IDs.
 */

export type PlanId = "monthly" | "annual";

interface PlanConfig {
  stripePriceId: string;
  name: string;
}

const PLANS: Record<PlanId, PlanConfig> = {
  monthly: {
    stripePriceId: process.env.STRIPE_PRICE_MONTHLY ?? "price_1Rj4q9PY7RDrzGXCxZ4Afq9k",
    name: "Premium Monthly",
  },
  annual: {
    stripePriceId: process.env.STRIPE_PRICE_ANNUAL ?? "price_1RlvTkPY7RDrzGXCZAX3wkJg",
    name: "Premium Annual",
  },
};

const ALLOWED_LOCALES = ["es", "en"] as const;
export type AllowedLocale = (typeof ALLOWED_LOCALES)[number];

/** Resolve a client-facing planId to the internal Stripe priceId. Returns undefined if invalid. */
export function resolveStripePriceId(planId: string): string | undefined {
  return (PLANS as Record<string, PlanConfig>)[planId]?.stripePriceId;
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
