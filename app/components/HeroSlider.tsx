'use client'

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../components/ui/utils';
import type { Movie } from '../data/movies';

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

interface HeroSliderProps {
  movies: Movie[];
}

export function HeroSlider({ movies }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-[#0A0A0A]" suppressHydrationWarning>
      {/* Slides */}
      {movies.map((movie, index) => (
        <div key={movie.id} suppressHydrationWarning>
          <div
            suppressHydrationWarning
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
          {/* Background Image */}
          <div className="absolute inset-0" suppressHydrationWarning>
            <Image
              src={movie.thumb_url}
              alt={movie.name}
              fill
              sizes="100vw"
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              // LCP slide (index 0): quality 75 cho ảnh hero rõ nét
              // Các slide khác: quality 60 - chưa visible, tiết kiệm bandwidth
              quality={index === 0 ? 75 : 60}
              className="object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                <Badge className="bg-[#CCFF00] text-[#0A0A0A] border-none text-sm font-semibold px-3 py-1">
                  {movie.quality}
                </Badge>
                <Badge className="bg-[#FF8C00] text-[#0A0A0A] border-none text-sm font-semibold px-3 py-1">
                  {movie.year}
                </Badge>
                {movie.type === 'series' && movie.episode_total && (
                  <Badge
                    className="border-none text-sm px-3 py-1 text-white"
                    style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
                  >
                    {movie.episode_total?.toLowerCase().includes('tập') ? movie.episode_total : `${movie.episode_total} Tập`}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {movie.name}
              </h2>

              {/* Origin Name */}
              <p className="text-xl md:text-2xl text-white/70 italic">
                {movie.origin_name}
              </p>

              {/* Description */}
              <p className="text-base md:text-lg text-white/80 line-clamp-3 max-w-xl">
                {stripHtml(movie.description)}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>{movie.time}</span>
                {movie.tmdb && movie.tmdb.vote_average && (
                  <>
                    <span>•</span>
                    <span>⭐ {movie.tmdb.vote_average.toFixed(1)}</span>
                  </>
                )}
                {movie.category && movie.category.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{movie.category.map(c => c.name).join(', ')}</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] font-semibold"
                >
                  <Link href={`/movie/${movie.slug}`}>
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    XEM NGAY
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  <Link href={`/movie/${movie.slug}`}>
                    <Info className="mr-2 h-5 w-5" />
                    CHI TIẾT
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      {/* Dùng transform: scaleX() thay vì width transition để GPU-composited
          Kỹ thuật: outer div cố định w-8, inner div scale 0.25→1 từ origin-left
          → Kết quả thị giác: 8px (inactive) ↔ 32px (active), không gây layout recalc */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="p-2 outline-none group flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Outer: fixed w-8 container — Inner: GPU-composited scaleX transform */}
            <div className="w-8 h-1.5 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full w-full rounded-full transition-transform duration-300 origin-left',
                  index === currentIndex
                    ? 'scale-x-100 bg-[#CCFF00]'
                    : 'scale-x-[0.25] bg-white/50 group-hover:bg-white/70'
                )}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
