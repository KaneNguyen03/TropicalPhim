import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { VideoPlayer } from '../components/VideoPlayer';
import { getMovieDetail } from '../services/ophim';
import { WatchEpisodeList } from '../components/WatchEpisodeList';
import RelatedMovies from '../components/RelatedMovies';
import {
  EpisodeListSkeleton,
  RelatedMoviesSkeleton,
} from '../components/skeletons/WatchPageSkeleton';

interface WatchPageProps {
  slug: string;
  episodeSlug?: string;
  /** Server index — 0-based, default 0 (first server / Vietsub) */
  serverIndex?: number;
}

export default async function WatchPage({
  slug,
  episodeSlug,
  serverIndex = 0,
}: WatchPageProps) {
  // ─── Critical path: chỉ cần getMovieDetail ─────────────────────────────
  const movie = await getMovieDetail(slug);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Không tìm thấy phim
          </h1>
          <Button asChild>
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Clamp server index to valid range
  const servers = movie.episodes ?? [];
  const safeServerIdx = Math.min(
    Math.max(serverIndex, 0),
    Math.max(servers.length - 1, 0),
  );

  // Resolve the episode from the correct server
  let currentEpisode: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8?: string;
  } | null = null;

  if (episodeSlug && servers.length > 0) {
    const targetServer = servers[safeServerIdx];
    const found = targetServer?.server_data.find(
      (ep) => ep.slug === episodeSlug,
    );
    if (found) {
      currentEpisode = found;
    } else {
      for (const server of servers) {
        const ep = server.server_data.find((e) => e.slug === episodeSlug);
        if (ep) {
          currentEpisode = ep;
          break;
        }
      }
    }
  }

  // Default: first episode of first server
  if (!currentEpisode) {
    currentEpisode = servers[0]?.server_data[0] ?? null;
  }

  // Calculate next episode
  let nextEpisode = null;
  let nextEpisodeUrl = null;
  if (currentEpisode && servers[safeServerIdx]) {
    const list = servers[safeServerIdx].server_data;
    const idx = list.findIndex((ep) => ep.slug === currentEpisode?.slug);
    if (idx !== -1 && idx < list.length - 1) {
      nextEpisode = list[idx + 1];
      nextEpisodeUrl = `/watch/${movie.slug}/${nextEpisode.slug}?server=${safeServerIdx}`;
    }
  }

  const activeServerName = servers[safeServerIdx]?.server_name ?? '';
  const categorySlug = movie.category?.[0]?.slug;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── CRITICAL PATH: Video Player Section ──────────────────────────── */}
      {/* Renders immediately after getMovieDetail resolves.                 */}
      {/* RelatedMovies & EpisodeList are streamed in separately.            */}
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
              episode={currentEpisode}
              movieName={movie.name}
              movieSlug={movie.slug}
              thumbUrl={movie.thumb_url}
              trailerUrl={movie.trailer_url}
              nextEpisodeName={nextEpisode?.name}
              nextEpisodeUrl={nextEpisodeUrl}
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
                  {activeServerName && (
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {activeServerName}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {movie.name}
                  {currentEpisode && (
                    <span className="text-[#CCFF00] ml-3">
                      • {currentEpisode.name}
                    </span>
                  )}
                </h1>
                <p className="text-white/70">{movie.origin_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DEFERRED: Episodes + Related (streamed independently) ─────────── */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Danh sách tập — hiện ngay khi movie data có (data đã có, chỉ render) */}
        {servers.length > 0 && (
          <Suspense fallback={<EpisodeListSkeleton />}>
            <WatchEpisodeList
              episodesGroups={servers}
              movieSlug={movie.slug}
              currentEpisodeSlug={episodeSlug ?? currentEpisode?.slug ?? ''}
              currentServerIndex={safeServerIdx}
              isSingle={movie.type === 'single'}
            />
          </Suspense>
        )}

        {/* Phim tương tự — SERVER component riêng, tự gọi API, không block player */}
        {categorySlug && (
          <Suspense fallback={<RelatedMoviesSkeleton />}>
            <RelatedMovies
              categorySlug={categorySlug}
              currentMovieId={movie.id}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
