import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Users, Sparkles, Compass, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About | The Third Space",
  description:
    "Learn about The Third Space at MLRIT — our philosophy, pillars, and commitment to student mental health, artistic expression, and community belonging.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "THINK",
    subtitle: "Pause & Reflect",
    description:
      "A conscious deceleration from deadlines, academic pressure, and everyday noise. A space to reflect upon who you are and where you want to grow.",
  },
  {
    icon: Sparkles,
    title: "CREATE",
    subtitle: "Art & Self-Expression",
    description:
      "Art without judgment. Paint, sketch, write, or craft — not for grades or appraisal, but for the pure catharsis of creative release.",
  },
  {
    icon: Heart,
    title: "CONNECT",
    subtitle: "Honest Dialogue",
    description:
      "Normalizing conversations around mental wellbeing, anxiety, vulnerability, and resilience through open and safe circle discussions.",
  },
  {
    icon: Users,
    title: "BELONG",
    subtitle: "A Shared Sanctuary",
    description:
      "No barriers, no hierarchies. Every student across years and branches is welcome to find solace, friendship, and understanding.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 text-ink">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-forest transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        <span className="text-xs uppercase tracking-widest font-semibold text-forest">
          Our Story & Purpose
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-ink leading-tight">
          What is <span className="italic text-forest">The Third Space?</span>
        </h1>
        <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-light max-w-2xl mx-auto">
          In sociology, your &quot;first place&quot; is your home, and your &quot;second place&quot;
          is your classroom or workplace. <strong>The Third Space</strong> is the essential anchor
          in between — a neutral ground built by MLRIT students for community life, mental health,
          and creativity.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-cream-100 border border-sand rounded-sm p-8 sm:p-14 grid md:grid-cols-2 gap-10 items-center shadow-sm">
          <div className="space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
              Born from a need to slow down.
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed font-light">
              Between coding marathons, exam stress, and future career anxieties, college life
              can feel isolating. We founded The Third Space to ensure no student has to struggle
              in silence.
            </p>
            <p className="text-sm text-ink/80 leading-relaxed font-light">
              Through creative art gatherings, open mental health campaigns, and guest speaker
              dialogues, we provide the platform where students can unburden themselves, meet
              kindred spirits, and rediscover their passions.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-sand shadow-sm bg-sand/20">
            <Image
              src="/gallery/IMG_20260316_115648.jpg"
              alt="Art Gathering community moment"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-forest">
            Foundational Ethos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">
            Our Four Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 bg-cream-100 border border-sand rounded-sm shadow-sm hover:border-forest/40 transition-colors space-y-4"
              >
                <div className="w-12 h-12 rounded-sm bg-forest/10 flex items-center justify-center text-forest">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink font-semibold">{pillar.title}</h3>
                  <p className="text-xs font-semibold text-forest uppercase tracking-wider mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
                <p className="text-xs text-ink/75 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="p-10 bg-forest text-cream rounded-sm shadow-lg space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl text-cream">
            Ready to experience it firsthand?
          </h2>
          <p className="text-sm text-cream/80 max-w-lg mx-auto font-light">
            Our next gathering is <strong>UTSAAH 3.0</strong> on 19 September 2026.
            Registration is free and open to all students.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-lime text-forest font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-lime/90 transition-all hover:scale-105 shadow-md"
            >
              <span>Register Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
