"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BACKGROUND_VIDEOS } from "@/data/videos";

/**
 * Generates a randomly shuffled array of indices [0 ... length - 1]
 * using the Fisher-Yates algorithm. If excludeFirstIndex is provided,
 * ensures the first item of the new shuffle does not match the previous video.
 */
function createShuffledIndices(length, excludeFirstIndex = -1) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Prevent back-to-back duplicate clip on reshuffle
  if (excludeFirstIndex >= 0 && indices.length > 1 && indices[0] === excludeFirstIndex) {
    const swapTarget = Math.floor(Math.random() * (indices.length - 1)) + 1;
    [indices[0], indices[swapTarget]] = [indices[swapTarget], indices[0]];
  }

  return indices;
}

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
  const playlistRef = useRef([]);
  const playlistPositionRef = useRef(0);

  // Initialize randomized playlist on client mount
  useEffect(() => {
    if (BACKGROUND_VIDEOS.length > 0) {
      const initialShuffle = createShuffledIndices(BACKGROUND_VIDEOS.length);
      playlistRef.current = initialShuffle;
      playlistPositionRef.current = 0;
      setCurrentIndex(initialShuffle[0]);
    }
    setMounted(true);
  }, []);

  // Advance to next video in shuffled playlist
  const nextVideo = useCallback(() => {
    if (!BACKGROUND_VIDEOS.length) return;

    setIsFading(true);
    setTimeout(() => {
      let nextPos = playlistPositionRef.current + 1;
      let playlist = playlistRef.current;

      // When the entire shuffled playlist has played through, generate a fresh shuffle
      if (nextPos >= playlist.length) {
        const lastClipIndex = playlist[playlist.length - 1];
        playlist = createShuffledIndices(BACKGROUND_VIDEOS.length, lastClipIndex);
        playlistRef.current = playlist;
        nextPos = 0;
      }

      playlistPositionRef.current = nextPos;
      setCurrentIndex(playlist[nextPos]);
      setIsFading(false);
    }, 400);
  }, []);

  const handleVideoEnded = () => {
    nextVideo();
  };

  // Video playback & rotation management
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay handling
      });
    }

    // Set clip rotation timer to ensure constant variety across all 44 clips
    if (timerRef.current) clearTimeout(timerRef.current);
    if (maxClipDurationSeconds && maxClipDurationSeconds > 0) {
      timerRef.current = setTimeout(() => {
        nextVideo();
      }, maxClipDurationSeconds * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, mounted, maxClipDurationSeconds, nextVideo]);

  if (!mounted || !BACKGROUND_VIDEOS.length) return null;

  const currentVideo = BACKGROUND_VIDEOS[currentIndex] || BACKGROUND_VIDEOS[0];

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* 
        Background ambient video playlist:
        Always shuffled dynamically across all 44 clips.
        Re-shuffles on every loop without consecutive repeats.
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
        onError={() => nextVideo()}
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
