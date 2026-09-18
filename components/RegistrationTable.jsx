"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatRegistrationTime } from "@/lib/utils/formatDate";
import { Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function RegistrationTable({ registrations: initialRegistrations, startIndex = 0 }) {
  const router = useRouter();
  const [list, setList] = useState(initialRegistrations || []);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setList(initialRegistrations || []);
  }, [initialRegistrations]);

  const executeDelete = async (reg) => {
    const targetId = reg.registration_id || reg.id;
    if (!targetId && !reg.email) return;

    setDeletingId(targetId || reg.email);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/registrations/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.registration_id,
          id: reg.id,
          email: reg.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Immediately eliminate from table state — S.No automatically recalculates continuously without gaps
        setList((prev) =>
          prev.filter((item) => {
            const itemTargetId = item.registration_id || item.id;
            if (targetId && itemTargetId === targetId) return false;
            if (reg.registration_id && item.registration_id?.toUpperCase() === reg.registration_id.toUpperCase()) return false;
            if (reg.email && item.email?.toLowerCase() === reg.email.toLowerCase()) return false;
            if (reg.id && item.id === reg.id) return false;
            return true;
          })
        );
        setConfirmingId(null);
        setNotification({
          type: "success",
          text: `Eliminated attendee ${reg.full_name} (${targetId || reg.email}). S.No sequence updated.`,
        });
        router.refresh();
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: "error",
          text: data.error || "Failed to eliminate registration.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        text: "Network error while attempting to remove registration.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!list || list.length === 0) {
    return (
      <div className="p-12 text-center text-muted bg-cream-100 border border-sand rounded-sm">
        <p className="text-sm">No registrations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Dynamic Status Feedback Notification */}
      {notification && (
        <div
          className={`p-3 rounded-sm text-xs flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-forest/10 border border-forest/30 text-forest"
              : "bg-maroon/10 border border-maroon/30 text-maroon"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Responsive Horizontal Scroll Container */}
      <div className="overflow-x-auto border border-sand rounded-sm bg-cream-100 shadow-sm">
        <table className="w-full text-left text-xs text-ink divide-y divide-sand/60 min-w-[760px]">
          <thead className="bg-sand/30 font-semibold uppercase tracking-wider text-[11px] text-ink/70">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-center w-12">S.No</th>
              <th scope="col" className="px-4 py-3.5">Registration ID</th>
              <th scope="col" className="px-4 py-3.5">Full Name</th>
              <th scope="col" className="px-4 py-3.5">Email</th>
              <th scope="col" className="px-4 py-3.5">Phone</th>
              <th scope="col" className="px-3 py-3.5 text-center">Year</th>
              <th scope="col" className="px-3 py-3.5 text-center">Branch</th>
              <th scope="col" className="px-3 py-3.5 text-center">Section</th>
              <th scope="col" className="px-4 py-3.5">Roll No</th>
              <th scope="col" className="px-4 py-3.5 hidden sm:table-cell">Date</th>
              <th scope="col" className="px-3 py-3.5 text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/40 font-normal">
            {list.map((reg, index) => {
              // S.No is strictly calculated by sequential index so deletion never leaves a gap
              const serialNumber = startIndex + index + 1;
              const targetId = reg.registration_id || reg.id;
              const isConfirming = confirmingId === targetId;
              const isDeleting = deletingId === targetId;

              return (
                <tr
                  key={targetId || index}
                  className={`hover:bg-sand/15 transition-colors ${
                    isDeleting ? "opacity-30" : ""
                  }`}
                >
                  <td className="px-3 py-3 text-center font-mono font-bold text-muted whitespace-nowrap bg-sand/10">
                    {serialNumber}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-forest whitespace-nowrap">
                    {reg.registration_id}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                    {reg.full_name}
                  </td>
                  <td className="px-4 py-3 text-ink/75 whitespace-nowrap">
                    <a href={`mailto:${reg.email}`} className="hover:underline">
                      {reg.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-ink/75 whitespace-nowrap font-mono">
                    {reg.phone}
                  </td>
                  <td className="px-3 py-3 text-center text-ink/80 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-sand/40 rounded-sm text-[11px] font-medium">
                      {reg.year}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-ink/80 whitespace-nowrap font-semibold">
                    {reg.branch}
                  </td>
                  <td className="px-3 py-3 text-center text-forest whitespace-nowrap font-bold">
                    <span className="px-2 py-0.5 bg-forest/10 border border-forest/20 rounded-sm text-[11px]">
                      {reg.section || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/75 whitespace-nowrap font-mono text-[11px]">
                    {reg.student_id}
                  </td>
                  <td className="px-4 py-3 text-muted hidden sm:table-cell whitespace-nowrap text-[11px]">
                    {formatRegistrationTime(reg.created_at)}
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {isConfirming ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => executeDelete(reg)}
                          className="px-2.5 py-1 bg-maroon text-cream rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-maroon/90 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {isDeleting ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : null}
                          <span>Confirm</span>
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setConfirmingId(null)}
                          className="px-2 py-1 bg-sand/40 hover:bg-sand/60 text-ink rounded-sm text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(targetId)}
                        className="p-1.5 text-muted hover:text-maroon hover:bg-maroon/10 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                        title={`Remove registration for ${reg.full_name}`}
                      >
                        <Trash2 size={14} />
                        <span className="text-[11px]">Remove</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
