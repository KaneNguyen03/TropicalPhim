'use client'

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseHeroSliderOptions {
  /** Total number of slides. */
  count: number;
  /** How long (ms) each slide stays before auto-advancing. Default: 6000 */
  slideDuration?: number;
}

interface UseHeroSliderReturn {
  currentIndex: number;
  /** Autoplay progress for the active slide (0–100). */
  progress: number;
  goToNext: () => void;
  goToPrev: () => void;
  goToSlide: (index: number) => void;
}

export function useHeroSlider({
  count,
  slideDuration = 6_000,
}: UseHeroSliderOptions): UseHeroSliderReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Ref keeps autoplay state without triggering re-renders.
  const isAutoPlayingRef = useRef(true);
  // Holds the active RAF handle so the cleanup can cancel it precisely.
  const rafHandleRef = useRef<ReturnType<typeof requestAnimationFrame>>(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
    setProgress(0);
  }, [count]);

  const goToNext = useCallback(() => {
    // Manually going forward resumes autoplay.
    isAutoPlayingRef.current = true;
    advance();
  }, [advance]);

  const goToPrev = useCallback(() => {
    isAutoPlayingRef.current = false;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
    setProgress(0);
  }, [count]);

  const goToSlide = useCallback((index: number) => {
    isAutoPlayingRef.current = false;
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isAutoPlayingRef.current) return;

    // Capture the timestamp at the moment the effect runs (not inside tick)
    // so we measure elapsed correctly against the RAF timestamp.
    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);

      setProgress(pct);

      if (pct < 100) {
        rafHandleRef.current = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };

    rafHandleRef.current = requestAnimationFrame(tick);

    // Cleanup: cancel any pending frame on unmount OR when currentIndex changes.
    return () => cancelAnimationFrame(rafHandleRef.current);
  }, [currentIndex, slideDuration, advance]);

  return { currentIndex, progress, goToNext, goToPrev, goToSlide };
}
