import Image from "next/image";
import { Clock } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";

export function KeynoteCard() {
  const speaker = UTSAAH_3_EVENT.speaker;

  return (
    <section className="py-20 bg-cream-100 border-y border-sand relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-forest">
            Featured Keynote Session
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">
            Keynote Address
          </h2>
        </div>

        <div className="bg-forest text-cream rounded-sm p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Speaker portrait */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-sm overflow-hidden flex-shrink-0 border-2 border-lime/40 shadow-md">
              <Image
                src={speaker.imagePath}
                alt={`${speaker.name} — ${speaker.designation}`}
                fill
                sizes="160px"
                className="object-cover object-top"
              />
            </div>

            {/* Speaker Information */}
            <div className="space-y-3 text-center sm:text-left flex-grow">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/20 border border-lime/30 rounded-full text-xs font-semibold text-lime">
                <Clock size={12} />
                <span>{speaker.timeSlot}</span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-cream">
                  {speaker.name}
                </h3>
                <p className="text-sm font-medium text-lime/90 mt-0.5">
                  {speaker.designation} · {speaker.organization}
                </p>
                <p className="text-xs text-cream/70 mt-0.5">
                  {speaker.specialization}
                </p>
              </div>

              <p className="text-sm text-cream/90 leading-relaxed max-w-xl font-light pt-2">
                An open, guided dialogue addressing student mental wellbeing, overcoming academic pressure, and nurturing emotional resilience, followed by an interactive question-and-answer session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
