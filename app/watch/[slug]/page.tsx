import WatchPage from "@/app/pages/WatchPage";
import { getMovieDetail } from "@/app/services/ophim";
import { sanitizeDescription } from "@/app/services/utils";
import { Metadata } from "next";

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sv?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { sv } = await searchParams;
  const movie = await getMovieDetail(slug);
  
  if (!movie) return { title: "Không tìm thấy phim - TropicalPhim" };
  
  const serverIndex = sv ? parseInt(sv, 10) || 0 : 0;
  const server = movie.episodes?.[serverIndex] || movie.episodes?.[0];
  const episode = server?.server_data?.[0];
  
  const episodeName = episode ? ` - ${episode.name}` : "";
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
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sv?: string }>;
}) {
  const { slug } = await params;
  const { sv } = await searchParams;
  const serverIndex = sv ? parseInt(sv, 10) || 0 : 0;
  return <WatchPage slug={slug} serverIndex={serverIndex} />;
}
