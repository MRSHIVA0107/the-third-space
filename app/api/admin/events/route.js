import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllEvents, createEvent, updateEventStatus, deleteEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const events = await getAllEvents();
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("[api/admin/events] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events list." },
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
    const { title, subtitle, eventDate, venue, banner, description, teaserSummary, status } = body;

    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid event title (at least 2 characters)." },
        { status: 400 }
      );
    }

    const newEvent = await createEvent({
      title: title.trim(),
      subtitle: (subtitle || "Upcoming Community Gathering").trim(),
      eventDate: eventDate || "",
      venue: (venue || "MLRIT Campus").trim(),
      banner: banner || "/event/utsaah-banner.png",
      description: (description || "").trim(),
      teaserSummary: (teaserSummary || "").trim(),
      status: status || "teaser",
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: `Event "${newEvent.title}" generated successfully.`,
    });
  } catch (error) {
    console.error("[api/admin/events] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, status, successStory } = body;

    if (!slug) {
      return NextResponse.json({ error: "Event slug is required." }, { status: 400 });
    }

    const updated = await updateEventStatus(slug, { status, successStory });

    return NextResponse.json({
      success: true,
      event: updated,
      message: `Event "${updated.title}" status updated to ${updated.status}.`,
    });
  } catch (error) {
    console.error("[api/admin/events] PATCH error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update event status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Event slug is required." }, { status: 400 });
    }

    const result = await deleteEvent(slug);

    if (!result.success) {
      return NextResponse.json({ error: "Event not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Event "${slug}" deleted successfully.`,
      deletedSlug: slug,
      remainingCount: result.remainingCount,
    });
  } catch (error) {
    console.error("[api/admin/events] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 }
    );
  }
}
