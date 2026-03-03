import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../components/ui/utils';
import type { Movie } from '../data/movies';
import { Progress } from '../components/ui/progress';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  showProgress?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Index trong grid - dùng cho LCP optimization (index 0-5 = above fold) */
  priority?: boolean;
}

export function MovieCard({ movie, showProgress, progress = 0, size = 'md', priority = false }: MovieCardProps) {
  const sizeClasses = {
    sm: 'aspect-[2/3]',
    md: 'aspect-[2/3]',
    lg: 'aspect-[16/9]'
  };

  return (
    <Link
      href={`/movie/${movie.slug}`}
      className={cn(
        'group relative block rounded-lg overflow-hidden bg-[#171717] transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-[#CCFF00] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:scale-105',
        sizeClasses[size]
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-full">
        <Image
          src={size === 'lg' ? movie.thumb_url : movie.poster_url}
          alt={movie.name}
          fill
          // Priority = true for above-the-fold cards (LCP optimization)
          // Lazy load for remaining cards
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          // quality=65: tiết kiệm ~14% so với default 75, không ảnh hưởng rõ rệt đến UX
          quality={65}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          // Grid layout: 2col(mobile) → 3col(sm:640px) → 4col(md:768px) → 5col(lg:1024px) → 6col(xl:1280px)
          // Container max-w-[1440px] với px-4 lg:px-8
          // Mobile 2col (~50vw - 16px gap), sm 3col (~33vw), md 4col (~25vw), lg 5col (~20vw), xl 6col (~16vw)
          sizes={
            size === 'lg'
              ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
              : '(max-width: 639px) calc(50vw - 24px), (max-width: 767px) calc(33vw - 20px), (max-width: 1023px) calc(25vw - 20px), (max-width: 1279px) calc(20vw - 20px), calc(min(1440px, 100vw) / 6 - 20px)'
          }
          className="object-cover transition-opacity duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#CCFF00] rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="h-6 w-6 text-[#0A0A0A] fill-[#0A0A0A]" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <Badge className="bg-[#CCFF00] hover:bg-[#CCFF00] text-[#0A0A0A] border-none font-bold uppercase shadow-[0_0_10px_rgba(204,255,0,0.3)]">
            {movie.quality}
          </Badge>
          {movie.lang && (
            <Badge variant="secondary" className="bg-black/80 hover:bg-black/80 text-white border-white/10 backdrop-blur-md uppercase text-[10px]">
              {movie.lang}
            </Badge>
          )}
        </div>

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          {movie.type === 'series' && movie.episode_current && (
            <Badge variant="outline" className="bg-black/80 text-[#CCFF00] border-[#CCFF00]/50 backdrop-blur-md text-[10px]">
              {movie.episode_current}
            </Badge>
          )}
          {movie.view && movie.view > 0 ? (
            <Badge variant="outline" className="bg-black/80 text-white border-white/20 backdrop-blur-md text-[10px] gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
              {movie.view.toLocaleString()}
            </Badge>
          ) : null}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2 bg-linear-to-t from-black via-black/80 to-transparent">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[#CCFF00] transition-colors">
            {movie.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>{movie.year}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#CCFF00] text-[#CCFF00]" />
              <span>{movie.tmdb.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Progress Bar (Continue Watching) */}
          {showProgress && progress > 0 && (
            <div className="pt-2 space-y-1.5 border-t border-white/10 mt-2">
              <div className="flex justify-between items-center text-[10px] text-[#CCFF00]">
                <span>Đang xem</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1 lg:h-1.5 [&>div]:bg-[#CCFF00] bg-white/20 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
