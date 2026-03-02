import DetailPage from "@/app/pages/DetailPage";
import { getMovieDetail } from "@/app/services/ophim";
import { sanitizeDescription } from "@/app/services/utils";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieDetail(slug);
  
  if (!movie) return { title: "Không tìm thấy phim - TropicalPhim" };
  
  const title = `Xem phim ${movie.name} (${movie.year}) [${movie.quality}] | TropicalPhim`;
  const description = sanitizeDescription(movie.description, movie.name);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [movie.thumb_url, movie.poster_url],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [movie.thumb_url],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage slug={slug} />;
}
