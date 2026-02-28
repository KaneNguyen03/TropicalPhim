import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Input } from '../components/ui/input';
import { MovieCard } from '../components/MovieCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { allMovies } from '../data/movies';

export default function SearchPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const params = searchParams || {};
  const queryFromUrl = typeof params.q === 'string' ? params.q : '';
  const selectedCategories = Array.isArray(params.category) 
    ? params.category 
    : typeof params.category === 'string' ? [params.category] : [];
  
  const selectedCountries = Array.isArray(params.country) 
    ? params.country 
    : typeof params.country === 'string' ? [params.country] : [];

  const selectedYears = Array.isArray(params.year) 
    ? params.year.map(Number) 
    : typeof params.year === 'string' ? [Number(params.year)] : [];

  const selectedQualities = Array.isArray(params.quality) 
    ? params.quality 
    : typeof params.quality === 'string' ? [params.quality] : [];

  const filteredMovies = allMovies.filter(movie => {
    // Search query
    if (queryFromUrl) {
      const query = queryFromUrl.toLowerCase();
      const matchesName = movie.name.toLowerCase().includes(query);
      const matchesOriginName = movie.origin_name.toLowerCase().includes(query);
      const matchesDescription = movie.description.toLowerCase().includes(query);
      if (!matchesName && !matchesOriginName && !matchesDescription) {
        return false;
      }
    }

    // Categories
    if (selectedCategories.length > 0) {
      const hasCategory = movie.category.some(cat => 
        selectedCategories.includes(cat.slug)
      );
      if (!hasCategory) return false;
    }

    // Countries
    if (selectedCountries.length > 0) {
      const hasCountry = movie.country.some(country => 
        selectedCountries.includes(country.slug)
      );
      if (!hasCountry) return false;
    }

    // Years
    if (selectedYears.length > 0) {
      if (!selectedYears.includes(movie.year)) return false;
    }

    // Qualities
    if (selectedQualities.length > 0) {
      if (!selectedQualities.includes(movie.quality)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar />

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <form method="GET" action="/search" className="relative max-w-2xl text-left">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                name="q"
                type="search"
                defaultValue={queryFromUrl}
                placeholder="Tìm kiếm phim, diễn viên, đạo diễn..."
                className="w-full pl-12 h-14 text-lg bg-[#171717] border-white/10 text-white placeholder:text-white/50 focus:border-[#CCFF00]"
              />
              {selectedCategories.map(c => <input key={c} type="hidden" name="category" value={c} />)}
              {selectedCountries.map(c => <input key={c} type="hidden" name="country" value={c} />)}
              {selectedYears.map(c => <input key={c} type="hidden" name="year" value={c} />)}
              {selectedQualities.map(c => <input key={c} type="hidden" name="quality" value={c} />)}
            </form>
          </div>

          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {queryFromUrl ? `Kết quả cho "${queryFromUrl}"` : 'Tất Cả Phim'}
            </h1>
            <p className="text-white/60">
              Tìm thấy {filteredMovies.length} kết quả
            </p>
          </div>

          {/* Movies Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-white/60 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Link
                href="/search"
                className="text-[#CCFF00] hover:text-[#CCFF00]/80 underline"
              >
                Xóa tất cả bộ lọc
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
