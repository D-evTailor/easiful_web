import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Server-side Firebase configuration for NextAuth
const adminFirebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize a specific app for admin operations to avoid conflicts
const adminApp = !getApps().some(app => app.name === 'admin-auth') 
  ? initializeApp(adminFirebaseConfig, 'admin-auth') 
  : getApp('admin-auth');
const adminAuth = getAuth(adminApp);

// Log the Google Client ID to ensure it's loaded correctly on the server
console.log("SERVER: Using Google Client ID:", process.env.GOOGLE_CLIENT_ID);


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials.password) {
          return null
        }
        try {
          const userCredential = await signInWithEmailAndPassword(
            adminAuth, // Use the dedicated admin auth instance
            credentials.email,
            credentials.password
          );
          
          if (userCredential.user) {
            // Devolvemos el objeto de usuario que NextAuth usará para la sesión
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL,
            };
          }
          return null;
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          // Devolvemos null para indicar un fallo en la autorización
          // NextAuth devolverá un error genérico al cliente
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Estos callbacks son útiles para enriquecer el token y la sesión
    // con datos adicionales del usuario que vienen de Firebase.
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirige a la página de login personalizada
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 