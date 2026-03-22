'use client'

import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import type { Movie } from '@/app/data/movies';
import { useHeroSlider } from '@/app/hooks/useHeroSlider';

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── EpisodeBadge ─────────────────────────────────────────────────────────────

interface EpisodeBadgeProps {
  episodeTotal: string;
}

function EpisodeBadge({ episodeTotal }: EpisodeBadgeProps) {
  const label = episodeTotal.toLowerCase().includes('tập')
    ? episodeTotal
    : `${episodeTotal} Tập`;

  return (
    <Badge className="border-none px-2.5 py-0.5 text-white/80 text-xs backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
      {label}
    </Badge>
  );
}

// ─── ProgressDot ──────────────────────────────────────────────────────────────

interface ProgressDotProps {
  index: number;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}

function ProgressDot({ index, isActive, progress, onClick }: ProgressDotProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Slide ${index + 1}`}
      style={{ width: isActive ? 32 : 18, transition: 'width 0.35s ease' }}
      className="h-5 flex items-center justify-center group"
    >
      <div className={cn(
        'rounded-full w-full transition-all duration-300',
        isActive ? 'h-[4px] bg-white/30' : 'h-[3px] bg-white/20 group-hover:bg-white/50'
      )}>
        {isActive && (
          <div
            className="h-full rounded-full bg-[#CCFF00]"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </button>
  );
}

// ─── SlideContent ─────────────────────────────────────────────────────────────

interface SlideContentProps {
  movie: Movie;
  isVisible: boolean;
}

const SlideContent = memo(function SlideContent({ movie, isVisible }: SlideContentProps) {
  const hasRating = (movie.tmdb?.vote_average ?? 0) > 0;
  const hasCategories = (movie.category?.length ?? 0) > 0;
  const description = movie.description;

  return (
    <div
      className={cn(
        'transition-all duration-700 ease-out flex flex-col items-center md:items-start text-center md:text-left',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      {/* Badge row */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3.5">
        <Badge className="bg-[#CCFF00] text-[#0A0A0A] border-none font-bold px-2.5 py-0.5 text-[11px] uppercase tracking-widest hidden sm:inline-flex">
          {movie.quality}
        </Badge>
        <Badge className="bg-[#FF8C00]/90 text-[#0A0A0A] border-none font-semibold px-2.5 py-0.5 text-[11px]">
          {movie.year}
        </Badge>
        {movie.type === 'series' && movie.episode_total && (
          <EpisodeBadge episodeTotal={movie.episode_total} />
        )}
        {movie.lang && (
          <Badge className="border border-white/20 bg-transparent text-white/60 text-[11px] px-2.5 py-0.5">
            {movie.lang}
          </Badge>
        )}
      </div>

      {/* Title - Fixed weight to bold (700) to ensure full Vietnamese glyph support, normal tracking */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold text-white leading-[1.1] mb-2.5 drop-shadow-2xl">
        {movie.name}
      </h2>

      {/* Original title */}
      {movie.origin_name && (
        <p className="text-sm text-white/45 italic mb-3 font-medium tracking-wide">
          {movie.origin_name}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-[13px] text-white/50 mb-4">
        {movie.time && <span className="font-medium">{movie.time}</span>}
        {hasRating && (
          <>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="h-3 w-3 fill-current" />
              {movie.tmdb!.vote_average.toFixed(1)}
            </span>
          </>
        )}
        {hasCategories && (
          <>
            <span className="text-white/20">·</span>
            <span className="text-white/45">
              {movie.category!.slice(0, 2).map((c) => c.name).join(' · ')}
            </span>
          </>
        )}
      </div>

      {/* Description - Hidden on very small screens to save space, visible on tablet+ */}
      {description && (
        <p className="text-[13.5px] md:text-[14px] leading-relaxed text-white/65 line-clamp-3 md:line-clamp-4 max-w-[480px] mb-6 hidden sm:block">
          {description}
        </p>
      )}

      {/* CTA */}
      <div className="flex items-center justify-center md:justify-start gap-3 mt-2 sm:mt-0">
        <Button
          asChild
          size="lg"
          className="bg-white hover:bg-white/90 text-[#0A0A0A] font-bold text-[13px] px-6 sm:px-7 h-11 md:h-12 shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.97] rounded-md"
        >
          <Link href={`/movie/${movie.slug}`} prefetch={false}>
            <Play className="mr-2 h-4 w-4 fill-current" />
            Xem Ngay
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          className="bg-white/15 hover:bg-white/25 text-white font-semibold text-[13px] px-5 sm:px-6 h-11 md:h-12 backdrop-blur-md border-0 transition-all hover:scale-[1.03] active:scale-[0.97] rounded-md"
        >
          <Link href={`/movie/${movie.slug}`} prefetch={false}>
            <Info className="mr-2 h-4 w-4" />
            Chi Tiết
          </Link>
        </Button>
      </div>
    </div>
  );
});

// ─── PosterCard ───────────────────────────────────────────────────────────────

interface PosterCardProps {
  movie: Movie;
  isActive: boolean;
  isPriority: boolean;
  className?: string;
}

export function PosterCard({ movie, isActive = true, isPriority = false, className }: PosterCardProps) {

  const posterSafe = movie.poster_url && !movie.poster_url.includes('undefined') ? movie.poster_url : '';
  const thumbSafe = movie.thumb_url && !movie.thumb_url.includes('undefined') ? movie.thumb_url : '';
  const imageSrc = posterSafe || thumbSafe || '/file.svg';

  return (
    <div
      className={cn(
        'group relative w-full aspect-2/3 transition-all duration-700 ease-out origin-bottom',
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        className
      )}
    >
      {/* 1. Glow Effect (Border phát sáng nhẹ khi hover) */}
      <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-[#CCFF00]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      {/* 2. Poster Container */}
      <div className="relative h-full w-full overflow-hidden rounded-xl shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:-translate-y-2">
        <Image
          src={imageSrc}
          alt={movie.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          loading={isPriority ? 'eager' : 'lazy'}
          priority={isPriority}
          unoptimized
          className="object-cover transform transition-transform duration-700 group-hover:scale-110"
        />

        {/* 3. Lighting Overlay (Cinema feel) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        
        {/* 4. Glossy Highlight (Hiệu ứng mặt gương nhẹ ở góc) */}
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

interface HeroSliderProps {
  movies: Movie[];
}

export function HeroSlider({ movies }: HeroSliderProps) {
  const { currentIndex, progress, goToNext, goToPrev, goToSlide } = useHeroSlider({
    count: movies.length,
  });

  const currentMovie = movies[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      // Full height on mobile (100dvh handles Safari bottom bar), clamped on desktop
      style={{ height: 'min(100dvh - 64px, 860px)', minHeight: '600px' }}
      suppressHydrationWarning
    >
      {/* ── Dynamic blurred backdrop ── */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1200',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden
        >
          {/* Ambient blurred backdrop */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={
                (movie.poster_url && !movie.poster_url.includes('undefined') ? movie.poster_url : '') ||
                (movie.thumb_url && !movie.thumb_url.includes('undefined') ? movie.thumb_url : '') ||
                '/file.svg'
              }
              alt=""
              fill
              sizes="100vw"
              loading={index === 0 ? 'eager' : 'lazy'}
              unoptimized
              className="object-cover blur-[22px] md:blur-[36px] scale-110 md:scale-125 opacity-45 md:opacity-60 transition-transform duration-[12s] ease-linear"
              style={{ transform: index === currentIndex ? 'scale(1.22)' : 'scale(1.12)' }}
            />
          </div>

          {/* Overlays for readability */}
          {/* Mobile: very dark overlay for contrast. Desktop: dark on left, subtle on right */}
          <div className="absolute inset-0 bg-[#0A0A0A]/45 md:bg-[#0A0A0A]/28" />

          {/* Desktop Left-to-right cinematic shadow */}
          <div className="hidden md:block absolute inset-0 bg-linear-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/50 to-transparent" />

          {/* Mobile Bottom-to-top strong shadow to support centered text */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A]/70 md:via-[#0A0A0A]/10 to-transparent" />

          {/* Top blend for header */}
          <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A]/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Main content: Responsive layout ── */}
      {/* Adding pb-24 on mobile prevents CTA buttons from being hidden behind the bottom tab bar */}
      <div className="relative z-10 h-full flex flex-col justify-center pt-8 md:pt-0 pb-24 md:pb-0">
        <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-center">
          
          <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-6 md:gap-8 lg:gap-16">

            {/* Left/Bottom: Text content */}
            <div className="flex-1 w-full min-w-0 max-w-full md:max-w-140 z-20">
              {currentMovie && (
                <SlideContent
                  movie={currentMovie}
                  isVisible={true}
                />
              )}
            </div>

            {/* Right/Top: Poster stack */}
            {/* On mobile: Poster is prominently centered on top. On desktop: pushed to right */}
            <div
              className="relative shrink-0 flex items-center justify-center w-[58vw] sm:w-[45vw] md:w-[320px] lg:w-95 xl:w-110 2xl:w-120 shadow-2xl"
              style={{ aspectRatio: '2/3', maxHeight: '70vh' }}
            >
              <div className="absolute inset-0">
                {movies.map((movie, index) => (
                  <div
                    key={movie.id}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-700',
                      index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    )}
                  >
                    <PosterCard
                      movie={movie}
                      isActive={index === currentIndex}
                      isPriority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        onClick={goToPrev}
        aria-label="Slide trước"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Slide tiếp theo"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* ── Bottom bar: dots + slide info ── */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {movies.map((_, index) => (
          <ProgressDot
            key={index}
            index={index}
            isActive={index === currentIndex}
            progress={progress}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
