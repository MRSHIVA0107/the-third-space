"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function LightboxModal({ items, currentIndex, onClose, onPrev, onNext }) {
  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onPrev, onNext]);

  if (!currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-cream hover:text-lime transition-colors bg-ink/60 rounded-full z-50 focus:outline-none focus:ring-2 focus:ring-lime"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 p-2 sm:p-3 text-cream hover:text-lime transition-colors bg-ink/60 rounded-full z-50 focus:outline-none focus:ring-2 focus:ring-lime"
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Image & Caption container */}
      <div
        className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[75vh]">
          <Image
            src={currentItem.src}
            alt={currentItem.caption}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="mt-4 text-center max-w-2xl px-4">
          <span className="text-xs uppercase font-semibold text-lime tracking-widest">
            {currentItem.category} · {currentIndex + 1} of {items.length}
          </span>
          <p className="text-sm text-cream/90 mt-1 font-light">
            {currentItem.caption}
          </p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 p-2 sm:p-3 text-cream hover:text-lime transition-colors bg-ink/60 rounded-full z-50 focus:outline-none focus:ring-2 focus:ring-lime"
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
