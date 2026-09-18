import Link from "next/link";
import { Palette, MessageSquare, Shield, Sparkles, Store, Mic, ArrowRight } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Palette,
    title: "Art Therapy & Creation",
    description: "Therapy through painting, tactile expression, and creative decompression for mental clarity.",
    badge: "Interactive",
  },
  {
    icon: MessageSquare,
    title: "Keynote & Expert Dialogue",
    description: "Guided talk with Chief Director Mr. John Hemanth Kumar (The Neurons) on youth mental health.",
    badge: "Session",
  },
  {
    icon: Shield,
    title: "Safe & Confidential Circles",
    description: "Peer listening and judgment-free conversations about academic stress, burnout, and belonging.",
    badge: "Sanctuary",
  },
  {
    icon: Sparkles,
    title: "Psychologs Collaboration",
    description: "National mental health awareness campaign spearheaded by India's first psychology publication.",
    badge: "National",
  },
  {
    icon: Store,
    title: "Interactive Stalls & Games",
    description: "Self-reflection stations, affirmation boards, mood trackers, and community connection games.",
    badge: "Activity",
  },
  {
    icon: Mic,
    title: "Community Open Mic",
    description: "A welcoming platform for students to share spoken-word poetry, music, thoughts, and personal stories.",
    badge: "Expression",
  },
];

export function HighlightsSection() {
  return (
    <section className="py-20 lg:py-28 bg-cream-100 border-b border-sand/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-forest">
            Event Highlights
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
            What to Expect at UTSAAH 3.0
          </h2>
          <p className="text-muted text-sm sm:text-base font-light">
            Designed for students to decompress, express their innermost thoughts, and discover that they are never alone.
          </p>
        </div>

        {/* 6 Cards Grid (Matched to Reference Layout) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-cream border border-sand p-7 rounded-sm hover:border-forest/50 transition-all hover:-translate-y-1 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-forest/10 text-forest rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl text-ink font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/75 mt-2 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-sand/40 flex items-center gap-1 text-xs font-semibold text-forest">
                  <span>Part of UTSAAH 3.0 Experience</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Action Button */}
        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-forest text-cream font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-forest/90 transition-all shadow-md hover:scale-105"
          >
            <span>Register Now for Free</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
