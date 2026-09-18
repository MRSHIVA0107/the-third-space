import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-cream border-t border-sand/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Authentic Event Photo Collage Grid (Matched to Reference Layout) */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[420px] sm:h-[480px]">
              {/* Feature Large Photo */}
              <div className="col-span-4 row-span-4 relative rounded-sm overflow-hidden border border-sand/60 shadow-lg group">
                <Image
                  src="/gallery/IMG-20260316-WA0054.jpg"
                  alt="Student creative art gathering at The Third Space"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Top Right Photo */}
              <div className="col-span-2 row-span-3 relative rounded-sm overflow-hidden border border-sand/60 shadow-md group">
                <Image
                  src="/gallery/IMG-20260316-WA0023.jpg"
                  alt="Artworks on display at Metamorphosis"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Mid Right Photo */}
              <div className="col-span-2 row-span-3 relative rounded-sm overflow-hidden border border-sand/60 shadow-md group">
                <Image
                  src="/gallery/IMG-20260316-WA0032.jpg"
                  alt="Students gathering and conversing"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Left Photo */}
              <div className="col-span-2 row-span-2 relative rounded-sm overflow-hidden border border-sand/60 shadow-md group">
                <Image
                  src="/gallery/IMG-20260316-WA0016.jpg"
                  alt="Creative expression workshop"
                  fill
                  sizes="(max-width: 768px) 50vw, 180px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom Mid Photo */}
              <div className="col-span-2 row-span-2 relative rounded-sm overflow-hidden border border-sand/60 shadow-md group">
                <Image
                  src="/gallery/IMG-20260316-WA0070.jpg"
                  alt="Community connection moment"
                  fill
                  sizes="(max-width: 768px) 50vw, 180px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted tracking-wide text-center mt-3 italic">
              Authentic moments from our Metamorphosis Art Gathering at MLRIT
            </p>
          </div>

          {/* Right Column: Editorial Community Narrative */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full">
              <HeartHandshake size={14} className="text-forest" />
              <span className="text-xs uppercase tracking-widest font-semibold text-forest">
                About Our Community
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
              Not home. Not the classroom. <br />
              <span className="italic text-forest">A space of your own.</span>
            </h2>

            <div className="space-y-4 text-ink/80 text-base sm:text-lg font-light leading-relaxed">
              <p>
                Sociologist Ray Oldenburg coined the term <em>&ldquo;The Third Place&rdquo;</em> for the vital anchors of community life — places where people gather to pause, converse, reflect, and belong away from the demands of work and home.
              </p>
              <p>
                At MLRIT, <strong>The Third Space</strong> is an independent student-led sanctuary creating open conversations around mental health, emotional resilience, and artistic expression.
              </p>
              <p>
                Through our collaboration with <strong>Psychologs Magazine</strong>, we are bringing <strong>UTSAAH 3.0</strong> to campus — encouraging students to talk openly, listen with empathy, and connect through creative experiences.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all shadow-sm"
              >
                <span>Discover Our Pillars</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/events/utsaah-3"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline underline-offset-4"
              >
                <span>About UTSAAH 3.0</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
