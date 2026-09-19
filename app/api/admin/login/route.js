import { NextResponse } from "next/server";
import { validateAdminCredentials, createAdminSession } from "@/lib/auth";

// In-memory rate limiting for login attempts
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown-ip";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return { allowed: true };

  // Reset if window has expired
  if (now - record.firstAttempt > LOCKOUT_PERIOD_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingMinutes = Math.ceil(
      (LOCKOUT_PERIOD_MS - (now - record.firstAttempt)) / 60000
    );
    return {
      allowed: false,
      error: `Too many failed login attempts. Please wait ${remainingMinutes} minute(s) before trying again.`,
    };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > LOCKOUT_PERIOD_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
  }
}

function resetAttempts(ip) {
  loginAttempts.delete(ip);
}

export async function POST(request) {
  const clientIp = getClientIp(request);

  // 1. Check rate limit
  const rateLimitStatus = checkRateLimit(clientIp);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { error: rateLimitStatus.error },
      { status: 429 }
    );
  }

  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please enter your admin email/ID and password." },
        { status: 400 }
      );
    }

    const authResult = await validateAdminCredentials(identifier, password);

    if (!authResult.isValid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: "Invalid admin credentials. Access denied." },
        { status: 401 }
      );
    }

    // Reset failed counter on successful authentication
    resetAttempts(clientIp);

    // Set signed HTTP-only cookie
    await createAdminSession(authResult.user);

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
    });
  } catch (err) {
    console.error("[api/admin/login] Login error:", err);
    return NextResponse.json(
      { error: "Server authentication error. Please try again." },
      { status: 500 }
    );
  }
}
