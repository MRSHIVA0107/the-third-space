import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEventSettings, updateEventSettings, isRegistrationActive } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const settings = await getEventSettings("utsaah-3");
    const status = isRegistrationActive(settings);

    return NextResponse.json({
      success: true,
      settings,
      status,
    });
  } catch (error) {
    console.error("[api/admin/event-settings] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event settings." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { registration_open, registration_deadline, custom_closure_message } = body;

    const updates = {};
    if (typeof registration_open === "boolean") {
      updates.registration_open = registration_open;
    }
    if (typeof registration_deadline === "string") {
      updates.registration_deadline = registration_deadline;
    }
    if (typeof custom_closure_message === "string") {
      updates.custom_closure_message = custom_closure_message;
    }

    const updated = await updateEventSettings("utsaah-3", updates);
    const status = isRegistrationActive(updated);

    return NextResponse.json({
      success: true,
      settings: updated,
      status,
      message: "Event registration settings updated successfully.",
    });
  } catch (error) {
    console.error("[api/admin/event-settings] POST error:", error);
    return NextResponse.json(
      { error: "Failed to update event settings." },
      { status: 500 }
    );
  }
}
