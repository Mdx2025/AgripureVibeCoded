import { NextResponse } from "next/server";
import { getAdminByEmail, createPasswordResetToken } from "@/lib/repo";
import { sendEmail } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "Email is required" },
      { status: 400 },
    );
  }

  const ok = NextResponse.json({ status: "ok" });

  const admin = await getAdminByEmail(email.trim().toLowerCase());
  if (!admin) return ok;

  const token = await createPasswordResetToken(admin.email);
  const dashboardUrl =
    process.env.DASHBOARD_URL || "https://agripure-dashboard.apps.mdxpreview.xyz";
  const resetUrl = `${dashboardUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: admin.email,
    subject: "Reset your AgriPure password",
    html: [
      `<p>Hi ${admin.name ?? "there"},</p>`,
      `<p>We received a request to reset your password.</p>`,
      `<p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a></p>`,
      `<p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`,
      `<p>— AgriPure</p>`,
    ].join(""),
  });

  return ok;
}
