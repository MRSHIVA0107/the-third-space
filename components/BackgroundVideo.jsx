"use client";

import { useState, useEffect, useRef } from "react";
import { BACKGROUND_VIDEOS } from "@/data/videos";

export function BackgroundVideo({
  scrimClassName = "from-black/45 via-black/25 to-black/60",
  opacity = "opacity-90",
  maxClipDurationSeconds = 20,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextVideo = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
      setIsFading(false);
    }, 400);
  };

  const handleVideoEnded = () => {
    nextVideo();
  };

  // Video playback & rotation management
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy handling
      });
    }

    // Set maximum clip duration timer to ensure continuous variety through all 44 clips
    if (timerRef.current) clearTimeout(timerRef.current);
    if (maxClipDurationSeconds && maxClipDurationSeconds > 0) {
      timerRef.current = setTimeout(() => {
        nextVideo();
      }, maxClipDurationSeconds * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, mounted, maxClipDurationSeconds]);

  if (!mounted || !BACKGROUND_VIDEOS.length) return null;

  const currentVideo = BACKGROUND_VIDEOS[currentIndex];

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* 
        Background ambient video playlist:
        Automatically cycles through all 44 clips in BACKGROUND_VIDEOS continuously.
        No single-video loop attribute, ensuring seamless playlist auto-looping.
      */}
      <video
        ref={videoRef}
        key={currentVideo.id}
        src={currentVideo.src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        className={`w-full h-full object-cover ${opacity} transition-opacity duration-700 ease-in-out ${
          isFading ? "opacity-20" : opacity
        }`}
      />

      {/* 
        Cinematic semi-transparent overlay scrim:
        Protects text readability with subtle vignette while keeping video vivid and clear.
      */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${scrimClassName}`}
      />
    </div>
  );
}
