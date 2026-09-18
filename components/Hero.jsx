import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";
import { formatEventDate } from "@/lib/utils/formatDate";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export function Hero() {
  const formattedDate = formatEventDate(UTSAAH_3_EVENT.eventDate);

  return (
    <section className="relative min-h-[92vh] lg:min-h-[96vh] flex items-center justify-center pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden text-center text-cream bg-black">
      {/* 
        Background ambient video scoped strictly to Hero section:
        Plays seamlessly at the start without leaking into any other sections!
      */}
      <BackgroundVideo />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Top Campaign Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-lime/40 rounded-full backdrop-blur-md shadow-xl">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold text-lime tracking-widest uppercase">
            The Third Space × Psychologs · Inaugural Campaign
          </span>
        </div>

        {/* Main Artistic Headline */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-cream leading-[1.1] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            A space to pause, <br />
            <span className="italic font-normal text-lime">express</span> & connect.
          </h1>

          <p className="text-base sm:text-xl text-cream/95 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Telangana&apos;s leading student mental wellness initiative at MLRIT. An open sanctuary to decompress from academic pressure, talk freely about mental health, and express yourself through art.
          </p>
        </div>

        {/* High-Contrast Event Info Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-3 bg-black/70 border border-cream/25 rounded-full backdrop-blur-md shadow-2xl text-xs sm:text-sm text-cream font-medium">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-lime flex-shrink-0" />
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <span className="hidden sm:inline text-cream/40">|</span>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-lime flex-shrink-0" />
            <span className="font-semibold">{UTSAAH_3_EVENT.venue}</span>
          </div>
          <span className="hidden sm:inline text-cream/40">|</span>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-lime flex-shrink-0" />
            <span className="font-semibold">
              {UTSAAH_3_EVENT.startTime} – {UTSAAH_3_EVENT.endTime}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-lime text-forest font-bold text-sm tracking-wider uppercase rounded-sm hover:bg-lime/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(200,228,74,0.35)] group"
          >
            <span>Register for UTSAAH 3.0</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/art-gathering"
            className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-cream font-medium text-sm rounded-sm backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <span>Explore Art Archive</span>
          </Link>
        </div>

        {/* Core Pillars Strip */}
        <div className="pt-12 mt-6 border-t border-cream/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-3 bg-black/50 border border-cream/15 rounded-sm backdrop-blur-sm">
            <p className="font-display text-lg text-cream font-bold">PAUSE</p>
            <p className="text-[11px] text-cream/70 mt-0.5">Slow down & breathe</p>
          </div>
          <div className="p-3 bg-black/50 border border-cream/15 rounded-sm backdrop-blur-sm">
            <p className="font-display text-lg text-lime font-bold">CREATE</p>
            <p className="text-[11px] text-cream/70 mt-0.5">Art & expression</p>
          </div>
          <div className="p-3 bg-black/50 border border-cream/15 rounded-sm backdrop-blur-sm">
            <p className="font-display text-lg text-cream font-bold">CONNECT</p>
            <p className="text-[11px] text-cream/70 mt-0.5">Open peer dialogue</p>
          </div>
          <div className="p-3 bg-black/50 border border-cream/15 rounded-sm backdrop-blur-sm">
            <p className="font-display text-lg text-lime font-bold">BELONG</p>
            <p className="text-[11px] text-cream/70 mt-0.5">A shared sanctuary</p>
          </div>
        </div>
      </div>
    </section>
  );
}
