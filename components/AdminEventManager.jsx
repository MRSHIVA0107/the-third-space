"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Upload,
  CheckCircle2,
  Sparkles,
  Archive,
  Loader2,
  PlusCircle,
  AlertCircle,
  Clock,
  Award,
  Trash2,
  X,
} from "lucide-react";

export function AdminEventManager({ initialEvents }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Deletion state
  const [confirmingDeleteSlug, setConfirmingDeleteSlug] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);

  // Archive Modal State (in-UI, no browser prompt blocking)
  const [archivingEvent, setArchivingEvent] = useState(null);
  const [archiveHeadline, setArchiveHeadline] = useState("");
  const [archiveSummary, setArchiveSummary] = useState("");
  const [archiving, setArchiving] = useState(false);

  // New Event / Teaser Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "Upcoming Community Gathering",
    eventDate: "",
    venue: "MLRIT Auditorium",
    banner: "/event/utsaah-banner.png",
    teaserSummary: "",
    status: "teaser",
  });

  const [previewBanner, setPreviewBanner] = useState("/event/utsaah-banner.png");

  // Handle banner image file upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setActionMessage(null);

    const data = new FormData();
    data.append("banner", file);

    try {
      const res = await fetch("/api/admin/upload-banner", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok && result.url) {
        setFormData((prev) => ({ ...prev, banner: result.url }));
        setPreviewBanner(result.url);
        setActionMessage({ type: "success", text: "Teaser banner uploaded successfully!" });
        setTimeout(() => setActionMessage(null), 3500);
      } else {
        setActionMessage({ type: "error", text: result.error || "Upload failed." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Error uploading image." });
    } finally {
      setUploading(false);
    }
  };

  // Submit new teaser event
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setActionMessage({ type: "error", text: "Please enter an event title." });
      return;
    }

    setSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) => [data.event, ...prev.filter((item) => item.slug !== data.event.slug)]);
        setActionMessage({
          type: "success",
          text: `Teaser for "${data.event.title}" published! It is now live in the community calendar.`,
        });
        // Reset form
        setFormData({
          title: "",
          subtitle: "Upcoming Community Gathering",
          eventDate: "",
          venue: "MLRIT Auditorium",
          banner: "/event/utsaah-banner.png",
          teaserSummary: "",
          status: "teaser",
        });
        setPreviewBanner("/event/utsaah-banner.png");
        router.refresh();
        setTimeout(() => setActionMessage(null), 4500);
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to create teaser event." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Network error while saving event." });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete event or teaser with inline confirmation
  const handleDeleteEvent = async (slug, title) => {
    if (!slug) return;
    setDeletingSlug(slug);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.slug !== slug && e.id !== slug));
        setConfirmingDeleteSlug(null);
        setActionMessage({
          type: "success",
          text: `Event "${title || slug}" has been removed.`,
        });
        router.refresh();
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setActionMessage({
          type: "error",
          text: data.error || "Failed to remove event.",
        });
      }
    } catch {
      setActionMessage({
        type: "error",
        text: "Network error while attempting to remove event.",
      });
    } finally {
      setDeletingSlug(null);
    }
  };

  // Open archive in-UI dialog
  const openArchiveModal = (event) => {
    setArchivingEvent(event);
    setArchiveHeadline(`${event.title} — Mission Accomplished`);
    setArchiveSummary(
      "A transformative campus gathering breaking mental health stigma through dialogue and art expression."
    );
  };

  // Confirm and save archive
  const confirmArchiveEvent = async () => {
    if (!archivingEvent) return;
    setArchiving(true);

    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: archivingEvent.slug,
          status: "completed",
          successStory: {
            headline: archiveHeadline,
            summary: archiveSummary,
            metrics: [
              { label: "Community Impact", value: "Verified" },
              { label: "Roster Preserved", value: "100%" },
            ],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.event) {
        setEvents((prev) =>
          prev.map((item) => (item.slug === archivingEvent.slug ? data.event : item))
        );
        setActionMessage({
          type: "success",
          text: `"${archivingEvent.title}" moved to Past Events Archive. All registration records & memories preserved.`,
        });
        setArchivingEvent(null);
        router.refresh();
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to archive event." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Error archiving event." });
    } finally {
      setArchiving(false);
    }
  };

  // Filter events by lifecycle
  const activeEvents = events.filter((e) => e.status === "active");
  const teaserEvents = events.filter((e) => e.status === "teaser");
  const pastEvents = events.filter((e) => e.status === "completed");

  return (
    <div className="space-y-10">
      {actionMessage && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center gap-2 ${
            actionMessage.type === "success"
              ? "bg-forest/10 border border-forest/30 text-forest"
              : "bg-maroon/10 border border-maroon/30 text-maroon"
          }`}
        >
          {actionMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 
        Section 1: Host New Event / Teaser Generator
      */}
      <div className="bg-cream-100 border border-sand rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-sand/60 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/20 border border-lime/30 rounded-full text-[11px] font-bold text-forest uppercase tracking-widest mb-2">
            <PlusCircle size={13} />
            <span>Host New Gathering</span>
          </div>
          <h2 className="font-display text-2xl text-ink">
            Generate Teaser Event & Upload Banner
          </h2>
          <p className="text-xs text-muted mt-1">
            Create an upcoming event announcement with custom uploaded banner artwork.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Event Title <span className="text-maroon">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. UTSAAH 4.0 or Art Catharsis II"
                className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Mental Health Awareness Campaign"
                className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Estimated Date
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest font-mono"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. MLRIT Auditorium or Central Lawn"
                className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>
          </div>

          {/* Banner Upload Section */}
          <div className="border border-dashed border-sand/80 bg-cream/70 rounded-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink block">
                  Teaser Artwork Banner Upload
                </span>
                <p className="text-[11px] text-muted mt-0.5">
                  Upload an image (.png, .jpg, .webp) to serve as the visual banner.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-colors cursor-pointer shadow-sm">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Upload Banner Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Banner Preview */}
            <div className="relative aspect-[16/7] max-h-48 w-full rounded-sm overflow-hidden border border-sand bg-black/5">
              <Image
                src={previewBanner}
                alt="Banner Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Teaser Summary */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
              Teaser Summary / Pitch
            </label>
            <textarea
              rows={3}
              value={formData.teaserSummary}
              onChange={(e) => setFormData({ ...formData, teaserSummary: e.target.value })}
              placeholder="A short compelling teaser pitch announcing what students can anticipate..."
              className="w-full px-4 py-3 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full sm:w-auto px-8 py-3.5 bg-forest text-cream text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-forest/90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Generating Teaser Event...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Publish Teaser Event</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 
        Section 2: Active & Upcoming Teaser Events
      */}
      <div className="space-y-4">
        <h3 className="font-display text-xl text-ink">
          Active & Upcoming Teaser Events
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Events */}
          {activeEvents.map((evt) => (
            <div
              key={evt.id || evt.slug}
              className="bg-cream-100 border-2 border-forest/30 rounded-sm p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-lime text-forest text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Current Active Event
                  </span>
                  <span className="text-[11px] text-muted font-mono">{evt.eventDate}</span>
                </div>

                <h4 className="font-display text-2xl text-ink">{evt.title}</h4>
                <p className="text-xs font-semibold text-forest uppercase">{evt.subtitle}</p>
                <p className="text-xs text-ink/75 line-clamp-2">{evt.description}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-sand/60 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-muted">Venue: {evt.venue}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openArchiveModal(evt)}
                    className="px-3 py-1.5 bg-forest/10 hover:bg-forest/20 text-forest text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Archive event to Past Events when completed (preserves all data & memories)"
                  >
                    <Archive size={13} />
                    <span>Mark Completed & Archive</span>
                  </button>

                  {confirmingDeleteSlug === evt.slug ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => handleDeleteEvent(evt.slug, evt.title)}
                        className="px-2.5 py-1.5 bg-maroon text-cream rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-maroon/90 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {deletingSlug === evt.slug && <Loader2 size={11} className="animate-spin" />}
                        <span>Confirm</span>
                      </button>
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => setConfirmingDeleteSlug(null)}
                        className="px-2 py-1.5 bg-sand/40 hover:bg-sand/60 text-ink rounded-sm text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteSlug(evt.slug)}
                      className="p-1.5 text-muted hover:text-maroon hover:bg-maroon/10 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                      title={`Remove event "${evt.title}"`}
                    >
                      <Trash2 size={13} />
                      <span className="text-[11px]">Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Teaser Events */}
          {teaserEvents.map((evt) => (
            <div
              key={evt.id || evt.slug}
              className="bg-cream-100 border border-sand rounded-sm p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-forest/10 text-forest text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Teaser Announcement
                  </span>
                  <span className="text-[11px] text-muted font-mono">{evt.eventDate || "Date TBA"}</span>
                </div>

                <h4 className="font-display text-2xl text-ink">{evt.title}</h4>
                <p className="text-xs font-semibold text-forest uppercase">{evt.subtitle}</p>
                <p className="text-xs text-ink/75 line-clamp-2">{evt.teaserSummary || evt.description}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-sand/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin size={13} className="text-forest" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-forest font-semibold text-[11px]">Live in Calendar</span>
                  {confirmingDeleteSlug === evt.slug ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => handleDeleteEvent(evt.slug, evt.title)}
                        className="px-2.5 py-1 bg-maroon text-cream rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-maroon/90 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {deletingSlug === evt.slug && <Loader2 size={11} className="animate-spin" />}
                        <span>Confirm</span>
                      </button>
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => setConfirmingDeleteSlug(null)}
                        className="px-2 py-1 bg-sand/40 hover:bg-sand/60 text-ink rounded-sm text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteSlug(evt.slug)}
                      className="px-2 py-1 text-muted hover:text-maroon hover:bg-maroon/10 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                      title={`Remove teaser "${evt.title}"`}
                    >
                      <Trash2 size={13} />
                      <span className="text-[11px]">Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {teaserEvents.length === 0 && (
            <div className="md:col-span-2 p-8 text-center bg-cream-100/60 border border-dashed border-sand rounded-sm text-xs text-muted space-y-2">
              <Sparkles size={20} className="mx-auto text-forest/50" />
              <p className="font-semibold text-ink">No upcoming teaser announcements currently.</p>
              <p>Use the form above to generate a new teaser event and upload banner artwork.</p>
            </div>
          )}
        </div>
      </div>

      {/* 
        Section 3: Past Events, Success Stories & Memories Archive
      */}
      <div className="space-y-4 pt-4 border-t border-sand">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sand/40 rounded-full text-[11px] font-semibold text-muted uppercase tracking-widest mb-1">
            <Award size={13} />
            <span>Permanent Archive</span>
          </div>
          <h3 className="font-display text-xl text-ink">
            Past Events, Success Stories & Memories
          </h3>
          <p className="text-xs text-muted">
            Completed events are permanently preserved with full attendee rosters, metrics, and memory photo archives.
          </p>
        </div>

        <div className="space-y-4">
          {pastEvents.map((evt) => (
            <div
              key={evt.id || evt.slug}
              className="bg-cream-100/70 border border-sand rounded-sm p-6 sm:p-8 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted">
                    Completed Gathering · {evt.eventDate}
                  </span>
                  <h4 className="font-display text-2xl text-ink mt-0.5">{evt.title}</h4>
                  <p className="text-xs font-semibold text-forest uppercase">{evt.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest/10 rounded-full text-xs font-semibold text-forest">
                    <CheckCircle2 size={13} />
                    <span>Archived with Full Data</span>
                  </div>

                  {confirmingDeleteSlug === evt.slug ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => handleDeleteEvent(evt.slug, evt.title)}
                        className="px-2.5 py-1 bg-maroon text-cream rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-maroon/90 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {deletingSlug === evt.slug && <Loader2 size={11} className="animate-spin" />}
                        <span>Confirm Delete</span>
                      </button>
                      <button
                        type="button"
                        disabled={deletingSlug === evt.slug}
                        onClick={() => setConfirmingDeleteSlug(null)}
                        className="px-2 py-1 bg-sand/40 hover:bg-sand/60 text-ink rounded-sm text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteSlug(evt.slug)}
                      className="px-2.5 py-1 text-muted hover:text-maroon hover:bg-maroon/10 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                      title={`Remove archived event "${evt.title}"`}
                    >
                      <Trash2 size={13} />
                      <span className="text-[11px]">Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {evt.successStory && (
                <div className="p-4 bg-cream border border-sand rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>Success Story: {evt.successStory.headline}</span>
                  </div>
                  <p className="text-xs text-ink/80 leading-relaxed font-light">
                    {evt.successStory.summary}
                  </p>

                  {/* Metrics */}
                  {evt.successStory.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {evt.successStory.metrics.map((m, i) => (
                        <div key={i} className="p-2.5 bg-cream-100 rounded-sm text-center border border-sand/60">
                          <p className="font-display text-lg font-bold text-forest">{m.value}</p>
                          <p className="text-[10px] uppercase text-muted tracking-wider">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {pastEvents.length === 0 && (
            <div className="p-8 text-center bg-cream-100/60 border border-dashed border-sand rounded-sm text-xs text-muted">
              <p>No past events archived yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* 
        In-UI Archive Modal: Avoids browser window.prompt blockages
      */}
      {archivingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-cream border border-sand rounded-sm shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-sand/60 pb-3">
              <div className="flex items-center gap-2 text-forest">
                <Archive size={18} />
                <h3 className="font-display text-xl text-ink">Archive to Past Gatherings</h3>
              </div>
              <button
                type="button"
                onClick={() => setArchivingEvent(null)}
                className="p-1 text-muted hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-muted space-y-1">
              <p>
                Archiving <strong className="text-ink font-semibold">{archivingEvent.title}</strong> will move it to the permanent Past Events archive.
              </p>
              <p className="text-forest font-medium">
                ✓ 100% of registrations, attendee records, and memories are safely preserved.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                  Success Story Headline
                </label>
                <input
                  type="text"
                  value={archiveHeadline}
                  onChange={(e) => setArchiveHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-100 border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                  Summary & Impact Story
                </label>
                <textarea
                  rows={4}
                  value={archiveSummary}
                  onChange={(e) => setArchiveSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-100 border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand/60">
              <button
                type="button"
                disabled={archiving}
                onClick={() => setArchivingEvent(null)}
                className="px-4 py-2 bg-sand/30 hover:bg-sand/60 text-ink text-xs font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={archiving}
                onClick={confirmArchiveEvent}
                className="px-5 py-2 bg-forest text-cream text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {archiving && <Loader2 size={13} className="animate-spin" />}
                <span>Confirm & Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
