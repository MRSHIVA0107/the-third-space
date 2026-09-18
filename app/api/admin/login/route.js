import { NextResponse } from "next/server";
import { validateAdminCredentials, createAdminSession } from "@/lib/auth";

export async function POST(request) {
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
      return NextResponse.json(
        { error: "Invalid admin credentials. Please check your details." },
        { status: 401 }
      );
    }

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
