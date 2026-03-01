import { getHomeMovies, getMoviesByList, getMovieDetail } from './services/ophim';
import HomePage from './pages/HomePage';
import type { Movie } from './data/movies';

import { Suspense } from 'react';

export default function Page() {
  // Triggers the promise on the server side
  const dataPromise = Promise.all([
    getHomeMovies(),
    getMoviesByList('phim-bo'),
    getMoviesByList('hoat-hinh'),
  ]).then(async ([homeMovies, seriesMovies, animatedMovies]) => {
    // Process featured movies correctly inside the promise resolving
    const featuredBasic = homeMovies.slice(0, 5);
    const featuredMovies = (await Promise.all(
      featuredBasic.map(m => getMovieDetail(m.slug))
    )).filter(Boolean) as Movie[];
    
    return [homeMovies, seriesMovies, animatedMovies, featuredMovies] as [Movie[], Movie[], Movie[], Movie[]];
  });

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex w-full h-screen items-center justify-center"><div className="w-16 h-16 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>}>
      <HomePage dataPromise={dataPromise} />
    </Suspense>
  );
}
