import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Free Supabase Keepalive Endpoint
 * Pinging this endpoint runs a lightweight read query against Supabase,
 * which resets Supabase's 7-day inactivity counter so the project NEVER pauses!
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const startTime = Date.now();

    // Lightweight query to keep the PostgreSQL connection warm and active
    const { data, error } = await supabase
      .from("events")
      .select("id, slug, registration_open")
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      console.warn("[Keepalive] Supabase query warning:", error.message);
      return NextResponse.json(
        {
          status: "warning",
          message: "Supabase connection returned an error, check tables.",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      database: "supabase",
      latencyMs: `${latencyMs}ms`,
      eventsFound: data?.length || 0,
      timestamp: new Date().toISOString(),
      message: "Supabase project successfully pinged and kept active.",
    });
  } catch (err) {
    console.error("[Keepalive] Error:", err.message);
    return NextResponse.json(
      {
        status: "error",
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
