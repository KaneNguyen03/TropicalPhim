import { HeroSlider } from '../components/HeroSlider';
import { MovieCard } from '../components/MovieCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getHomeMovies, getMoviesByList, getMovieDetail } from '../services/ophim';
import type { Movie } from '../data/movies';

export default async function HomePage() {
  const [homeMovies, seriesMovies, animatedMovies] = await Promise.all([
    getHomeMovies(),
    getMoviesByList('phim-bo'),
    getMoviesByList('hoat-hinh'),
  ]);

  const featuredBasic = homeMovies.slice(0, 5);
  const featuredMovies = (await Promise.all(
    featuredBasic.map(m => getMovieDetail(m.slug))
  )).filter(Boolean) as Movie[];
  const newReleases = homeMovies.slice(5, 17);

  const sections = [
    { title: 'Mới Phát Hành', movies: newReleases, link: '/search?filter=new' },
    { title: 'Phim Bộ Nổi Bật', movies: seriesMovies.slice(0, 12), link: '/search?type=series' },
    { title: 'Phim Hoạt Hình', movies: animatedMovies.slice(0, 12), link: '/search?category=hoat-hinh' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Slider */}
      <HeroSlider movies={featuredMovies} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 lg:px-8 py-12 space-y-12">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {section.title}
              </h2>
              <Link
                href={section.link}
                className="flex items-center gap-2 text-[#CCFF00] hover:text-[#CCFF00]/80 transition-colors"
              >
                <span className="text-sm">Xem Tất Cả</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Movie Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {section.movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}
