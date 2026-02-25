import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isValidPlanId,
  isValidLocale,
  resolveStripePriceId,
  buildCheckoutUrls,
} from "@/lib/stripe-config";

describe("stripe-config — plan validation (RF-01)", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_PRICE_MONTHLY", "price_test_monthly");
    vi.stubEnv("STRIPE_PRICE_ANNUAL", "price_test_annual");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts valid plan IDs", () => {
    expect(isValidPlanId("monthly")).toBe(true);
    expect(isValidPlanId("annual")).toBe(true);
  });

  it("rejects arbitrary / unknown plan IDs", () => {
    expect(isValidPlanId("free")).toBe(false);
    expect(isValidPlanId("price_1Rj4q9PY7RDrzGXCxZ4Afq9k")).toBe(false);
    expect(isValidPlanId("")).toBe(false);
    expect(isValidPlanId("hackerplan")).toBe(false);
    expect(isValidPlanId("monthly; DROP TABLE users")).toBe(false);
  });

  it("resolves valid planId to a Stripe price ID", () => {
    const monthlyPrice = resolveStripePriceId("monthly");
    expect(monthlyPrice).toBeDefined();
    expect(monthlyPrice).toMatch(/^price_/);

    const annualPrice = resolveStripePriceId("annual");
    expect(annualPrice).toBeDefined();
    expect(annualPrice).toMatch(/^price_/);
  });

  it("returns undefined for invalid planId", () => {
    expect(resolveStripePriceId("free")).toBeUndefined();
    expect(resolveStripePriceId("arbitrary")).toBeUndefined();
    expect(resolveStripePriceId("")).toBeUndefined();
  });

  it("returns undefined when env var is not configured", () => {
    vi.stubEnv("STRIPE_PRICE_MONTHLY", "");
    expect(resolveStripePriceId("monthly")).toBeUndefined();
  });

  it("only accepts 'monthly' and 'annual' as valid plans (UT-02-C)", () => {
    const validPlans = ["monthly", "annual"];
    const testIds = [
      "monthly", "annual", "free", "premium", "enterprise",
      "weekly", "lifetime", "", "null", "undefined",
    ];

    for (const id of testIds) {
      if (validPlans.includes(id)) {
        expect(isValidPlanId(id)).toBe(true);
      } else {
        expect(isValidPlanId(id)).toBe(false);
      }
    }
  });

  it("all valid plans resolve to non-empty price IDs (UT-02-D)", () => {
    const monthlyPrice = resolveStripePriceId("monthly");
    const annualPrice = resolveStripePriceId("annual");

    expect(monthlyPrice).toBeTruthy();
    expect(typeof monthlyPrice).toBe("string");
    expect(annualPrice).toBeTruthy();
    expect(typeof annualPrice).toBe("string");
  });
});

describe("stripe-config — locale validation (RF-01)", () => {
  it("accepts allowed locales", () => {
    expect(isValidLocale("es")).toBe(true);
    expect(isValidLocale("en")).toBe(true);
  });

  it("rejects invalid locales", () => {
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("javascript:alert(1)")).toBe(false);
  });
});

describe("stripe-config — URL construction (RF-01)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_URL", "https://easiful.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds success/cancel URLs from trusted base", () => {
    const urls = buildCheckoutUrls("es");
    expect(urls.successUrl).toBe(
      "https://easiful.com/es/dashboard?session_id={CHECKOUT_SESSION_ID}"
    );
    expect(urls.cancelUrl).toBe("https://easiful.com/es/pricing");
  });

  it("respects locale in redirect URLs", () => {
    const urls = buildCheckoutUrls("en");
    expect(urls.successUrl).toContain("/en/dashboard");
    expect(urls.cancelUrl).toContain("/en/pricing");
  });

  it("strips trailing slashes from base URL", () => {
    vi.stubEnv("NEXTAUTH_URL", "https://easiful.com/");
    const urls = buildCheckoutUrls("es");
    expect(urls.successUrl).toMatch(/^https:\/\/easiful\.com\/es\//);
    expect(urls.successUrl).not.toContain("//es/");
  });

  it("throws when no base URL is configured", () => {
    vi.stubEnv("NEXTAUTH_URL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    expect(() => buildCheckoutUrls("es")).toThrow();
  });

  it("URLs are fully server-constructed with no client input (UT-03-E)", () => {
    const urls = buildCheckoutUrls("es");

    // URLs only contain the server-configured base + hardcoded paths
    expect(urls.successUrl).toBe(
      "https://easiful.com/es/dashboard?session_id={CHECKOUT_SESSION_ID}"
    );
    expect(urls.cancelUrl).toBe("https://easiful.com/es/pricing");

    // No way to inject external URLs — function only accepts AllowedLocale type
    // and constructs paths from constants
    expect(urls.successUrl).toMatch(/^https:\/\/easiful\.com\//);
    expect(urls.cancelUrl).toMatch(/^https:\/\/easiful\.com\//);
  });
});
