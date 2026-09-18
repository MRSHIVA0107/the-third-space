"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Invalid admin credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Successfully authenticated
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setErrorMsg("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full bg-cream-100 border border-sand rounded-sm p-8 sm:p-10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3 text-forest">
            <Shield size={24} />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-forest/70">
            Internal Access
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-ink mt-1">
            Admin Portal
          </h1>
          <p className="text-xs text-muted mt-1">
            Sign in with your Admin email or student ID
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-maroon/10 border border-maroon/20 text-maroon text-xs rounded-sm flex items-start gap-2.5">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Admin Email or ID
            </label>
            <input
              id="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="rikchi940@gmail.com or 257Y5A6615"
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-forest text-cream font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-forest/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-sand/50 text-center">
          <Link
            href="/"
            className="text-xs text-muted hover:text-forest transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
