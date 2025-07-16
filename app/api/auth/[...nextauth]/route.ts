import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { adminDb } from "@/lib/firebase-admin";
import { auth } from "@/lib/firebase-config";

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
            auth, // Use the client-side auth for credentials
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
      if (session?.user && token?.id) {
        session.user.id = token.id;
        
        // Only try to fetch user data if Firebase Admin is available
        if (adminDb) {
          try {
            const userRef = adminDb.collection("users").doc(token.id as string);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              // Attach subscription data to the session user object
              session.user.subscription = userData?.subscription || null;
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Don't fail the session if we can't fetch user data
          }
        }
      }
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