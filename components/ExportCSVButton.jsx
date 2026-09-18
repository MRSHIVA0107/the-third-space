"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ExportCSVButton({
  className = "",
  compact = false,
}) {
  const [exportingFormat, setExportingFormat] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleExport = async (format = "csv") => {
    if (exportingFormat) return;

    setExportingFormat(format);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/registrations/export?format=${format}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Export failed with status ${res.status}`);
      }

      const ext = format === "excel" || format === "xls" ? "xls" : "csv";
      const mimeType =
        ext === "xls"
          ? "application/vnd.ms-excel;charset=utf-8"
          : "text/csv;charset=utf-8";

      // Extract filename from header or use guaranteed extension fallback
      let filename = `utsaah-3-registrations-${new Date().toISOString().slice(0, 10)}.${ext}`;
      const disposition = res.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Ensure explicit filename extension
      if (!filename.toLowerCase().endsWith(`.${ext}`)) {
        filename = `${filename}.${ext}`;
      }

      const textData = await res.text();
      const blob = new Blob([textData], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = downloadUrl;
      tempLink.download = filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(downloadUrl);

      setFeedback({
        type: "success",
        text: `Downloaded ${filename} successfully!`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error("[ExportCSVButton] Error:", err);
      setFeedback({
        type: "error",
        text: err.message || "Failed to download export file. Please verify admin session.",
      });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* 1. Primary CSV Export */}
      <button
        type="button"
        onClick={() => handleExport("csv")}
        disabled={Boolean(exportingFormat)}
        className="px-3.5 py-2 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 hover:bg-forest/90 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        title="Download Attendee Roster as .CSV (Excel compatible)"
      >
        {exportingFormat === "csv" ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>Exporting .CSV...</span>
          </>
        ) : (
          <>
            <Download size={13} />
            <span>Download .CSV</span>
          </>
        )}
      </button>

      {/* 2. Native Excel Spreadsheet Export (.xls / .xml) */}
      <button
        type="button"
        onClick={() => handleExport("excel")}
        disabled={Boolean(exportingFormat)}
        className="px-3 py-2 bg-cream-100 border border-sand hover:border-forest/50 text-ink text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 hover:bg-sand/30 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        title="Download Attendee Roster as Excel Spreadsheet (.xls / XML)"
      >
        {exportingFormat === "excel" ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>Exporting Excel...</span>
          </>
        ) : (
          <>
            <FileSpreadsheet size={13} className="text-forest" />
            <span>Excel (.xls)</span>
          </>
        )}
      </button>

      {/* Dynamic Feedback Notification */}
      {feedback && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 whitespace-nowrap px-3 py-1.5 rounded-sm text-[11px] font-medium flex items-center gap-1.5 shadow-md ${
            feedback.type === "success"
              ? "bg-forest text-cream border border-forest/50"
              : "bg-maroon text-cream border border-maroon/50"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={13} />
          ) : (
            <AlertCircle size={13} />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}
