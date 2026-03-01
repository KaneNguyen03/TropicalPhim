'use client';

import { Suspense, useLayoutEffect, use } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { MovieCard } from '../components/MovieCard';
import { ContinueWatching } from '../components/ContinueWatching';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Movie } from '../data/movies';
import { SpotlightCard } from '../components/react-bits/SpotlightCard';

interface HomePageProps {
  dataPromise: Promise<[Movie[], Movie[], Movie[], Movie[]]>;
}

export default function HomePage({ dataPromise }: HomePageProps) {
  // Đồng bộ UI client-side theo chuẩn React 19
  useLayoutEffect(() => {
    // Client-side UI sync logic if any
  }, []);

  // Sử dụng use() hook để unwrap promise data theo chuẩn React 19
  const [homeMovies, seriesMovies, animatedMovies, featuredMovies] = use(dataPromise);

  const newReleases = homeMovies.slice(5, 17);

  const sections = [
    { title: 'Mới Phát Hành', movies: newReleases, link: '/search?filter=new' },
    { title: 'Phim Bộ Nổi Bật', movies: seriesMovies.slice(0, 12), link: '/search?type=series' },
    { title: 'Phim Hoạt Hình', movies: animatedMovies.slice(0, 12), link: '/search?category=hoat-hinh' }
  ];

  return (
    <div className="w-full bg-[#0A0A0A] flex flex-col items-center">
      <h1 className="sr-only">TropicalPhim — Xem Phim Trực Tuyến Miễn Phí HD Vietsub Thuyết Minh</h1>
      
      {/* Hero Slider - full width */}
      <div className="w-full max-w-[2560px] mx-auto">
        <Suspense fallback={
          <div className="relative w-full h-[70vh] md:h-[80vh] bg-[#0A0A0A] animate-pulse" />
        }>
          <HeroSlider movies={featuredMovies} />
        </Suspense>
      </div>

      {/* Content Sections - Constrained for TV/4K */}
      <div className="w-full max-w-[1440px] px-4 lg:px-8 py-12 space-y-12">
        {/* Continue Watching (Client Component) */}
        <ContinueWatching />

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

            {/* Movie Grid - Responsive up to TV sizes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {section.movies.map((movie) => (
                <SpotlightCard key={movie.id} className="p-0 border-none bg-transparent">
                  <MovieCard movie={movie} />
                </SpotlightCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
