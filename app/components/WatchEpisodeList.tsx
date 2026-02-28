'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8?: string;
}

interface ServerGroup {
  server_name: string;
  server_data: Episode[];
}

interface WatchEpisodeListProps {
  episodesGroups: ServerGroup[];
  movieSlug: string;
  currentEpisodeSlug: string;
  currentServerIndex: number;
  isSingle?: boolean;
}

/** Build watch URL with server index encoded */
function buildWatchUrl(movieSlug: string, episodeSlug: string, serverIndex: number): string {
  if (serverIndex === 0) return `/watch/${movieSlug}/${episodeSlug}`;
  return `/watch/${movieSlug}/${episodeSlug}?sv=${serverIndex}`;
}

export function WatchEpisodeList({
  episodesGroups,
  movieSlug,
  currentEpisodeSlug,
  currentServerIndex,
  isSingle = false,
}: WatchEpisodeListProps) {
  const [selectedServerIdx, setSelectedServerIdx] = useState<number | null>(null);

  const activeIdx = selectedServerIdx ?? currentServerIndex;
  const currentServerGroup = episodesGroups[activeIdx] ?? episodesGroups[0];

  // For single movies: each server_name is a version (Vietsub / Thuyet Minh).
  if (isSingle) {
    return (
      <div className="bg-[#171717] rounded-xl p-5">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#CCFF00] rounded-full inline-block" />
          Chọn Phiên Bản
        </h2>
        <div className="flex flex-wrap gap-3">
          {episodesGroups.map((server, srvIdx) => {
            const firstEp = server.server_data[0];
            if (!firstEp) return null;
            const isActive = srvIdx === currentServerIndex;
            return (
              <Link
                key={server.server_name}
                href={buildWatchUrl(movieSlug, firstEp.slug, srvIdx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                  isActive
                    ? 'bg-[#CCFF00] text-[#0A0A0A] border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'bg-[#0A0A0A] text-white border-white/20 hover:border-[#CCFF00]/50 hover:text-[#CCFF00]'
                }`}
              >
                {isActive && <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse" />}
                {server.server_name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Series: show server switcher + episode grid
  return (
    <div className="bg-[#171717] rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">
          Danh Sách Tập {currentServerGroup ? `(${currentServerGroup.server_data.length})` : ''}
        </h2>
        
        {/* Server Selection */}
        {episodesGroups.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {episodesGroups.map((server, srvIdx) => (
              <Button
                key={server.server_name}
                variant={activeIdx === srvIdx ? 'default' : 'outline'}
                onClick={() => setSelectedServerIdx(srvIdx)}
                className={`min-w-fit rounded-full ${
                  activeIdx === srvIdx
                    ? 'bg-[#CCFF00] text-[#0A0A0A] hover:bg-[#CCFF00]/90 border-0'
                    : 'bg-transparent text-white border-white/20 hover:bg-white/10'
                }`}
              >
                {server.server_name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {currentServerGroup?.server_data.map((episode) => {
          const isCurrentEp = episode.slug === currentEpisodeSlug && activeIdx === currentServerIndex;
          return (
            <Button
              key={`${activeIdx}-${episode.slug}`}
              asChild
              variant="outline"
              className={`h-12 transition-colors ${
                isCurrentEp
                  ? 'bg-[#CCFF00] text-[#0A0A0A] border-[#CCFF00] hover:bg-[#CCFF00]/90 shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                  : 'border-white/20 bg-[#0A0A0A] hover:bg-white/10 text-white'
              }`}
            >
              <Link href={buildWatchUrl(movieSlug, episode.slug, activeIdx)}>
                {episode.name}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
