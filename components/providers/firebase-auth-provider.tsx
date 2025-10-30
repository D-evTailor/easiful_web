"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Proveedor que sincroniza la autenticación de NextAuth con Firebase Auth
 * Mantiene ambas sesiones sincronizadas automáticamente
 */
export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncFirebaseAuth = async () => {
      try {
        console.log(`[firebase-auth] status=${status} uid=${session?.user?.id ?? 'none'}`)
        if (status === "authenticated" && session?.user?.id) {
          // El usuario está autenticado en NextAuth
          
          // Verificar si ya está autenticado en Firebase con el mismo UID
          const currentFirebaseUser = auth.currentUser;
          if (currentFirebaseUser && currentFirebaseUser.uid === session.user.id) {
            return;
          }

          // Obtener token personalizado desde nuestra API
          const response = await fetch("/api/auth/firebase-token", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          const data = await response.json();

          if (!data.token) {
            throw new Error("No se recibió el token de Firebase");
          }

          // Verificar que Firebase esté configurado correctamente
          if (!auth.app.options.apiKey) {
            throw new Error("Firebase no está configurado correctamente - API Key faltante");
          }

          // Autenticar en Firebase con el token personalizado
          await signInWithCustomToken(auth, data.token);

        } else if (status === "unauthenticated") {
          // El usuario no está autenticado en NextAuth
          
          // Cerrar sesión en Firebase también
          if (auth.currentUser) {
            await signOut(auth);
          }
        }
      } catch (error) {
        console.error("[firebase-auth:error]", error);
        
        // Si hay un error, intentar cerrar la sesión de Firebase para mantener consistencia
        if (auth.currentUser) {
          try {
            await signOut(auth);
          } catch (signOutError) {
            console.error("[firebase-auth:signout-error]", signOutError);
          }
        }
      }
    };

    // Solo ejecutar cuando el status no sea "loading"
    if (status !== "loading") {
      syncFirebaseAuth();
    }
  }, [session, status]);

  // Renderizar los children sin modificaciones
  return <>{children}</>;
} 