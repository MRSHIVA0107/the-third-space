import Link from "next/link";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { StatsSection } from "@/components/StatsSection";
import { HighlightsSection } from "@/components/HighlightsSection";
import { UtsaahFeature } from "@/components/UtsaahFeature";
import { KeynoteCard } from "@/components/KeynoteCard";
import { Timeline } from "@/components/Timeline";
import { MetamorphosisPreview } from "@/components/MetamorphosisPreview";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Section with Cinematic Background Video & Crisp Text Overlay */}
      <Hero />

      {/* 2. About The Third Space with Photo Collage Grid (Matched to Reference Layout) */}
      <AboutSection />

      {/* 3. Impact Stats Bar (4 Metric Cards) */}
      <StatsSection />

      {/* 4. Event Highlights (6 Cards Grid: Art Therapy, Keynote, Safe Spaces, etc.) */}
      <HighlightsSection />

      {/* 5. UTSAAH 3.0 Campaign Banner & Partnership */}
      <UtsaahFeature />

      {/* 6. Keynote Address (Mr. John Hemanth Kumar, The Neurons) */}
      <KeynoteCard />

      {/* 7. Timeline Schedule */}
      <Timeline />

      {/* 8. Throwback / Metamorphosis Art Gathering Memories */}
      <MetamorphosisPreview />

      {/* 9. Community Closing CTA (Matched to Reference: "Still thinking? Just join us") */}
      <section className="py-24 bg-forest text-cream text-center relative overflow-hidden border-t border-cream/10">
        <BackgroundVideo scrimClassName="from-forest/85 via-forest/70 to-forest/90" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-lime">
            Limited Free Student Passes
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-cream tracking-tight leading-tight">
            Still thinking? <br />
            <span className="italic font-normal text-lime">Just join us</span> — and belong.
          </h2>
          <p className="text-cream/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-light">
            Whether you come to listen, create art, share your story, or simply enjoy a judgment-free space, you belong at UTSAAH 3.0.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-9 py-4 bg-lime text-forest font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-lime/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(200,228,74,0.35)]"
            >
              <span>Register for Free</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-cream font-medium text-xs uppercase tracking-wider rounded-sm transition-colors"
            >
              About The Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
