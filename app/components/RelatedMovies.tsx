/**
 * RelatedMovies — Server Component
 *
 * Deliberately separated from WatchPage so it can be wrapped in <Suspense>
 * independently. getMoviesByCategory is called here instead of blocking the
 * parent render, enabling Next.js to stream the critical path (player + info)
 * before this component resolves.
 */
import { getMoviesByCategory } from '@/app/services/ophim';
import { MovieCard } from '@/app/components/MovieCard';

interface RelatedMoviesProps {
  categorySlug: string;
  currentMovieId: string;
}

export default async function RelatedMovies({
  categorySlug,
  currentMovieId,
}: RelatedMoviesProps) {
  const movies = await getMoviesByCategory(categorySlug);
  const filtered = movies.filter((m) => m.id !== currentMovieId).slice(0, 6);

  if (filtered.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Phim Tương Tự</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
