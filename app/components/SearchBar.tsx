'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface SuggestedMovie {
  id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  quality: string;
  type: string;
}

interface OphimSearchResponse {
  status: string;
  data?: {
    items?: {
      _id: string;
      name: string;
      origin_name: string;
      slug: string;
      thumb_url: string;
      poster_url: string;
      year: number;
      quality: string;
      type: string;
    }[];
    APP_DOMAIN_CDN_IMAGE?: string;
  };
}

async function fetchSuggestions(keyword: string): Promise<SuggestedMovie[]> {
  if (keyword.length < 2) return [];
  try {
    const res = await fetch(
      `https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=8`,
      { headers: { accept: 'application/json' } }
    );
    const json: OphimSearchResponse = await res.json();
    if (!json?.data?.items) return [];

    const cdn = json.data.APP_DOMAIN_CDN_IMAGE ?? 'https://img.ophim.live';
    return json.data.items.map((item) => ({
      id: item._id,
      name: item.name,
      origin_name: item.origin_name,
      slug: item.slug,
      thumb_url: item.thumb_url.startsWith('http')
        ? item.thumb_url
        : `${cdn}/uploads/movies/${item.thumb_url}`,
      poster_url: item.poster_url?.startsWith('http')
        ? item.poster_url
        : `${cdn}/uploads/movies/${item.poster_url ?? item.thumb_url}`,
      year: item.year,
      quality: item.quality,
      type: item.type,
    }));
  } catch {
    return [];
  }
}

export function SearchBar({ placeholder = 'Tìm phim, diễn viên...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedMovie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchSuggestions(value);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setIsLoading(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleSelectSuggestion = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    startTransition(() => {
      router.push(`/movie/${slug}`);
    });
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          aria-label="Tìm kiếm phim"
          className="w-full pl-10 pr-9 h-9 text-sm bg-[#171717] border border-white/10 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-[#CCFF00]/60 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all"
        />
        {(query || isLoading || isPending) && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Xóa tìm kiếm"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {isLoading || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#CCFF00]" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-200 bg-[#171717] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-1.5 max-h-[70vh] overflow-y-auto">
            {suggestions.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSelectSuggestion(movie.slug)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                {/* Thumbnail */}
                <div className="relative w-10 h-14 shrink-0 rounded-md overflow-hidden bg-white/5">
                  <Image
                    src={movie.poster_url || movie.thumb_url}
                    alt={movie.name}
                    fill
                    sizes="40px"
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-[#CCFF00] transition-colors truncate">
                    {movie.name}
                  </p>
                  <p className="text-xs text-white/70 truncate">{movie.origin_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#CCFF00] font-semibold">{movie.quality}</span>
                    <span className="text-[10px] text-white/60">{movie.year}</span>
                    <span className="text-[10px] text-white/60">
                      {movie.type === 'series' ? 'Phim bộ' : movie.type === 'hoathinh' ? 'Hoạt hình' : 'Phim lẻ'}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {/* View all results */}
            <div className="border-t border-white/10 mt-1 pt-1">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#CCFF00] hover:bg-white/5 rounded-lg transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                Xem tất cả kết quả cho &quot;{query}&quot;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
