"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initiates the Stripe checkout process for a given plan.
   * @param planId Server-side plan identifier ("monthly" | "annual").
   * @param locale Current locale for redirect URLs.
   */
  const upgradeToPlan = async (planId: string, locale = "es") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, locale }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ?? `Checkout failed (${response.status})`
        );
      }

      const { sessionId } = await response.json();
      if (!sessionId) {
        throw new Error("Could not create a checkout session.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Payment system not ready. Please reload the page.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        setError(stripeError.message ?? "An unexpected error occurred.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start checkout.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { upgradeToPlan, isLoading, error };
}
