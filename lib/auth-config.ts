import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase-admin-config";
import { auth } from "@/lib/firebase-config";

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
          return null;
        }
        try {
          // --- NUEVA VALIDACIÓN ---
          // 1. Verificar si el usuario existe en Firebase Auth ANTES de intentar el login.
          const adminAuth = getAdminAuth(getAdminApp());
          let existingUser;
          try {
            existingUser = await adminAuth.getUserByEmail(credentials.email);
          } catch (error: any) {
            // "auth/user-not-found" es el error esperado si no existe.
            if (error.code === 'auth/user-not-found') {
              
              // Devolvemos un error personalizado que la UI podrá interpretar.
              throw new Error("USER_NOT_FOUND");
            }
            // Re-lanzar otros errores inesperados
            throw error;
          }

          // 2. Si el usuario existe, proceder con el inicio de sesión.
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          if (userCredential.user) {
            
            // CRÍTICO: Verificar que el UID coincide con el existente
            if (userCredential.user.uid !== existingUser.uid) {
              console.error(`🚨 UID MISMATCH! Expected: ${existingUser.uid}, Got: ${userCredential.user.uid}`);
              throw new Error("UID_MISMATCH");
            }
            
            return {
              id: userCredential.user.uid, // Usar el UID existente
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL,
            };
          }
          return null;
        } catch (error: any) {
        console.error("Firebase/NextAuth Auth Error:", error.message);
          // Pasamos el mensaje de error para que la UI pueda manejarlo.
          if (error.message === "USER_NOT_FOUND") {
            throw new Error("USER_NOT_FOUND");
          }
          throw new Error("INVALID_CREDENTIALS");
        }
      },
    }),
  ],
  // CRÍTICO: Configuraciones para prevenir creación automática de usuarios
  events: {},
  // Configuración de sesión
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any, user: any, account: any }) {
      if (user) {
        token.id = user.id;
        // Ensure we persist provider profile data (e.g., Google photo)
        if (user.image || (user as any).picture) {
          token.picture = user.image ?? (user as any).picture;
        }
        if (user.name) {
          token.name = user.name;
        }
        
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
        // Propagate picture/name from token into session for UI avatar
        session.user.image = token.picture ?? session.user.image ?? null;
        if (token.name) {
          session.user.name = token.name;
        }
        
        
        try {
          const adminApp = getAdminApp();
          const adminDb = getFirestore(adminApp);
          const userRef = adminDb.collection("users").doc(token.id as string);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            // Adjuntar datos de suscripción a la sesión.
            session.user.subscription = userData?.subscription || null;
          } else {
            // --- LÓGICA DE CREACIÓN ELIMINADA ---
            // Si el documento no existe, es un error de sincronización, pero no creamos uno nuevo.
            // El documento DEBE ser creado por la app móvil.
            console.warn(`Usuario ${token.id} autenticado pero sin documento en Firestore.`);
            session.user.subscription = null; // No hay suscripción si no hay documento.
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          session.user.subscription = null;
        }
      }
      return session;
    },
    async signIn({ user, account }: { user: any, account: any }) {
      // Para proveedores OAuth como Google.
      if (account?.provider === "google") {
        try {
          const adminAuth = getAdminAuth(getAdminApp());
          // Verificar si el usuario de Google existe en Firebase Auth.
          // Si no existe, bloqueamos el inicio de sesión.
          const existingUser = await adminAuth.getUserByEmail(user.email);
          // CRÍTICO: Asegurar que el ID que usamos es el UID existente
          user.id = existingUser.uid;
          
          return true; // Permitir inicio de sesión.
        } catch (error: any) {
          
          if (error.code === 'auth/user-not-found') {
            // Bloquear el login completamente - NextAuth manejará el error
            return false;
          }
          return false; // Bloquear por otros errores.
        }
      }
      
      // Para el proveedor de credenciales, ya se verificó en authorize()
      return true;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Mantener la lógica, sin logs ruidosos
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/es/login',
    // Redirigir todos los errores a la página de login para mostrar mensajes.
    error: '/es/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
}; 