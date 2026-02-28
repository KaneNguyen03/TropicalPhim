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
}

export function WatchEpisodeList({ episodesGroups, movieSlug, currentEpisodeSlug }: WatchEpisodeListProps) {
  const defaultServer = episodesGroups[0]?.server_name || '';
  const [selectedServerName, setSelectedServerName] = useState<string>('');

  const activeServerName = selectedServerName || defaultServer;
  const currentServerGroup = episodesGroups.find(ep => ep.server_name === activeServerName) || episodesGroups[0];

  return (
    <div className="bg-[#171717] rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">
          Danh Sách Tập {currentServerGroup ? `(${currentServerGroup.server_data.length})` : ''}
        </h2>
        
        {/* Server Selection */}
        {episodesGroups.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {episodesGroups.map(server => (
              <Button
                key={server.server_name}
                variant={activeServerName === server.server_name ? 'default' : 'outline'}
                onClick={() => setSelectedServerName(server.server_name)}
                className={`min-w-fit rounded-full ${
                  activeServerName === server.server_name
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
        {currentServerGroup?.server_data.map((episode) => (
          <Button
            key={episode.slug}
            asChild
            variant="outline"
            className={`h-12 transition-colors ${
              episode.slug === currentEpisodeSlug
                ? 'bg-[#CCFF00] text-[#0A0A0A] border-[#CCFF00] hover:bg-[#CCFF00]/90 shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                : 'border-white/20 bg-[#0A0A0A] hover:bg-white/10 text-white'
            }`}
          >
            <Link href={`/watch/${movieSlug}/${episode.slug}`}>
              {episode.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
