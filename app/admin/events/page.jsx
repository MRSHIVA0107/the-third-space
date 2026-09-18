import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/db";
import { AdminEventManager } from "@/components/AdminEventManager";
import { LogoutButton } from "@/components/LogoutButton";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-cream/90 pt-24 pb-20 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 text-ink hover:text-forest bg-cream-100 border border-sand rounded-sm transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-forest font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Events & Teasers Management Hub</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-ink">
                Host New Events & Archive
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/registrations"
              className="px-4 py-2 bg-cream-100 border border-sand hover:border-forest/40 text-ink text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
            >
              Attendee Roster
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Event Manager Component */}
        <AdminEventManager initialEvents={events} />
      </div>
    </div>
  );
}
