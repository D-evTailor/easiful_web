import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for the checkout API route validation logic (RF-06).
 *
 * We test the route handler by importing it directly and calling POST()
 * with mocked NextRequest objects and mocked dependencies.
 */

// Mock next-auth before importing the route
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

// Mock stripe
vi.mock("stripe", () => {
  return {
    default: class MockStripe {
      checkout = {
        sessions: {
          create: vi.fn().mockResolvedValue({ id: "cs_test_123" }),
        },
      };
    },
  };
});

// Mock auth config
vi.mock("@/lib/auth-config", () => ({
  authOptions: {},
}));

// Provide env vars needed by the route (runs before imports aren't hoisted, but before tests)

import { getServerSession } from "next-auth/next";
import { POST } from "@/app/api/stripe/checkout/route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const mockedGetSession = vi.mocked(getServerSession);

describe("POST /api/stripe/checkout (RF-06)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXTAUTH_URL", "https://easiful.com");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
    vi.stubEnv("STRIPE_PRICE_MONTHLY", "price_test_monthly");
    vi.stubEnv("STRIPE_PRICE_ANNUAL", "price_test_annual");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects unauthenticated requests with 401", async () => {
    mockedGetSession.mockResolvedValue(null);

    const res = await POST(makeRequest({ planId: "monthly" }) as never);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Authentication required");
    expect(data).not.toHaveProperty("details");
  });

  it("rejects invalid planId with 400", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(
      makeRequest({ planId: "price_1Rj4q9PY7RDrzGXCxZ4Afq9k" }) as never
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid plan selected");
  });

  it("rejects empty body with 400", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({}) as never);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid plan selected");
  });

  it("rejects empty string planId with 400 (UT-01-E)", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: "" }) as never);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid plan selected");
  });

  it("rejects numeric planId with 400 (UT-01-F)", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: 123 }) as never);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid plan selected");
  });

  it("rejects SQL injection in planId with 400", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(
      makeRequest({ planId: "'; DROP TABLE users; --" }) as never
    );

    expect(res.status).toBe(400);
  });

  it("accepts valid monthly plan and returns sessionId", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(
      makeRequest({ planId: "monthly", locale: "es" }) as never
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.sessionId).toBe("cs_test_123");
    expect(data).not.toHaveProperty("error");
  });

  it("accepts valid annual plan", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(
      makeRequest({ planId: "annual", locale: "en" }) as never
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.sessionId).toBe("cs_test_123");
  });

  it("defaults to 'es' locale when locale is invalid", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(
      makeRequest({ planId: "monthly", locale: "fr" }) as never
    );

    expect(res.status).toBe(200);
  });

  it("never leaks error details in responses", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: "monthly" }) as never);
    const data = await res.json();

    expect(data).not.toHaveProperty("details");
    expect(data).not.toHaveProperty("stack");
  });

  it("400 response has error field (UT-04-A)", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: "hacked" }) as never);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(typeof data.error).toBe("string");
  });

  it("400 response has no stack trace (UT-04-B)", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: "hacked" }) as never);
    const data = await res.json();

    expect(data).not.toHaveProperty("stack");
    expect(JSON.stringify(data)).not.toContain("at ");
  });

  it("400 response has no internal Stripe details (UT-04-C)", async () => {
    mockedGetSession.mockResolvedValue({
      user: { id: "uid123", email: "test@test.com" },
      expires: "",
    });

    const res = await POST(makeRequest({ planId: "hacked" }) as never);
    const data = await res.json();
    const body = JSON.stringify(data);

    expect(body).not.toContain("stripe");
    expect(body).not.toContain("price_");
    expect(body).not.toContain("sk_");
    expect(data).not.toHaveProperty("code");
    expect(data).not.toHaveProperty("type");
  });
});
