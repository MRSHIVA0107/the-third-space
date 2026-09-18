import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";
import { formatEventDate } from "@/lib/utils/formatDate";
import { KeynoteCard } from "@/components/KeynoteCard";
import { Timeline } from "@/components/Timeline";

export const metadata = {
  title: "UTSAAH 3.0 — The Third Space × Psychologs | The Third Space",
  description:
    "Full event details, schedule, speaker profile, and registration for UTSAAH 3.0 on 19 September 2026 at MLRIT Auditorium.",
};

const FAQS = [
  {
    q: "Who is eligible to attend UTSAAH 3.0?",
    a: "The campaign is open to all students across all academic years and engineering branches at MLRIT. Admission is confirmed upon online registration.",
  },
  {
    q: "Do I need any art experience for the creative activities?",
    a: "None at all! The creative expression sessions are exploratory, cathartic, and completely non-judgmental. All basic materials are provided.",
  },
  {
    q: "What is the Psychologs collaboration?",
    a: "Psychologs is India's leading mental health publication. They are partnering with The Third Space to deliver literature, expert perspectives, and free magazines to attendees.",
  },
  {
    q: "What if I can only attend part of the day?",
    a: "While we encourage participating for the full day to experience the keynote and creative workshops, students are welcome to attend the sessions that match their schedule.",
  },
];

export default function UtsaahEventPage() {
  const formattedDate = formatEventDate(UTSAAH_3_EVENT.eventDate);

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 text-ink">
      {/* Event Header Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-forest transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full text-xs font-semibold text-forest">
            <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
            <span>Inaugural Campaign · Registration Active</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-ink leading-tight">
            {UTSAAH_3_EVENT.title}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-forest uppercase tracking-wider">
            {UTSAAH_3_EVENT.subtitle} · The Third Space × Psychologs
          </p>

          <p className="text-base sm:text-lg text-ink/80 leading-relaxed font-light max-w-3xl">
            {UTSAAH_3_EVENT.description}
          </p>

          {/* Quick Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-sand">
            <div className="flex items-center gap-3">
              <Calendar className="text-forest flex-shrink-0" size={20} />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-bold">Date</p>
                <p className="text-xs font-medium text-ink">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-forest flex-shrink-0" size={20} />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-bold">Venue</p>
                <p className="text-xs font-medium text-ink">{UTSAAH_3_EVENT.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="text-forest flex-shrink-0" size={20} />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-bold">Timings</p>
                <p className="text-xs font-medium text-ink">
                  {UTSAAH_3_EVENT.startTime} — {UTSAAH_3_EVENT.endTime}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest text-cream font-bold text-sm tracking-wide uppercase rounded-sm hover:bg-forest/90 transition-all hover:scale-[1.02] shadow-md"
            >
              <span>Register for Event</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Keynote Session */}
      <KeynoteCard />

      {/* Schedule Timeline */}
      <Timeline />

      {/* Highlights & What to Expect */}
      <section className="py-20 bg-cream-100 border-t border-sand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-forest">
              Event Pillars
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              What to Expect
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-cream border border-sand rounded-sm shadow-sm space-y-3">
              <CheckCircle2 className="text-forest" size={24} />
              <h3 className="font-display text-lg text-ink font-semibold">Expert Keynote</h3>
              <p className="text-xs text-ink/75 leading-relaxed font-light">
                Actionable mental hygiene and emotional resilience guidance from Chief Director Mr. John Hemanth Kumar.
              </p>
            </div>

            <div className="p-6 bg-cream border border-sand rounded-sm shadow-sm space-y-3">
              <CheckCircle2 className="text-forest" size={24} />
              <h3 className="font-display text-lg text-ink font-semibold">Creative Expression</h3>
              <p className="text-xs text-ink/75 leading-relaxed font-light">
                Hands-on afternoon activities to unwind, express emotions visually, and explore art catharsis.
              </p>
            </div>

            <div className="p-6 bg-cream border border-sand rounded-sm shadow-sm space-y-3">
              <CheckCircle2 className="text-forest" size={24} />
              <h3 className="font-display text-lg text-ink font-semibold">Psychologs Magazine</h3>
              <p className="text-xs text-ink/75 leading-relaxed font-light">
                Curated psychology literature and magazine copies distributed at the event booth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-cream border-t border-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-forest">
              Information
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 bg-cream-100 border border-sand rounded-sm space-y-2 shadow-sm"
              >
                <h3 className="font-display text-base text-ink font-semibold">
                  {faq.q}
                </h3>
                <p className="text-xs text-ink/75 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-forest text-cream font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all hover:scale-105 shadow-md"
            >
              Secure Your Spot for UTSAAH 3.0
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
