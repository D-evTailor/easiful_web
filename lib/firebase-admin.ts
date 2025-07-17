import admin from 'firebase-admin';
import { serviceAccount } from '@/lib/env';

// Initialize Firebase Admin only if credentials are available
if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    // Don't throw here, just log the error
  }
} else if (!serviceAccount) {
  console.warn("Firebase Admin credentials not found. Admin features will be disabled.");
}

// Export admin instances (will be undefined if not initialized)
export const adminAuth = admin.apps.length ? admin.auth() : undefined;
export const adminDb = admin.apps.length ? admin.firestore() : undefined;
export const adminApp = admin.apps.length ? admin.app() : undefined; 