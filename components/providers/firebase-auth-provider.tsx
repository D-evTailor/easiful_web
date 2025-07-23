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
        console.log(`🔄 FirebaseAuthProvider - Status: ${status}, Session:`, session);
        if (status === "authenticated" && session?.user?.id) {
          // El usuario está autenticado en NextAuth
          console.log("Sincronizando autenticación con Firebase...");
          console.log("Usuario de NextAuth:", session.user.id);

          // Verificar si ya está autenticado en Firebase con el mismo UID
          const currentFirebaseUser = auth.currentUser;
          if (currentFirebaseUser && currentFirebaseUser.uid === session.user.id) {
            console.log("Usuario ya autenticado en Firebase");
            return;
          }

          // Obtener token personalizado desde nuestra API
          console.log("Obteniendo token personalizado...");
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
          console.log("Respuesta de API:", data);

          if (!data.token) {
            throw new Error("No se recibió el token de Firebase");
          }

          // Verificar que Firebase esté configurado correctamente
          if (!auth.app.options.apiKey) {
            throw new Error("Firebase no está configurado correctamente - API Key faltante");
          }

          // Verificar información antes de autenticar
          console.log("🔍 Información del token:");
          console.log("Token length:", data.token.length);
          console.log("Firebase App Name:", auth.app.name);
          console.log("Firebase Project ID:", auth.app.options.projectId);
          
          // Autenticar en Firebase con el token personalizado
          console.log("Autenticando con token personalizado...");
          await signInWithCustomToken(auth, data.token);
          console.log("Usuario autenticado en Firebase correctamente");

        } else if (status === "unauthenticated") {
          // El usuario no está autenticado en NextAuth
          console.log("Cerrando sesión de Firebase...");

          // Cerrar sesión en Firebase también
          if (auth.currentUser) {
            await signOut(auth);
            console.log("Sesión de Firebase cerrada correctamente");
          }
        }
      } catch (error) {
        console.error("Error al sincronizar autenticación con Firebase:", error);
        
        // Si hay un error, intentar cerrar la sesión de Firebase para mantener consistencia
        if (auth.currentUser) {
          try {
            await signOut(auth);
            console.log("Sesión de Firebase cerrada debido a error de sincronización");
          } catch (signOutError) {
            console.error("Error al cerrar sesión de Firebase:", signOutError);
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