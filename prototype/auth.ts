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

// LOCAL TEST ONLY dev accounts (plaintext passwords — local prototype only,
// never use in production).
const DEV_USERS: { id: string; name: string; username: string; password: string; role: AppRole }[] = [
  { id: "dev-admin", name: "Admin", username: "user", password: "password", role: "QUBATORS_ADMIN" },
  { id: "dev-customer", name: "Dev Customer", username: "customer", password: "customer", role: "CUSTOMER" },
  { id: "dev-consultant", name: "Dev Consultant", username: "consultant", password: "consultant", role: "CONSULTANT" },
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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = String(credentials?.username ?? "").toLowerCase();
        const password = String(credentials?.password ?? "");
        const found = DEV_USERS.find((u) => u.username === username && u.password === password);
        if (!found) return null;
        return { id: found.id, name: found.name, email: `${found.username}@local`, role: found.role };
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
