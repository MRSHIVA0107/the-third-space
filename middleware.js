import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "third-space-super-secure-admin-secret-key-0107";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Validates cryptographic JWT signature in Edge runtime
 */
async function verifySessionToken(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return Boolean(payload && payload.role === "admin");
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("admin_session")?.value;

  // 1. Air-tight Protection for Admin API Endpoints: /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    const isPublicAdminApi =
      pathname === "/api/admin/login" || pathname === "/api/admin/logout";

    if (!isPublicAdminApi) {
      const isValid = await verifySessionToken(sessionCookie);
      if (!isValid) {
        return NextResponse.json(
          { error: "Unauthorized: Admin privileges required." },
          {
            status: 401,
            headers: {
              "Cache-Control": "no-store, max-age=0",
            },
          }
        );
      }
    }
  }

  // 2. Air-tight Protection for Admin Pages: /admin/*
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
      // If already logged in, redirect directly to dashboard
      const isValid = await verifySessionToken(sessionCookie);
      if (isValid) {
        const dashboardUrl = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    } else {
      // Any other admin route: /admin, /admin/dashboard, /admin/registrations, /admin/events, etc.
      const isValid = await verifySessionToken(sessionCookie);
      if (!isValid) {
        const loginUrl = new URL("/admin/login", request.url);
        const redirectResponse = NextResponse.redirect(loginUrl);

        // Delete any invalid or expired cookie
        if (sessionCookie) {
          redirectResponse.cookies.delete("admin_session");
        }

        redirectResponse.headers.set("Cache-Control", "no-store, max-age=0");
        return redirectResponse;
      }
    }
  }

  const response = NextResponse.next();

  // Basic security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Enforce zero-caching for all admin pathways
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|event|gallery|videos).*)",
  ],
};
