'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Episode {
  name: string;
  slug: string;
}

interface ServerGroup {
  server_name: string;
  server_data: Episode[];
}

interface DetailTabsProps {
  episodes: ServerGroup[];
  movieSlug: string;
}

export function DetailTabs({ episodes, movieSlug }: DetailTabsProps) {
  return (
    <Tabs defaultValue="0" className="w-full">
      {episodes.length > 1 && (
        <TabsList className="bg-[#0A0A0A] border border-white/10">
          {episodes.map((server, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0A0A0A]"
            >
              {server.server_name}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {episodes.map((server, serverIndex) => (
        <TabsContent key={serverIndex} value={serverIndex.toString()} className="mt-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {server.server_data.map((episode) => (
              <Button
                key={episode.slug}
                asChild
                variant="outline"
                className="border-white/20 bg-[#0A0A0A] hover:bg-[#CCFF00] hover:text-[#0A0A0A] hover:border-[#CCFF00] text-white h-12"
              >
                <Link href={`/watch/${movieSlug}/${episode.slug}`}>
                  {episode.name}
                </Link>
              </Button>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
