/**
 * Firebase Admin SDK Configuration
 *
 * Required environment variables:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_PRIVATE_KEY
 * - FIREBASE_CLIENT_EMAIL
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;

function initializeAdminApp(): App {
  if (adminApp || getApps().length > 0) {
    return adminApp || getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      "Missing required Firebase Admin env vars (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)"
    );
  }

  try {
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      projectId,
    });

    return adminApp;
  } catch (error) {
    console.error(
      "[firebase-admin] Initialization failed:",
      error instanceof Error ? error.message : "Unknown"
    );
    throw error;
  }
}

export function getAdminAuth(): Auth {
  return getAuth(initializeAdminApp());
}

export function getAdminApp(): App {
  return initializeAdminApp();
}
