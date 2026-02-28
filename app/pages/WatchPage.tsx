import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MovieCard } from '../components/MovieCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { getMovieDetail, getMoviesByList } from '../services/ophim';
import type { Movie } from '../data/movies';
import { WatchEpisodeList } from '../components/WatchEpisodeList';

export default async function WatchPage({ slug, episodeSlug }: { slug: string; episodeSlug?: string }) {
  const movie = await getMovieDetail(slug);
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Không tìm thấy phim</h1>
          <Button asChild>
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentEpisode = episodeSlug 
    ? movie.episodes?.find(server => server.server_data.find(ep => ep.slug === episodeSlug))?.server_data.find(ep => ep.slug === episodeSlug) 
      || movie.episodes?.[0]?.server_data[0]
    : movie.episodes?.[0]?.server_data[0] || null;

  // Fetch some related movies based on the first category if available
  let relatedMovies: Movie[] = [];
  if (movie.category && movie.category.length > 0) {
    relatedMovies = await getMoviesByList(movie.category[0].slug);
    relatedMovies = relatedMovies.filter(m => m.id !== movie.id).slice(0, 6);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="container mx-auto">
          {/* Back Button */}
          <div className="px-4 py-4">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-[#CCFF00] hover:bg-white/10"
            >
              <Link href={`/movie/${movie.slug}`}>
                <ChevronLeft className="mr-2 h-5 w-5" />
                Quay lại
              </Link>
            </Button>
          </div>

          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer 
              episode={currentEpisode || null} 
              movieName={movie.name} 
              movieSlug={movie.slug}
              thumbUrl={movie.thumb_url} 
            />
          </div>

          {/* Movie Info Below Player */}
          <div className="px-4 py-6 border-t border-white/10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#CCFF00] text-[#0A0A0A]">
                    {movie.quality}
                  </Badge>
                  <Badge className="bg-[#FF6B35] text-white">
                    {movie.year}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {movie.name}
                  {currentEpisode && (
                    <span className="text-[#CCFF00] ml-3">• {currentEpisode.name}</span>
                  )}
                </h1>
                <p className="text-white/70">{movie.origin_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes & Related Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Episodes List & Servers - Extracted to Client Component */}
        {movie.type === 'series' && movie.episodes && movie.episodes.length > 0 && (
          <WatchEpisodeList 
             episodesGroups={movie.episodes} 
             movieSlug={movie.slug} 
             currentEpisodeSlug={episodeSlug || currentEpisode?.slug || ''} 
          />
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Phim Tương Tự</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <MovieCard key={relatedMovie.id} movie={relatedMovie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
