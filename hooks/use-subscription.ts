"use client";

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { app } from '@/lib/firebase-config'; // client-side firebase app

// Initialize Stripe.js with your publishable key.
// IMPORTANT: Make sure to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function useSubscription() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const functions = getFunctions(app, 'us-central1'); // Ensure this matches your functions region

    /**
     * Initiates the Stripe checkout process for a given plan.
     * @param priceId The ID of the Stripe Price object for the desired plan.
     */
    const upgradeToPlan = async (priceId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Call the 'createStripeCheckoutSession' cloud function
            const createCheckoutSession = httpsCallable(functions, 'createStripeCheckoutSession');
            const result: any = await createCheckoutSession({
                priceId,
                success_url: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: window.location.href, // Return to the pricing page on cancellation
            });

            const { sessionId } = result.data;
            if (!sessionId) {
                throw new Error("Could not create a checkout session.");
            }
            
            // 2. Redirect the user to the Stripe-hosted checkout page
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe.js has not loaded yet.");
            }

            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

            if (stripeError) {
                setError(stripeError.message || "An unexpected error occurred during checkout.");
            }

        } catch (err: any) {
            console.error("Subscription process failed:", err);
            // We expose a user-friendly message
            setError(err.message || "Failed to start the subscription process.");
        } finally {
            setIsLoading(false);
        }
    };

    return { upgradeToPlan, isLoading, error };
} 