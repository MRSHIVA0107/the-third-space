import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Basic security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Protect Admin dashboard & registrations routes
  const isProtectedAdminRoute =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/registrations");

  if (isProtectedAdminRoute) {
    response.headers.set("Cache-Control", "no-store, max-age=0");

    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|event|gallery|videos).*)",
  ],
};
