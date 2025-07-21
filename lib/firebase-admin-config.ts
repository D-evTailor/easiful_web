/**
 * Firebase Admin SDK Configuration
 * 
 * ✅ CONFIGURADO PARA USAR VARIABLES INDIVIDUALES
 * 
 * Este archivo usa las variables de entorno individuales que ya tienes configuradas:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_PRIVATE_KEY_ID  
 * - FIREBASE_PRIVATE_KEY
 * - FIREBASE_CLIENT_EMAIL
 * - FIREBASE_CLIENT_ID
 * - FIREBASE_CLIENT_X509_CERT_URL
 * 
 * No necesitas agregar variables adicionales a tu .env.local
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;

/**
 * Inicializa la aplicación de Firebase Admin de forma segura
 * Previene múltiples inicializaciones
 */
function initializeAdminApp(): App {
  // Verificar si ya existe una aplicación inicializada
  if (adminApp || getApps().length > 0) {
    return adminApp || getApps()[0];
  }

  try {
    // Obtener las credenciales individuales desde las variables de entorno
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const clientId = process.env.FIREBASE_CLIENT_ID;
    const clientX509CertUrl = process.env.FIREBASE_CLIENT_X509_CERT_URL;

    // Verificar que todas las variables estén presentes
    if (!projectId || !privateKeyId || !privateKey || !clientEmail || !clientId || !clientX509CertUrl) {
      throw new Error(
        "Faltan variables de entorno de Firebase Admin SDK. Verifica que todas estén configuradas en .env.local"
      );
    }

    // Construir el objeto de credenciales con el tipo correcto
    const serviceAccount = {
      type: "service_account" as const,
      project_id: projectId,
      private_key_id: privateKeyId,
      private_key: privateKey.replace(/\\n/g, '\n'), // Reemplazar \\n con saltos de línea reales
      client_email: clientEmail,
      client_id: clientId,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: clientX509CertUrl,
    };

    // Inicializar la aplicación de Firebase Admin
    adminApp = initializeApp({
      credential: cert(serviceAccount as any), // Tipo explícito para evitar conflictos de tipo
      projectId: projectId,
    });

    console.log("Firebase Admin inicializado correctamente con variables individuales");
    console.log("🔍 VERIFICACIÓN SERVIDOR:");
    console.log("Server projectId:", projectId);
    console.log("¿Es 'easifull-1f9e0'?", projectId === "easifull-1f9e0");
    return adminApp;

  } catch (error) {
    console.error("Error al inicializar Firebase Admin:", error);
    throw error;
  }
}

/**
 * Obtiene la instancia de Authentication de Firebase Admin
 * @returns Auth instance
 */
export function getAdminAuth(): Auth {
  const app = initializeAdminApp();
  return getAuth(app);
}

/**
 * Obtiene la aplicación de Firebase Admin
 * @returns App instance
 */
export function getAdminApp(): App {
  return initializeAdminApp();
} 