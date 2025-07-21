"use client";

import { SessionProvider } from "next-auth/react";
import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <FirebaseAuthProvider>
        {children}
      </FirebaseAuthProvider>
    </SessionProvider>
  );
} 