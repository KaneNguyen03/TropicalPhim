import Link from 'next/link';
import { Play, Star, Clock } from 'lucide-react';
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
}

export function MovieCard({ movie, showProgress, progress = 0, size = 'md' }: MovieCardProps) {
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
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play Button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#CCFF00] rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="h-6 w-6 text-[#0A0A0A] fill-[#0A0A0A]" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-[#FF6B35] text-white border-none">
            {movie.quality}
          </Badge>
          {movie.lang && (
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              {movie.lang}
            </Badge>
          )}
        </div>

        {/* Episode indicator for series */}
        {movie.type === 'series' && (
          <Badge className="absolute top-2 right-2 bg-[#CCFF00] text-[#0A0A0A] border-none">
            <Clock className="h-3 w-3 mr-1" />
            {movie.episode_current}/{movie.episode_total}
          </Badge>
        )}

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
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

          {/* Progress Bar */}
          {showProgress && progress > 0 && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1 bg-white/20" />
              <p className="text-xs text-white/60">{progress}% đã xem</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
