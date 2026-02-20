import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isValidPlanId,
  isValidLocale,
  resolveStripePriceId,
  buildCheckoutUrls,
} from "@/lib/stripe-config";

describe("stripe-config — plan validation (RF-01)", () => {
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
  const ORIGINAL_ENV = process.env;

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
});
