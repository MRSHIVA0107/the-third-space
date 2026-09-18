import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Clock, Sparkles, Award, CheckCircle2 } from "lucide-react";
import { getAllEvents } from "@/lib/db";
import { formatEventDate } from "@/lib/utils/formatDate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events & Archives | The Third Space",
  description:
    "Explore upcoming campaigns, teaser announcements, and past gatherings with event memories hosted by The Third Space at MLRIT.",
};

export default async function EventsPage() {
  const allEvents = await getAllEvents();

  const activeEvents = allEvents.filter((e) => e.status === "active");
  const teaserEvents = allEvents.filter((e) => e.status === "teaser");
  const pastEvents = allEvents.filter((e) => e.status === "completed");

  return (
    <div className="pt-28 pb-20 text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full text-xs font-semibold text-forest">
            <Sparkles size={13} />
            <span>Community Calendar & Permanent Archive</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-ink">
            Community Events & Memories
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto font-light">
            From our flagship mental health awareness campaigns to creative gatherings and past success stories.
          </p>
        </div>

        {/* 1. Featured Active Event(s) */}
        {activeEvents.length > 0 && (
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-forest flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse" />
              <span>Current Featured Campaign</span>
            </span>

            <div className="space-y-8">
              {activeEvents.map((evt) => {
                const formattedDate = evt.eventDate ? formatEventDate(evt.eventDate) : "Event Date TBA";
                return (
                  <div
                    key={evt.id || evt.slug}
                    className="bg-cream-100 border border-sand rounded-sm p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center shadow-md hover:border-forest/40 transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/10 border border-forest/20 rounded-full text-xs font-semibold text-forest">
                        <span>{evt.collaboration || "The Third Space MLRIT"}</span>
                      </div>

                      <h2 className="font-display text-3xl sm:text-4xl text-ink">
                        {evt.title}
                      </h2>
                      <p className="text-xs font-semibold text-forest uppercase tracking-wider">
                        {evt.subtitle}
                      </p>
                      <p className="text-sm text-ink/80 leading-relaxed font-light">
                        {evt.description}
                      </p>

                      <div className="space-y-2 py-3 border-y border-sand/60 text-xs text-ink/70">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-forest flex-shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-forest flex-shrink-0" />
                          <span>{evt.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={15} className="text-forest flex-shrink-0" />
                          <span>{evt.startTime} — {evt.endTime}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href="/register"
                          className="px-7 py-3 bg-forest text-cream text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all shadow-sm hover:scale-105"
                        >
                          Register for Event
                        </Link>
                        <Link
                          href={`/events/${evt.slug}`}
                          className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
                        >
                          <span>Full Schedule & Keynote</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>

                    <div className="relative aspect-[16/9] sm:aspect-[1920/860] w-full rounded-sm overflow-hidden border border-sand bg-black/5 shadow-inner">
                      <Image
                        src={evt.banner}
                        alt={`${evt.title} Campaign Banner`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Upcoming Teaser Announcements */}
        {teaserEvents.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-forest flex items-center gap-2">
                <Sparkles size={14} className="text-forest" />
                <span>Upcoming Gatherings & Teaser Announcements</span>
              </span>
              <span className="text-[11px] text-muted">Generated by Club Administration</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {teaserEvents.map((evt) => (
                <div
                  key={evt.id || evt.slug}
                  className="bg-cream-100 border border-sand rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/8] w-full bg-black/10">
                    <Image
                      src={evt.banner}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-sm border border-lime/40 text-lime text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Teaser Preview
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-muted">
                        {evt.eventDate || "Date to be announced"}
                      </span>
                      <h3 className="font-display text-2xl text-ink mt-0.5">{evt.title}</h3>
                      <p className="text-xs font-semibold text-forest uppercase">{evt.subtitle}</p>
                      <p className="text-xs text-ink/75 mt-2 leading-relaxed font-light">
                        {evt.teaserSummary || evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-sand/60 flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-forest" />
                        <span>{evt.venue}</span>
                      </div>
                      <span className="text-forest font-semibold text-[11px] uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Past Events, Success Stories & Memories Archive */}
        <div className="space-y-6 pt-6 border-t border-sand">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted mb-1">
              <Award size={14} className="text-forest" />
              <span>Past Events Archive · Memories & Success Stories</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">
              Preserved Community Gatherings
            </h2>
            <p className="text-xs text-muted mt-1">
              Every completed gathering is permanently archived with its attendee impact, success story, and memories.
            </p>
          </div>

          <div className="space-y-8">
            {pastEvents.map((evt) => {
              const formattedDate = evt.eventDate ? formatEventDate(evt.eventDate) : "16 March 2026";
              return (
                <div
                  key={evt.id || evt.slug}
                  className="bg-cream-100/70 border border-sand rounded-sm p-6 sm:p-10 space-y-6 shadow-sm"
                >
                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-sand/40 border border-sand rounded-full text-xs font-medium text-muted">
                        <CheckCircle2 size={12} className="text-forest" />
                        <span>Completed Gathering · {formattedDate}</span>
                      </div>

                      <h3 className="font-display text-3xl text-ink">
                        {evt.title}
                      </h3>
                      <p className="text-xs font-semibold text-forest uppercase tracking-wider">
                        {evt.subtitle}
                      </p>
                      <p className="text-sm text-ink/75 leading-relaxed font-light">
                        {evt.description}
                      </p>

                      {/* Success Story Box */}
                      {evt.successStory && (
                        <div className="p-5 bg-cream border border-sand/80 rounded-sm space-y-3 mt-4 shadow-sm">
                          <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>Success Story: {evt.successStory.headline}</span>
                          </div>
                          <p className="text-xs text-ink/80 leading-relaxed font-light">
                            {evt.successStory.summary}
                          </p>

                          {/* Impact Metrics */}
                          {evt.successStory.metrics && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                              {evt.successStory.metrics.map((m, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-cream-100 rounded-sm text-center border border-sand/60"
                                >
                                  <p className="font-display text-lg font-bold text-forest">{m.value}</p>
                                  <p className="text-[10px] uppercase text-muted tracking-wider">{m.label}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-4">
                        <Link
                          href="/art-gathering"
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest hover:underline"
                        >
                          <span>Browse 29 Artworks in Gallery</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Memory Photos Collage */}
                    <div className="md:col-span-5 space-y-3">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted block">
                        Event Photo Memories
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {(evt.successStory?.memories || [
                          "/gallery/IMG_20260316_115638.jpg",
                          "/gallery/IMG-20260316-WA0023.jpg",
                          "/gallery/IMG-20260316-WA0070.jpg",
                          "/gallery/IMG-20260316-WA0032.jpg",
                        ]).slice(0, 4).map((imgSrc, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-sm overflow-hidden border border-sand bg-sand/20 group"
                          >
                            <Image
                              src={imgSrc}
                              alt={`${evt.title} memory ${i + 1}`}
                              fill
                              sizes="(max-width: 768px) 50vw, 200px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
