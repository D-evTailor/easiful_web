import "next-auth";
import "next-auth/jwt";

interface Subscription {
  planId: string;
  status: string;
  endDate?: Date;
  stripeSubscriptionId?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscription: Subscription | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    subscription?: Subscription | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    picture?: string | null;
  }
}
