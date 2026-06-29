import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { getAdminByEmail } from "./lib/repo";

// Full Auth.js instance (Node runtime) — the Credentials provider hits Postgres
// + bcrypt, so this must NOT be imported by the edge middleware.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        const admin = await getAdminByEmail(email);
        if (!admin?.password_hash) return null;
        if (admin.status && admin.status.toLowerCase() === "disabled") return null;
        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return null;
        return { id: admin.id, email: admin.email, name: admin.name ?? admin.email, role: admin.role ?? "admin" };
      },
    }),
  ],
});

export type AdminRole = "superadmin" | "admin";

/** Server-side guard for admin API route handlers. Returns the session user or null. */
export async function getAdminUser(): Promise<{ id: string; email: string; role: string } | null> {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; role?: string } | undefined;
  if (!user?.email) return null;
  return { id: user.id ?? "", email: user.email, role: user.role ?? "admin" };
}

/** True when the current admin has at least the given role (superadmin ⊇ admin). */
export async function hasRole(min: AdminRole): Promise<boolean> {
  const u = await getAdminUser();
  if (!u) return false;
  if (min === "admin") return true;
  return u.role === "superadmin";
}
