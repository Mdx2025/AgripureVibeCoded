import type { NextAuthConfig } from "next-auth";

// Edge-safe Auth.js config (NO database / bcrypt imports) — imported by the
// middleware so it can read/verify the JWT session at the edge. The actual
// credential check (DB + bcrypt) lives in auth.ts, which runs in Node.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/sign-in" },
  providers: [], // real Credentials provider is added in auth.ts
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) ?? "admin";
        (session.user as { id?: string }).id = (token.uid as string) ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
