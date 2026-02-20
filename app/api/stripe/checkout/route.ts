import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import {
  isValidPlanId,
  isValidLocale,
  resolveStripePriceId,
  buildCheckoutUrls,
} from "@/lib/stripe-config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { planId, locale } = body as Record<string, unknown>;

    if (typeof planId !== "string" || !isValidPlanId(planId)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const resolvedLocale =
      typeof locale === "string" && isValidLocale(locale) ? locale : "es";

    const stripePriceId = resolveStripePriceId(planId);
    if (!stripePriceId) {
      return NextResponse.json(
        { error: "Plan configuration error" },
        { status: 500 }
      );
    }

    const { successUrl, cancelUrl } = buildCheckoutUrls(resolvedLocale);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      client_reference_id: session.user.id,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { firebaseUID: session.user.id },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error(
      "[checkout] Failed to create session:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
