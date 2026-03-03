import { SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../components/MovieCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { searchMovies, getCategories, getCountries } from '../services/ophim';

interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const getString = (v: string | string[] | undefined) =>
  typeof v === 'string' ? v : v?.[0];

function buildPageUrl(
  current: { [key: string]: string | string[] | undefined },
  overrides: Record<string, string | undefined>
): string {
  const merged = Object.fromEntries(
    Object.entries({ ...current, ...overrides })
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  );
  return `/search?${new URLSearchParams(merged).toString()}`;
}

export default async function SearchPage({ searchParams = {} }: SearchPageProps) {
  const keyword = getString(searchParams.q);
  const category = getString(searchParams.category);
  const country = getString(searchParams.country);
  const type = getString(searchParams.type);
  const year = getString(searchParams.year);
  const quality = getString(searchParams.quality);
  const page = getString(searchParams.page);

  const [result, categories, countries] = await Promise.all([
    searchMovies({ keyword, type, category, country, year, page }),
    getCategories(),
    getCountries(),
  ]);

  const { movies: allMovies, pagination, titlePage: apiTitle } = result;

  // Client-side quality filter (Ophim API doesn't support quality param consistently)
  const movies = quality
    ? allMovies.filter((m) => m.quality === quality)
    : allMovies;

  // Build a human-readable title
  const pageTitle = apiTitle ||
    (keyword
      ? `Kết quả cho "${keyword}"`
      : category
      ? `Thể loại: ${categories.find((c) => c.slug === category)?.name ?? category}`
      : country
      ? `Quốc gia: ${countries.find((c) => c.slug === country)?.name ?? country}`
      : type
      ? `${type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
      : year
      ? `Phim năm ${year}`
      : 'Phim Mới Cập Nhật');

  // Build active filters list for the chips bar
  const activeFilters: { label: string; key: string }[] = [
    ...(keyword ? [{ label: `🔍 "${keyword}"`, key: 'q' }] : []),
    ...(category ? [{ label: `🎬 ${categories.find((c) => c.slug === category)?.name ?? category}`, key: 'category' }] : []),
    ...(country ? [{ label: `🌐 ${countries.find((c) => c.slug === country)?.name ?? country}`, key: 'country' }] : []),
    ...(type ? [{ label: `📋 ${type.replace(/-/g, ' ')}`, key: 'type' }] : []),
    ...(year ? [{ label: `📅 ${year}`, key: 'year' }] : []),
    ...(quality ? [{ label: `✨ ${quality}`, key: 'quality' }] : []),
  ];

  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;

  const prevPageUrl = currentPage > 1
    ? buildPageUrl(searchParams, { page: String(currentPage - 1) })
    : null;
  const nextPageUrl = currentPage < totalPages
    ? buildPageUrl(searchParams, { page: String(currentPage + 1) })
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex">
        {/* Filter Sidebar – receives data from server, passes to client component */}
        <FilterSidebar
          categories={categories}
          countries={countries}
          currentFilters={{ category, country, year, quality, type, q: keyword }}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 px-4 lg:px-6 py-8">

          {/* Page Title + Stats */}
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{pageTitle}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
              <span>{pagination.totalItems.toLocaleString()} phim</span>
              {totalPages > 1 && (
                <>
                  <span>•</span>
                  <span>Trang {currentPage}/{totalPages}</span>
                </>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <SlidersHorizontal className="h-4 w-4 text-white/40 shrink-0" />
              {activeFilters.map((f) => (
                <Link
                  key={f.key}
                  href={buildPageUrl(searchParams, { [f.key]: undefined, page: undefined })}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-medium hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 transition-colors group"
                >
                  {f.label}
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
              ))}
              {activeFilters.length > 1 && (
                <Link
                  href="/search"
                  className="text-xs text-white/40 hover:text-white/70 underline ml-1"
                >
                  Xóa tất cả
                </Link>
              )}
            </div>
          )}

          {/* No filters yet – show category shortcuts */}
          {activeFilters.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: '🎬 Phim Lẻ', href: '/search?type=phim-le' },
                { label: '📺 Phim Bộ', href: '/search?type=phim-bo' },
                { label: '🎨 Hoạt Hình', href: '/search?type=hoat-hinh' },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-[#CCFF00]/10 hover:border-[#CCFF00]/30 hover:text-[#CCFF00] transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}

          {/* Movies Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-white/60 mb-6">
                Hãy thử từ khóa khác hoặc bỏ bớt bộ lọc
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0A0A0A] font-semibold hover:bg-[#CCFF00]/90 transition-colors"
              >
                <X className="h-4 w-4" /> Xóa bộ lọc
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (() => {
            // Build page numbers to show: first, last, current ±2, with ellipsis
            const pageNumbers: (number | 'ellipsis')[] = [];
            const delta = 2;
            const rangeStart = Math.max(2, currentPage - delta);
            const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

            pageNumbers.push(1);
            if (rangeStart > 2) pageNumbers.push('ellipsis');
            for (let i = rangeStart; i <= rangeEnd; i++) pageNumbers.push(i);
            if (rangeEnd < totalPages - 1) pageNumbers.push('ellipsis');
            if (totalPages > 1) pageNumbers.push(totalPages);

            return (
              <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
                {/* Prev */}
                {prevPageUrl ? (
                  <Link
                    href={prevPageUrl}
                    className="px-4 py-2 rounded-lg bg-[#171717] text-white border border-white/10 hover:border-[#CCFF00]/50 hover:text-[#CCFF00] transition-colors text-sm font-medium"
                  >
                    ←
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-[#0D0D0D] text-white/20 border border-white/5 text-sm cursor-not-allowed">
                    ←
                  </span>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span key={`e${idx}`} className="px-2 text-white/30 text-sm">…</span>
                  ) : p === currentPage ? (
                    <span
                      key={p}
                      className="px-4 py-2 rounded-lg bg-[#CCFF00] text-[#0A0A0A] font-bold text-sm shadow-[0_0_12px_rgba(204,255,0,0.3)]"
                    >
                      {p}
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={buildPageUrl(searchParams, { page: String(p) })}
                      className="px-4 py-2 rounded-lg bg-[#171717] text-white/70 border border-white/10 hover:border-[#CCFF00]/40 hover:text-[#CCFF00] transition-colors text-sm"
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                {nextPageUrl ? (
                  <Link
                    href={nextPageUrl}
                    className="px-4 py-2 rounded-lg bg-[#CCFF00] text-[#0A0A0A] font-bold hover:bg-[#CCFF00]/90 transition-colors text-sm"
                  >
                    →
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-[#171717]/50 text-white/20 border border-white/5 text-sm cursor-not-allowed">
                    →
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
