import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteRegistration } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { registrationId, id, email } = body;

    if (!registrationId && !id && !email) {
      return NextResponse.json(
        { error: "Registration ID, ID, or Email is required." },
        { status: 400 }
      );
    }

    const result = await deleteRegistration(registrationId, { id, email });

    if (!result.success) {
      return NextResponse.json(
        { error: "Registration not found or could not be removed." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${registrationId} eliminated successfully.`,
      deletedId: registrationId,
      remainingCount: result.remainingCount,
    });
  } catch (error) {
    console.error("[api/admin/registrations/delete] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while eliminating registration." },
      { status: 500 }
    );
  }
}
