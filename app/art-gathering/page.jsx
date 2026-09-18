import { GalleryGrid } from "@/components/GalleryGrid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Art Gathering — Metamorphosis Edition I | The Third Space",
  description:
    "A visual archive of 29 original student artworks, creative circles, and shared moments from Metamorphosis Edition I at MLRIT.",
};

export default function ArtGatheringPage() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-forest transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full text-xs font-semibold text-forest">
            <span>Community Archive · 16 March 2026</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-ink leading-tight">
            Metamorphosis <span className="italic text-forest">Edition I</span>
          </h1>

          <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-light">
            Our inaugural Art Gathering brought together MLRIT students across all departments to pause, paint, reflect, and share stories in a judgment-free sanctuary.
          </p>

          <p className="text-xs text-muted">
            Click any photograph to view in high-resolution fullscreen with captions.
          </p>
        </div>

        {/* Clean, Non-Scrollable Responsive Gallery Grid */}
        <GalleryGrid />
      </div>
    </div>
  );
}
