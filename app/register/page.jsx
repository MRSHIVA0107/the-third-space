import { RegistrationForm } from "@/components/RegistrationForm";
import { UTSAAH_3_EVENT, REGISTRATION_ELIGIBILITY } from "@/data/event";
import { formatEventDate } from "@/lib/utils/formatDate";
import { getEventSettings } from "@/lib/db";
import { Calendar, MapPin, Clock, ShieldCheck, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Register — UTSAAH 3.0 | The Third Space",
  description:
    "Register for UTSAAH 3.0 on 19 September 2026 at MLRIT Auditorium. A mental health and creative expression campaign by The Third Space × Psychologs.",
};

export default async function RegisterPage() {
  const formattedDate = formatEventDate(UTSAAH_3_EVENT.eventDate);
  const eventSettings = await getEventSettings("utsaah-3");

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Event Context & Highlights */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-forest/70">
                Official Registration
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-ink mt-1">
                UTSAAH 3.0
              </h1>
              <p className="text-xs font-semibold text-forest uppercase tracking-wider mt-1">
                Mental Health Awareness Campaign
              </p>
            </div>

            <p className="text-sm text-ink/80 leading-relaxed font-light">
              Join us for an immersive day of thought-provoking conversations, an inspiring
              expert keynote by psychologist Mr. John Hemanth Kumar, and creative art sessions.
            </p>

            {/* Event Key Facts */}
            <div className="bg-cream-100/90 border border-sand rounded-sm p-6 space-y-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-forest">
                Event Logistics
              </p>

              <div className="space-y-3 text-xs text-ink/80">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-forest flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-forest flex-shrink-0" />
                  <span>{UTSAAH_3_EVENT.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-forest flex-shrink-0" />
                  <span>{UTSAAH_3_EVENT.startTime} — {UTSAAH_3_EVENT.endTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartHandshake size={16} className="text-forest flex-shrink-0" />
                  <span>{REGISTRATION_ELIGIBILITY.message}</span>
                </div>
              </div>
            </div>

            {/* Quick Note */}
            <div className="p-4 bg-forest/5 border border-forest/15 rounded-sm flex items-start gap-3">
              <ShieldCheck size={18} className="text-forest flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink/70 leading-relaxed">
                Registration confirmation with your official sequential <strong>UTSAAH3-XXX</strong> ID will be
                generated immediately upon form submission. Save it for event entry.
              </p>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7">
            <RegistrationForm eventSettings={eventSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}
