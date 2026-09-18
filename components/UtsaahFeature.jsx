import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";
import { formatEventDate } from "@/lib/utils/formatDate";

export function UtsaahFeature() {
  const formattedDate = formatEventDate(UTSAAH_3_EVENT.eventDate);

  return (
    <section className="py-20 lg:py-28 bg-forest text-cream relative overflow-hidden">
      {/* Background subtle accents */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Header & Event Details */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/20 border border-lime/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-xs font-semibold text-lime uppercase tracking-wider">
                Inaugural Campaign
              </span>
            </div>

            <div>
              <h2 className="font-display text-4xl sm:text-5xl text-cream tracking-tight">
                {UTSAAH_3_EVENT.title}
              </h2>
              <p className="text-lime/90 font-medium text-sm mt-1 uppercase tracking-wide">
                {UTSAAH_3_EVENT.subtitle} · The Third Space × Psychologs
              </p>
            </div>

            <p className="text-cream/80 text-base leading-relaxed font-light max-w-2xl">
              {UTSAAH_3_EVENT.description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-cream/10 border border-cream/15 p-6 rounded-sm space-y-4">
            <p className="text-xs uppercase tracking-widest text-lime font-bold">
              Event Logistics
            </p>
            <div className="space-y-3 text-xs text-cream/90">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-lime flex-shrink-0" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-lime flex-shrink-0" />
                <span className="font-medium">{UTSAAH_3_EVENT.venue}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-lime flex-shrink-0" />
                <span className="font-medium">
                  {UTSAAH_3_EVENT.startTime} — {UTSAAH_3_EVENT.endTime}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3.5 bg-lime text-forest font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-lime/90 transition-all shadow-md group"
              >
                <span>Register for UTSAAH 3.0</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Full-width, perfectly fitted panoramic banner (1920:761 ratio) */}
        <div className="relative w-full aspect-[1920/761] rounded-sm overflow-hidden border-2 border-cream/20 shadow-2xl bg-black/40">
          <Image
            src="/event/utsaah-banner.png"
            alt="UTSAAH 3.0 Banner — The Third Space × Psychologs"
            fill
            sizes="100vw"
            className="object-contain sm:object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
