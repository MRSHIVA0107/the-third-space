import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getRegistrations } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // 1. Authenticate admin
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  // 2. Query parameters
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));

  try {
    const result = await getRegistrations({ page, limit, search });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/admin/registrations] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve registrations." },
      { status: 500 }
    );
  }
}
