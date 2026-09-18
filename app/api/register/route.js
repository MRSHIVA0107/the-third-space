import { NextResponse } from "next/server";
import { validateRegistration, MAX_PAYLOAD_BYTES } from "@/lib/validation/registration";
import {
  saveRegistration,
  getEventSettings,
  isRegistrationActive,
  getNextRegistrationId,
} from "@/lib/db";

export async function POST(request) {
  try {
    // 1. Check content length
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload too large. Maximum size is 10KB." },
        { status: 413 }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request format." },
        { status: 400 }
      );
    }

    // 3. Validation including Year, Branch, and Section
    const validation = validateRegistration(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 4. Verify event registration is active (not closed and not past deadline)
    const settings = await getEventSettings("utsaah-3");
    const activeCheck = isRegistrationActive(settings);
    if (!activeCheck.active) {
      return NextResponse.json(
        {
          error: activeCheck.reason || "Registration for this event is currently closed.",
          expired: true,
          deadline: activeCheck.deadline,
        },
        { status: 403 }
      );
    }

    // 5. Generate event-relevant sequential ID (e.g. UTSAAH3-001, UTSAAH3-002...)
    const registrationId = await getNextRegistrationId("UTSAAH3");

    // 6. Save registration with Year, Branch, and Section
    const result = await saveRegistration({
      ...validation.data,
      registrationId,
      eventSlug: "utsaah-3",
    });

    if (result.alreadyRegistered) {
      return NextResponse.json(
        {
          error: "You are already registered for this event.",
          registrationId: result.registrationId,
          alreadyRegistered: true,
        },
        { status: 409 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to record registration. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        registrationId,
        message: "Registration completed successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/register] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
