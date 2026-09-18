"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/gallery";
import { LightboxModal } from "./LightboxModal";

export function GalleryGrid() {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveImageIndex(null);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveImageIndex((prev) =>
      prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div>
      {/* 
        Clean, non-scrollable responsive gallery grid:
        Completely free of cursor hover naming tags/banners for an unobstructed art exhibition view.
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {GALLERY_ITEMS.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleOpenLightbox(index)}
            className="group cursor-pointer relative rounded-sm overflow-hidden border border-sand bg-cream-100 shadow-sm hover:shadow-xl hover:border-forest/50 transition-all duration-300 aspect-[4/5]"
            title="Click to view full photograph"
          >
            {/* Curated art photograph — completely clean without cursor hover tags */}
            <Image
              src={item.src}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Accessible Lightbox Modal */}
      {activeImageIndex !== null && (
        <LightboxModal
          items={GALLERY_ITEMS}
          currentIndex={activeImageIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
