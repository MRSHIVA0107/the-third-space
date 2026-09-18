import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GALLERY_ITEMS } from "@/data/gallery";

export function MetamorphosisPreview() {
  // Select 4 high-impact preview photographs
  const previewItems = GALLERY_ITEMS.slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-cream border-t border-sand/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-forest">
              Community Exhibition Archive
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink mt-1">
              Metamorphosis <span className="italic text-forest">Edition I</span>
            </h2>
            <p className="text-sm sm:text-base text-muted mt-2 max-w-xl font-light">
              Memories, student artworks, and shared conversations from our inaugural Art Gathering held on 16 March 2026.
            </p>
          </div>

          <Link
            href="/art-gathering"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-cream text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-forest/90 transition-all shadow-sm group self-start md:self-auto"
          >
            <span>View All 29 Artworks & Moments</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-item clean non-scrollable grid with all naming tag overlays removed */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {previewItems.map((item) => (
            <Link
              key={item.id}
              href="/art-gathering"
              className="group relative rounded-sm overflow-hidden border border-sand bg-cream-100 block shadow-sm hover:shadow-xl hover:border-forest/50 transition-all duration-300 aspect-[4/5]"
              title="Explore in Art Gathering Archive"
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
