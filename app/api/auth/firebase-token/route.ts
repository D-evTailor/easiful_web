import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { getAdminAuth } from "@/lib/firebase-admin-config";

/**
 * API Route para generar tokens personalizados de Firebase
 * Sincroniza la autenticación de NextAuth con Firebase Auth
 */
export async function GET(request: NextRequest) {
  try {
    
    // Obtener la sesión del servidor
    const session = await getServerSession(authOptions);
    

    // Verificar que el usuario esté autenticado
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    // Obtener el UID de Firebase (user.id en NextAuth)
    const firebaseUid = session.user.id;

    // Crear token personalizado usando Firebase Admin
    const adminAuth = getAdminAuth();
    
    const customToken = await adminAuth.createCustomToken(firebaseUid);
    return NextResponse.json({ token: customToken });

  } catch (error) {
    console.error("❌ Error creating Firebase custom token:", error);
    
    // Proporcionar más detalles del error
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        error: "Failed to create Firebase token",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
} 