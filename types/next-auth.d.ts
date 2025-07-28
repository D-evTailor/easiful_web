import 'next-auth';

// Docs on module augmentation: https://next-auth.js.org/getting-started/typescript

// Define the shape of the subscription object
interface Subscription {
  planId: string;
  status: string;
  endDate?: Date; // Or string, depending on what you store
  stripeSubscriptionId?: string;
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's subscription details. */
      subscription: Subscription | null;
    } & DefaultSession['user']; // Keep the default properties
  }

  /**
   * The shape of the user object returned in the JWT and database.
   */
  interface User {
    subscription?: Subscription | null;
  }
} 