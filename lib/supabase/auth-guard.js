import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const email = user.email?.toLowerCase() || "";
  const isMasterAdmin =
    email === "rikchi940@gmail.com" ||
    email.startsWith("257y5a6615") ||
    user.user_metadata?.role === "admin";

  let adminProfile = null;
  try {
    const { data } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    adminProfile = data;
  } catch {
    // Falls back to auth checks
  }

  if (!adminProfile && !isMasterAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return {
    user,
    adminProfile: adminProfile || { role: "admin" },
    supabase,
  };
}
