import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/**
 * API Route temporal para crear sesiones de Stripe Checkout
 * Actúa como proxy para evitar problemas de CORS con Firebase Functions
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🛍️ API route /api/stripe/checkout llamada");
    
    // Obtener la sesión del servidor
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      console.log("❌ Usuario no autenticado");
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    // Obtener los datos de la request
    const { priceId, success_url, cancel_url } = await request.json();
    
    if (!priceId || !success_url || !cancel_url) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: priceId, success_url, cancel_url" },
        { status: 400 }
      );
    }

    console.log("📋 Datos recibidos:", { priceId, success_url, cancel_url });

    // Crear la sesión de Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      client_reference_id: session.user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
      metadata: {
        firebaseUID: session.user.id,
      },
    });

    console.log("✅ Sesión de checkout creada:", checkoutSession.id);

    return NextResponse.json({ sessionId: checkoutSession.id });

  } catch (error) {
    console.error("❌ Error en API route:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: "Failed to create checkout session",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
} 