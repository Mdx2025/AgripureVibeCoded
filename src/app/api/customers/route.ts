import { NextResponse } from "next/server";
import { listCustomers } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ customers: listCustomers() });
}
