"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Save, Loader2, RefreshCw } from "lucide-react";

export function AdminEventSettings({ initialSettings }) {
  const [settings, setSettings] = useState({
    registration_open: initialSettings?.registration_open !== false,
    registration_deadline: initialSettings?.registration_deadline || "2026-09-19T09:30",
    custom_closure_message:
      initialSettings?.custom_closure_message ||
      "Registrations for UTSAAH 3.0 are currently closed as the deadline has passed.",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Check if currently expired based on local time
  const isDeadlinePassed = () => {
    if (!settings.registration_deadline) return false;
    return Date.now() > new Date(settings.registration_deadline).getTime();
  };

  const isActuallyActive = settings.registration_open && !isDeadlinePassed();

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/event-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Registration settings updated successfully!" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update settings." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving settings." });
    } finally {
      setSaving(false);
    }
  };

  const setPreset = (type) => {
    if (type === "event_morning") {
      setSettings((prev) => ({
        ...prev,
        registration_open: true,
        registration_deadline: "2026-09-19T09:30",
      }));
    } else if (type === "extend_24h") {
      const current = new Date(settings.registration_deadline || Date.now());
      current.setDate(current.getDate() + 1);
      const iso = current.toISOString().slice(0, 16);
      setSettings((prev) => ({
        ...prev,
        registration_open: true,
        registration_deadline: iso,
      }));
    } else if (type === "close_now") {
      setSettings((prev) => ({
        ...prev,
        registration_open: false,
      }));
    } else if (type === "reopen_now") {
      setSettings((prev) => ({
        ...prev,
        registration_open: true,
      }));
    }
  };

  return (
    <div className="bg-cream-100 border border-sand rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/60 pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-forest">
            Campaign Controls
          </span>
          <h2 className="font-display text-xl sm:text-2xl text-ink">
            Registration Status & Expiry Deadline
          </h2>
          <p className="text-xs text-muted mt-1">
            Adjustable anytime: change the deadline or toggle public registration intake.
          </p>
        </div>

        {/* Live Active Status Badge */}
        <div className="flex items-center gap-2">
          {isActuallyActive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-lime/20 border border-lime/40 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
              <span className="text-xs font-bold text-forest uppercase tracking-wider">
                Registration Active
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-maroon/15 border border-maroon/30 rounded-full">
              <AlertTriangle size={14} className="text-maroon" />
              <span className="text-xs font-bold text-maroon uppercase tracking-wider">
                {isDeadlinePassed() ? "Expired / Closed" : "Paused / Closed"}
              </span>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-forest/10 border border-forest/30 text-forest"
              : "bg-maroon/10 border border-maroon/30 text-maroon"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Public Registration Intake
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <input
                  type="radio"
                  name="registration_open"
                  checked={settings.registration_open === true}
                  onChange={() => setSettings((prev) => ({ ...prev, registration_open: true }))}
                  className="text-forest focus:ring-forest"
                />
                <span>Open / Active</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <input
                  type="radio"
                  name="registration_open"
                  checked={settings.registration_open === false}
                  onChange={() => setSettings((prev) => ({ ...prev, registration_open: false }))}
                  className="text-forest focus:ring-forest"
                />
                <span>Closed / Paused</span>
              </label>
            </div>
            <p className="text-[11px] text-muted">
              Instantly disable registration regardless of the date.
            </p>
          </div>

          {/* Registration Expiry Deadline */}
          <div className="space-y-2">
            <label
              htmlFor="registration_deadline"
              className="block text-xs font-semibold uppercase tracking-wider text-ink"
            >
              Registration Expiry Date & Time
            </label>
            <div className="relative">
              <input
                id="registration_deadline"
                type="datetime-local"
                value={settings.registration_deadline}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, registration_deadline: e.target.value }))
                }
                className="w-full px-4 py-2.5 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest font-mono"
              />
            </div>
            <p className="text-[11px] text-muted">
              Registrations automatically close when this deadline arrives.
            </p>
          </div>
        </div>

        {/* Custom Closure Message */}
        <div className="space-y-2">
          <label
            htmlFor="custom_closure_message"
            className="block text-xs font-semibold uppercase tracking-wider text-ink"
          >
            Announcement Message When Closed
          </label>
          <input
            id="custom_closure_message"
            type="text"
            value={settings.custom_closure_message}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, custom_closure_message: e.target.value }))
            }
            placeholder="e.g. Registrations for UTSAAH 3.0 are currently closed. Thank you!"
            className="w-full px-4 py-2.5 bg-cream border border-sand rounded-sm text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        {/* Preset Quick Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-muted uppercase tracking-wider font-semibold mr-1">
            Quick Adjust:
          </span>
          <button
            type="button"
            onClick={() => setPreset("event_morning")}
            className="px-2.5 py-1 bg-cream border border-sand rounded-sm hover:border-forest/50 text-ink text-[11px] transition-colors"
          >
            Set to 19 Sep 09:30 AM
          </button>
          <button
            type="button"
            onClick={() => setPreset("extend_24h")}
            className="px-2.5 py-1 bg-cream border border-sand rounded-sm hover:border-forest/50 text-ink text-[11px] transition-colors"
          >
            +24 Hours
          </button>
          {settings.registration_open ? (
            <button
              type="button"
              onClick={() => setPreset("close_now")}
              className="px-2.5 py-1 bg-maroon/10 border border-maroon/30 text-maroon rounded-sm text-[11px] transition-colors"
            >
              Close Now
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPreset("reopen_now")}
              className="px-2.5 py-1 bg-forest/10 border border-forest/30 text-forest rounded-sm text-[11px] transition-colors"
            >
              Reopen Now
            </button>
          )}
        </div>

        {/* Submit Save Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Registration Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
