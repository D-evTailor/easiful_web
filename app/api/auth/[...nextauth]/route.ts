import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { adminDb } from "@/lib/firebase-admin";
import { auth } from "@/lib/firebase-config";

// Google Client ID is loaded from environment variables

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
    async jwt({ token, user, account }: { token: any, user: any, account: any }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
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
            } else {
              // Create user document if it doesn't exist
              await userRef.set({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
                createdAt: new Date(),
                subscription: {
                  planId: 'free',
                  status: 'active',
                  startDate: new Date(),
                  endDate: null
                }
              });
              session.user.subscription = {
                planId: 'free',
                status: 'active',
                startDate: new Date(),
                endDate: null
              };
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Don't fail the session if we can't fetch user data
            // Continue with the session without subscription data
          }
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login', // Redirige a la página de login personalizada
    error: '/login', // Redirige errores a la página de login
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 