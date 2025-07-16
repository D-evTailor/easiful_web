import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

// Firebase Admin SDK configuration for server-side operations
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
};

// Initialize Firebase Admin only if credentials are available
let adminApp: any;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    adminApp = !getApps().length 
      ? initializeApp(firebaseAdminConfig) 
      : getApps()[0];
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
  } else {
    console.warn("Firebase Admin credentials not found. Admin features will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export { adminApp, adminAuth, adminDb }; 