'use client';

import { useEffect, useState } from 'react';
import { MovieCard } from './MovieCard';
import { History, X } from 'lucide-react';
import { Button } from './ui/button';
import type { Movie } from '../data/movies';

interface RecentMovie {
  slug: string;
  name: string;
  thumb: string;
  updatedAt: number;
}

export function ContinueWatching() {
  const [recentMovies, setRecentMovies] = useState<RecentMovie[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const recent = JSON.parse(localStorage.getItem('tropicalphim_recent') || '[]');
        if (recent.length > 0) {
          setRecentMovies(recent);
          setIsVisible(true);

          const progress: Record<string, number> = {};
          recent.forEach((m: RecentMovie) => {
            const saved = localStorage.getItem(`tropicalphim_progress_${m.slug}`);
            if (saved) {
              const { time, duration } = JSON.parse(saved);
              if (time && duration) {
                progress[m.slug] = Math.round((time / duration) * 100);
              }
            }
          });
          setProgressMap(progress);
        }
      } catch (e) {
        console.warn("Error loading history:", e);
      }
    };

    loadData();
    // Listen for storage changes (e.g. from other tabs or same tab updates)
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const clearHistory = () => {
    if (confirm('Bạn có chắc muốn xóa lịch sử xem phim?')) {
      recentMovies.forEach(m => localStorage.removeItem(`tropicalphim_progress_${m.slug}`));
      localStorage.removeItem('tropicalphim_recent');
      setRecentMovies([]);
      setIsVisible(false);
    }
  };

  if (!isVisible || recentMovies.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-[#CCFF00]" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Tiếp Tục Xem</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearHistory}
          className="text-white/40 hover:text-red-400 gap-1.5"
        >
          <X className="h-4 w-4" />
          <span className="text-xs">Xóa lịch sử</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {recentMovies.map((movie) => (
          <MovieCard
            key={movie.slug}
            movie={{
              id: movie.slug,
              name: movie.name,
              slug: movie.slug,
              thumb_url: movie.thumb,
              poster_url: movie.thumb,
              origin_name: '',
              description: '',
              type: 'single',
              quality: 'HD',
              lang: '',
              sub: '',
              time: '',
              episode_current: '',
              episode_total: '',
              year: 0,
              view: 0,
              actor: [],
              director: [],
              category: [],
              country: [],
              tmdb: { type: 'movie', id: '', vote_average: 0, vote_count: 0 },
              imdb: { id: '' },
              modified: { time: '' }
            } as Movie}
            showProgress={true}
            progress={progressMap[movie.slug] || 0}
          />
        ))}
      </div>
    </section>
  );
}
