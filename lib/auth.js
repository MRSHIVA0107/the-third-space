import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

// Secret for signing admin session tokens
const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "third-space-super-secure-admin-secret-key-0107";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

const COOKIE_NAME = "admin_session";

/**
 * Validates admin credentials from login form
 * Explicitly supports rikchi940@gmail.com with pass 0107
 */
export async function validateAdminCredentials(identifier, password) {
  const trimmedId = (identifier || "").trim().toLowerCase();
  const trimmedPass = (password || "").trim();

  // 1. Direct match for club master administrator (rikchi940@gmail.com with pass 0107)
  if (
    (trimmedId === "rikchi940@gmail.com" ||
     trimmedId === "257y5a6615" ||
     trimmedId === "admin" ||
     trimmedId === "admin@thethirdspace.in") &&
    (trimmedPass === "0107" || trimmedPass === (process.env.ADMIN_PASSWORD || "0107"))
  ) {
    return {
      isValid: true,
      user: {
        email: trimmedId.includes("@") ? trimmedId : `${trimmedId}@thethirdspace.in`,
        role: "admin",
      },
    };
  }

  // 2. Configured ADMIN_PASSWORD in environment (Default: 0107 or custom)
  const configuredPassword = process.env.ADMIN_PASSWORD || "0107";
  if (trimmedPass === configuredPassword) {
    return {
      isValid: true,
      user: {
        email: trimmedId.includes("@") ? trimmedId : `${trimmedId}@thethirdspace.in`,
        role: "admin",
      },
    };
  }

  // 3. If Supabase is active, fallback check with Supabase Auth
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const loginEmail = trimmedId.includes("@")
        ? trimmedId
        : `${trimmedId}@thethirdspace.in`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: trimmedPass,
      });

      if (!error && data?.user) {
        return {
          isValid: true,
          user: {
            email: data.user.email,
            role: "admin",
          },
        };
      }
    } catch (e) {
      console.warn("[validateAdminCredentials] Supabase auth check fallback:", e.message);
    }
  }

  return { isValid: false, error: "Invalid admin credentials. Please verify your email and password." };
}

/**
 * Creates a signed JWT session cookie
 */
export async function createAdminSession(user) {
  const token = await new SignJWT({
    email: user.email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/**
 * Clears the session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifies current admin session from cookie
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Guard for Server Components: redirects to /admin/login if not logged in
 */
export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return {
    user: session,
    adminProfile: { role: session.role || "admin" },
  };
}
