import { Clock } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";

export function Timeline() {
  const timeline = UTSAAH_3_EVENT.timeline;

  return (
    <section className="py-20 lg:py-28 bg-cream border-t border-sand/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-forest">
            Schedule of the Day
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink">
            Event Timeline
          </h2>
          <p className="text-sm text-muted">
            19 September 2026 · MLRIT Auditorium · 10:00 AM – 4:00 PM
          </p>
        </div>

        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="bg-cream-100 border border-sand rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-forest/40 transition-colors shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-forest">
                  <Clock size={14} className="text-forest" />
                  <span>{item.time}</span>
                </div>
                <h3 className="font-display text-lg text-ink font-semibold">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {item.note && (
                <span className="inline-block self-start sm:self-center px-3 py-1 bg-forest/10 text-[11px] font-semibold text-forest rounded-full border border-forest/20 flex-shrink-0">
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
