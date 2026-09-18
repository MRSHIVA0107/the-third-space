import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getRegistrationCount, getEventSettings, isRegistrationActive } from "@/lib/db";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminEventSettings } from "@/components/AdminEventSettings";
import { ExportCSVButton } from "@/components/ExportCSVButton";
import { Users, Download, ListFilter, Calendar, ExternalLink, Clock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();

  // Fetch total registration count & adjustable settings from active database
  const totalCount = await getRegistrationCount();
  const eventSettings = await getEventSettings("utsaah-3");
  const statusInfo = isRegistrationActive(eventSettings);

  const formattedDeadline = eventSettings.registration_deadline
    ? new Date(eventSettings.registration_deadline).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not Set";

  return (
    <div className="min-h-screen bg-cream/90 pt-24 pb-20">
      {/* Top Admin Header Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-ink text-cream p-4 sm:p-6 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-lime">
              Authorized Admin Session
            </span>
            <h1 className="font-display text-lg sm:text-xl text-cream">
              THE THIRD SPACE · ADMIN CONSOLE
            </h1>
            <p className="text-xs text-cream/50 mt-0.5 font-mono">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-cream/10 hover:bg-cream/20 text-xs text-cream/80 rounded-sm flex items-center gap-1 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Registrations */}
          <div className="bg-forest text-cream p-8 rounded-sm shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-lime font-semibold">
                Total Registrations
              </span>
              <Users size={20} className="text-lime" />
            </div>
            <p className="font-display text-5xl font-bold tracking-tight text-cream">
              {totalCount}
            </p>
            <p className="text-xs text-cream/60 mt-2">
              Live attendees registered for UTSAAH 3.0
            </p>
          </div>

          {/* Event Status & Deadline */}
          <div className="bg-cream-100 border border-sand p-8 rounded-sm shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                  Campaign Status
                </span>
                <Calendar size={18} className="text-forest" />
              </div>
              <p className="font-display text-2xl text-ink">UTSAAH 3.0</p>
              <div className="flex items-center gap-1.5 text-xs text-muted mt-1 font-mono">
                <Clock size={12} />
                <span>Deadline: {formattedDeadline}</span>
              </div>
            </div>
            <div className="mt-4">
              {statusInfo.active ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/20 border border-lime/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span className="text-xs font-semibold text-forest">Registration Active</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-maroon/15 border border-maroon/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-maroon" />
                  <span className="text-xs font-semibold text-maroon">Registration Closed</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick CSV Export */}
          <div className="bg-cream-100 border border-sand p-8 rounded-sm shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-muted font-semibold">
                  Export Data
                </span>
                <Download size={18} className="text-forest" />
              </div>
              <p className="font-display text-xl text-ink">Attendee Roster</p>
              <p className="text-xs text-muted mt-1">
                Download verified CSV with S.No, Year, Branch, and Section.
              </p>
            </div>
            <ExportCSVButton
              label="Download CSV"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors self-start shadow-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Adjustable Registration Expiry Controls */}
        <AdminEventSettings initialSettings={eventSettings} />

        {/* Quick Navigation Hub */}
        <div className="bg-cream-100 border border-sand rounded-sm p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl text-ink mb-4">
            Management Hub
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/admin/registrations"
              className="p-5 bg-cream border border-sand rounded-sm hover:border-forest/40 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
                  <ListFilter size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-forest transition-colors">
                    Registration Roster
                  </p>
                  <p className="text-xs text-muted">
                    S.No, Year, Branch, Section & Remove action
                  </p>
                </div>
              </div>
              <span className="text-forest font-bold text-sm">→</span>
            </Link>

            <Link
              href="/admin/events"
              className="p-5 bg-cream border border-sand rounded-sm hover:border-forest/40 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-lime/25 flex items-center justify-center text-forest">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-forest transition-colors">
                    Host Event & Teasers
                  </p>
                  <p className="text-xs text-muted">
                    Upload banners & archive completed events
                  </p>
                </div>
              </div>
              <span className="text-forest font-bold text-sm">→</span>
            </Link>

            <a
              href="/api/admin/registrations/export"
              className="p-5 bg-cream border border-sand rounded-sm hover:border-forest/40 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-forest transition-colors">
                    Export All as CSV
                  </p>
                  <p className="text-xs text-muted">
                    Formatted for Excel, Google Sheets, or Numbers
                  </p>
                </div>
              </div>
              <span className="text-forest font-bold text-sm">↓</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
