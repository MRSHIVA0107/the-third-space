import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // 1. Authenticate requester
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Authorize admin
  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Query count
  const adminSupabase = createAdminClient();
  const { count, error } = await adminSupabase
    .from("registrations")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ error: "Failed to retrieve count." }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
