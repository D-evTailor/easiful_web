import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase-admin-config";
import { auth } from "@/lib/firebase-config";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const adminAuth = getAdminAuth(getAdminApp());
          let existingUser;
          try {
            existingUser = await adminAuth.getUserByEmail(credentials.email);
          } catch (error: unknown) {
            const fbError = error as { code?: string };
            if (fbError.code === "auth/user-not-found") {
              throw new Error("USER_NOT_FOUND");
            }
            throw error;
          }

          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          if (userCredential.user) {
            if (userCredential.user.uid !== existingUser.uid) {
              console.error("[auth] UID mismatch during credentials login");
              throw new Error("UID_MISMATCH");
            }

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL,
            };
          }
          return null;
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : "Unknown";
          console.error("[auth] Credentials login failed:", msg);
          if (msg === "USER_NOT_FOUND") {
            throw new Error("USER_NOT_FOUND");
          }
          throw new Error("INVALID_CREDENTIALS");
        }
      },
    }),
  ],
  events: {},
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (user.image) {
          token.picture = user.image;
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
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
        session.user.image = (token.picture as string) ?? session.user.image ?? null;
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
            session.user.subscription = userData?.subscription || null;
          } else {
            console.warn("[auth] Authenticated user has no Firestore document");
            session.user.subscription = null;
          }
        } catch (error) {
          console.error(
            "[auth] Failed to fetch user subscription:",
            error instanceof Error ? error.message : "Unknown"
          );
          session.user.subscription = null;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const adminAuth = getAdminAuth(getAdminApp());
          const existingUser = await adminAuth.getUserByEmail(user.email!);
          user.id = existingUser.uid;
          return true;
        } catch (error: unknown) {
          const fbError = error as { code?: string };
          console.error("[auth] Google sign-in lookup failed:", {
            code: fbError.code,
          });
          return false;
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};
