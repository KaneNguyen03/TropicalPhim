import WatchPage from "@/app/pages/WatchPage";
import { getMovieDetail } from "@/app/services/ophim";
import { sanitizeDescription } from "@/app/services/utils";
import { Metadata } from "next";

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string; episodeSlug: string }>;
  searchParams: Promise<{ sv?: string }>;
}): Promise<Metadata> {
  const { slug, episodeSlug } = await params;
  const { sv } = await searchParams;
  const movie = await getMovieDetail(slug);
  
  if (!movie) return { title: "Không tìm thấy phim - TropicalPhim" };
  
  const serverIndex = sv ? parseInt(sv, 10) || 0 : 0;
  
  // Find the episode for better metadata title
  let currentEpisode = null;
  const servers = movie.episodes || [];
  const targetServer = servers[serverIndex] || servers[0];
  currentEpisode = targetServer?.server_data.find((ep) => ep.slug === episodeSlug);
  
  if (!currentEpisode) {
     for (const server of servers) {
        currentEpisode = server.server_data.find((e) => e.slug === episodeSlug);
        if (currentEpisode) break;
     }
  }

  const episodeName = currentEpisode ? ` - ${currentEpisode.name}` : "";
  const title = `Xem phim ${movie.name}${episodeName} Vietsub | TropicalPhim`;
  const description = sanitizeDescription(movie.description, `${movie.name}${episodeName}`);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [movie.thumb_url, movie.poster_url],
      type: 'video.episode',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [movie.thumb_url],
    }
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; episodeSlug: string }>;
  searchParams: Promise<{ sv?: string }>;
}) {
  const { slug, episodeSlug } = await params;
  const { sv } = await searchParams;
  const serverIndex = sv ? parseInt(sv, 10) || 0 : 0;
  return <WatchPage slug={slug} episodeSlug={episodeSlug} serverIndex={serverIndex} />;
}
