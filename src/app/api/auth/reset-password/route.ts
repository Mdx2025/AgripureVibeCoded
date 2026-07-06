import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyPasswordResetToken, consumePasswordResetToken } from "@/lib/repo";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const token = body.token as string | undefined;
  const newPassword = body.newPassword as string | undefined;
  const confirmNewPassword = body.confirmNewPassword as string | undefined;

  if (!token || !newPassword || !confirmNewPassword) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "All fields are required" },
      { status: 400 },
    );
  }

  if (newPassword !== confirmNewPassword) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "Passwords do not match" },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { status: "error", code: "VALIDATION_ERROR", message: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const result = await verifyPasswordResetToken(token);
  if (!result) {
    return NextResponse.json(
      { status: "error", code: "INVALID_RESET_TOKEN", message: "Invalid or expired reset link" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await query(`UPDATE admins SET password_hash = $1 WHERE lower(email) = lower($2)`, [
    passwordHash,
    result.email,
  ]);
  await consumePasswordResetToken(token);

  return NextResponse.json({ status: "ok" });
}
