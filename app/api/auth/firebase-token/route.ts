import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { getAdminAuth } from "@/lib/firebase-admin-config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const adminAuth = getAdminAuth();
    const customToken = await adminAuth.createCustomToken(session.user.id);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error(
      "[firebase-token] Token creation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
