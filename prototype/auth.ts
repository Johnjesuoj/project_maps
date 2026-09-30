import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export type AppRole = "CUSTOMER" | "QUBATORS_ADMIN" | "CONSULTANT";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: AppRole;
    };
  }
  interface User {
    role: AppRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AppRole;
  }
}

// LOCAL TEST ONLY dev accounts (no password checks — local prototype only).
// Google OAuth activates when AUTH_GOOGLE_ID/SECRET are set.
const DEV_USERS: { id: string; name: string; email: string; role: AppRole }[] = [
  { id: "dev-customer", name: "Dev Customer", email: "customer@local", role: "CUSTOMER" },
  { id: "dev-consultant", name: "Dev Consultant", email: "consultant@local", role: "CONSULTANT" },
  { id: "dev-admin", name: "Dev Admin", email: "admin@local", role: "QUBATORS_ADMIN" },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
      : []),
    Credentials({
      id: "dev-login",
      name: "Local dev login",
      credentials: {
        username: { label: "Username (customer, consultant, admin)", type: "text" },
      },
      authorize: async (credentials) => {
        const map: Record<string, (typeof DEV_USERS)[number]> = {
          customer: DEV_USERS[0],
          consultant: DEV_USERS[1],
          admin: DEV_USERS[2],
        };
        const found = map[String(credentials?.username ?? "").toLowerCase()];
        return found ?? null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.role) token.role = user.role as AppRole;
      token.role ??= "CUSTOMER";
      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = (token.role as AppRole) ?? "CUSTOMER";
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
