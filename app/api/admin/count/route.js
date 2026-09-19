import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getRegistrationCount } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const count = await getRegistrationCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("[api/admin/count] Error:", error);
    return NextResponse.json({ error: "Failed to retrieve count." }, { status: 500 });
  }
}
