"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cream/70 hover:text-cream bg-cream/10 hover:bg-cream/15 rounded-sm transition-colors disabled:opacity-50"
      title="Sign out of Admin Portal"
    >
      <LogOut size={13} />
      <span>{loading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
