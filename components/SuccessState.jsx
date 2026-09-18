"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Calendar, MapPin, Clock, Copy, Check, Printer, Sparkles, Heart } from "lucide-react";
import { UTSAAH_3_EVENT } from "@/data/event";
import { formatEventDate } from "@/lib/utils/formatDate";

export function SuccessState({ registrationId, fullName }) {
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);
  const formattedDate = formatEventDate(UTSAAH_3_EVENT.eventDate);

  // Generate festive celebration particles in UTSAAH palette (lime, forest, gold, cream)
  useEffect(() => {
    const colors = ["#C8E44A", "#1C3325", "#F6F4EE", "#E5B94E", "#88D49E"];
    const newParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: Math.floor(Math.random() * 8) + 6,
      left: Math.floor(Math.random() * 95) + 2.5,
      delay: Math.random() * 0.8,
      duration: Math.random() * 1.5 + 2,
      rotation: Math.floor(Math.random() * 360),
      drift: (Math.random() - 0.5) * 80,
    }));
    setParticles(newParticles);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="relative overflow-hidden bg-cream-100 border-2 border-lime/50 rounded-sm p-6 sm:p-10 text-center shadow-2xl animate-fade-in">
      {/* 
        Artistic Themed Confetti Particles (Canvas & Paint Splash Celebration):
        Bursting in UTSAAH signature colors (Lime, Forest Green, Gold, Cream)
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full opacity-80 animate-ping"
            style={{
              backgroundColor: p.color,
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              animationIterationCount: 2,
            }}
          />
        ))}
      </div>

      {/* Top Animated Sanctuary Badge */}
      <div className="relative z-10 space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center text-lime shadow-lg ring-8 ring-lime/20 animate-bounce">
            <CheckCircle2 size={44} className="text-lime" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-lime" />
          </span>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-forest">
            <Sparkles size={12} className="text-forest" />
            <span>Official Event Registration Confirmed</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-ink leading-tight pt-1">
            You&apos;re In, <span className="text-forest italic">{fullName.split(" ")[0]}!</span>
          </h2>

          <p className="text-xs sm:text-sm text-ink/75 max-w-lg mx-auto font-light leading-relaxed">
            Your registration for <strong>UTSAAH 3.0</strong> is successfully recorded in the attendee roster. A sanctuary to pause, express through art, and connect awaits you.
          </p>
        </div>

        {/* 
          Official UTSAAH 3.0 Student Admit Pass:
          Features the event-relevant sequential ID (UTSAAH3-XXX) with copy & print support
        */}
        <div className="my-6 max-w-md mx-auto bg-forest text-cream rounded-sm p-6 sm:p-8 shadow-2xl border-2 border-lime/40 text-left relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-lime/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-cream/20 pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-lime font-bold">
                Student Admit Pass
              </span>
              <p className="font-display text-sm text-cream font-bold">UTSAAH 3.0 · MLRIT</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-cream/60">Collaborator</span>
              <p className="text-xs font-semibold text-lime">Psychologs</p>
            </div>
          </div>

          {/* Sequential Registration ID Display */}
          <div className="text-center py-2 bg-black/30 rounded-sm border border-cream/15 my-3">
            <p className="text-[10px] uppercase tracking-widest text-cream/60 font-medium">
              Your Sequential Event ID
            </p>
            <p className="font-mono text-3xl sm:text-4xl font-bold tracking-widest text-lime mt-1 drop-shadow-md">
              {registrationId}
            </p>
          </div>

          <div className="space-y-2 text-xs text-cream/85 pt-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-lime flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-lime flex-shrink-0" />
              <span>{UTSAAH_3_EVENT.startTime} – {UTSAAH_3_EVENT.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-lime flex-shrink-0" />
              <span>{UTSAAH_3_EVENT.venue}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-cream/15 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream/10 hover:bg-cream/20 rounded-sm text-xs font-semibold text-cream transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-lime" />
                  <span className="text-lime">ID Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy ID</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime text-forest rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-lime/90 transition-colors shadow-sm"
            >
              <Printer size={13} />
              <span>Save / Print Pass</span>
            </button>
          </div>
        </div>

        {/* Reminder note */}
        <p className="text-[11px] text-muted italic">
          Please keep a screenshot or copy of your Event ID ({registrationId}) for check-in on event day.
        </p>

        {/* Return Button */}
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/"
            className="px-7 py-3 bg-forest text-cream text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all shadow-md hover:scale-105"
          >
            Return to Homepage
          </Link>
          <Link
            href="/art-gathering"
            className="px-7 py-3 bg-cream border border-sand text-ink text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-sand/30 transition-colors"
          >
            Explore Art Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
