import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debugging: Verificar configuración del cliente
console.log("Firebase Client Config:", {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : "MISSING",
  authDomain: firebaseConfig.authDomain || "MISSING",
  projectId: firebaseConfig.projectId || "MISSING",
  storageBucket: firebaseConfig.storageBucket || "MISSING",
  messagingSenderId: firebaseConfig.messagingSenderId || "MISSING",
  appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : "MISSING",
});

// ⚠️ VERIFICACIÓN CRÍTICA: ¿Coincide el projectId?
console.log("🔍 VERIFICACIÓN CRÍTICA:");
console.log("Client projectId:", firebaseConfig.projectId);
console.log("¿Es 'easifull-1f9e0'?", firebaseConfig.projectId === "easifull-1f9e0");

// Verificar que todas las variables estén presentes
const missingVars = [];
if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.authDomain) missingVars.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
if (!firebaseConfig.projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!firebaseConfig.storageBucket) missingVars.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
if (!firebaseConfig.messagingSenderId) missingVars.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
if (!firebaseConfig.appId) missingVars.push("NEXT_PUBLIC_FIREBASE_APP_ID");

if (missingVars.length > 0) {
  console.error("Variables de entorno faltantes:", missingVars);
  throw new Error(`Firebase configuration incomplete. Missing: ${missingVars.join(", ")}`);
}

// This config is intended for CLIENT-SIDE use.
// Server-side auth in NextAuth will use a separate initialization.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

console.log("Firebase Client inicializado correctamente");

export { app, auth }; 