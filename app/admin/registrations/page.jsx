import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getRegistrations } from "@/lib/db";
import { RegistrationTable } from "@/components/RegistrationTable";
import { LogoutButton } from "@/components/LogoutButton";
import { ExportCSVButton } from "@/components/ExportCSVButton";
import { ArrowLeft, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function AdminRegistrationsPage({ searchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || "1", 10));
  const search = (params?.search || "").trim();

  const { data: registrations, count: totalCount, totalPages } =
    await getRegistrations({
      page,
      limit: PAGE_SIZE,
      search,
    });

  const offset = (page - 1) * PAGE_SIZE;

  return (
    <div className="min-h-screen bg-cream/90 pt-24 pb-20">
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
              <h1 className="font-display text-2xl text-ink">
                Registration Roster
              </h1>
              <p className="text-xs text-muted">
                {totalCount} total registered attendee{totalCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExportCSVButton label="Export CSV" />
            <LogoutButton />
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-cream-100 border border-sand p-4 rounded-sm shadow-sm">
          <form method="GET" className="flex items-center gap-3">
            <div className="relative flex-grow">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name, email, roll number, or TS-ID..."
                className="w-full pl-9 pr-4 py-2.5 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors cursor-pointer"
            >
              Search
            </button>
            {search && (
              <Link
                href="/admin/registrations"
                className="px-4 py-2.5 bg-cream border border-sand text-ink text-xs rounded-sm hover:bg-sand/30 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Table of Registrations with S.No, Year, Branch, and Section */}
        <RegistrationTable registrations={registrations || []} startIndex={offset} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-sand text-xs text-muted">
            <p>
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/registrations?page=${page - 1}${search ? `&search=${search}` : ""}`}
                  className="px-3 py-1.5 bg-cream-100 border border-sand rounded-sm hover:bg-sand/30 transition-colors text-ink"
                >
                  Previous
                </Link>
              )}
              <span className="px-2 font-medium text-ink">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/admin/registrations?page=${page + 1}${search ? `&search=${search}` : ""}`}
                  className="px-3 py-1.5 bg-cream-100 border border-sand rounded-sm hover:bg-sand/30 transition-colors text-ink"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
