import { Users, Palette, Clock, Sparkles } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "500+",
    label: "Live Attendees",
    detail: "Students & faculty united for mental wellness",
  },
  {
    icon: Palette,
    value: "100+",
    label: "Original Artworks",
    detail: "Paintings, sketches & student creative pieces",
  },
  {
    icon: Clock,
    value: "6 Hours",
    label: "Immersive Experience",
    detail: "10:00 AM to 4:00 PM at MLRIT Auditorium",
  },
  {
    icon: Sparkles,
    value: "3M+",
    label: "Community Reach",
    detail: "In partnership with Psychologs Magazine",
  },
];

export function StatsSection() {
  return (
    <section className="py-14 bg-forest text-cream border-y border-cream/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-cream/10 border border-cream/15 p-6 rounded-sm backdrop-blur-sm hover:border-lime/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-sm bg-lime/20 flex items-center justify-center text-lime mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-lime mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xs text-cream/70 mt-1 leading-relaxed font-light">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
