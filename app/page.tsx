import { getHomeMovies, getMoviesByList, getMovieDetail } from './services/ophim';
import HomePage from './pages/HomePage';
import type { Movie } from './data/movies';

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

  return <HomePage dataPromise={dataPromise} />;
}
