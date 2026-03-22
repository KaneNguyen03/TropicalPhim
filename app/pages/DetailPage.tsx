import Link from 'next/link';
import { Play, Star, Clock, Calendar, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DetailTabs } from '../components/DetailTabs';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import Image from 'next/image';
import { getMovieDetail, getMoviesByList } from '../services/ophim';
import type { Movie } from '../data/movies';

export default async function DetailPage({ slug }: { slug: string }) {
  const movie = await getMovieDetail(slug);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Không tìm thấy phim</h1>
          <Button asChild>
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch some related movies based on the first category if available
  let relatedMovies: Movie[] = [];
  if (movie.category && movie.category.length > 0) {
    relatedMovies = await getMoviesByList(movie.category[0].slug);
    relatedMovies = relatedMovies.filter(m => m.id !== movie.id).slice(0, 6);
  }

  const watchUrl = movie.type === 'series' && movie.episodes && movie.episodes[0]?.server_data[0]
    ? `/watch/${movie.slug}/${movie.episodes[0].server_data[0].slug}`
    : `/watch/${movie.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.name,
    "alternateName": movie.origin_name,
    "image": [movie.poster_url, movie.thumb_url],
    "datePublished": `${movie.year}-01-01`,
    "description": movie.description.replace(/<[^>]*>?/gm, ''),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.tmdb?.vote_average || 0,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": movie.tmdb?.vote_count || 1
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={movie.thumb_url}
            alt={movie.name}
            fill
            sizes="100vw"
            priority
            loading="eager"
            fetchPriority="high"
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 lg:px-8 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <div className="hidden md:block shrink-0 relative w-64 h-96">
              <Image
                src={movie.poster_url}
                alt={movie.name}
                fill
                sizes="(max-width: 768px) 0vw, 256px"
                priority
                loading="eager"
                fetchPriority="high"
                unoptimized
                className="rounded-lg shadow-2xl border-2 border-white/10 object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#CCFF00] text-[#0A0A0A] border-none px-3 py-1 font-semibold uppercase">
                  {movie.quality}
                </Badge>
                <Badge className="bg-[#FF6B35] text-white border-none px-3 py-1 uppercase">
                  {movie.year}
                </Badge>
                {movie.lang && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-none px-3 py-1">
                    {movie.lang}
                  </Badge>
                )}
              </div>

              {/* Breadcrumbs */}
              {movie.breadCrumb && movie.breadCrumb.length > 0 && (
                <div className="pt-2">
                  <Breadcrumb>
                    <BreadcrumbList className="text-white/60">
                      {movie.breadCrumb.map((item, index) => (
                        <div key={index} className="flex items-center gap-1.5 sm:gap-2.5">
                          <BreadcrumbItem>
                            {item.isCurrent ? (
                              <BreadcrumbPage className="text-white font-medium">{item.name}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link 
                                  href={item.slug
                                    .replace('/danh-sach/', '/search?type=')
                                    .replace('/the-loai/', '/search?category=')
                                    .replace('/quoc-gia/', '/search?country=')
                                  } 
                                  prefetch={false}
                                  className="hover:text-[#CCFF00]"
                                >
                                  {item.name}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {index < movie.breadCrumb!.length - 1 && (
                            <BreadcrumbSeparator className="text-white/40" />
                          )}
                        </div>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {movie.name}
                </h1>
                <p className="text-xl text-white/70 italic">{movie.origin_name}</p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#CCFF00] fill-[#CCFF00]" />
                  <span className="text-white font-semibold">{movie.tmdb?.vote_average?.toFixed(1) || 0}</span>
                  <span>({(movie.tmdb?.vote_count || 0).toLocaleString()} votes)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{movie.time}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
                {movie.view && movie.view > 0 ? (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                       <span>{movie.view.toLocaleString()} views</span>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {movie.category.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}`}
                    prefetch={false}
                    className="text-sm text-[#CCFF00] hover:text-[#CCFF00]/80"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] font-semibold"
                >
                  <Link href={watchUrl}>
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    XEM NGAY
                  </Link>
                </Button>
                {movie.trailer_url && (
                  <TrailerModal trailerUrl={movie.trailer_url} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-[#171717] rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">Nội Dung Phim</h2>
              <div 
                className="text-white/80 leading-relaxed max-w-none prose prose-invert prose-p:mb-4 prose-a:text-[#CCFF00]" 
                dangerouslySetInnerHTML={{ __html: movie.description }} 
              />
            </div>

            {/* Episodes for Series */}
            {movie.type === 'series' && movie.episodes && (
              <div className="bg-[#171717] rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white">Danh Sách Tập</h2>
                
                <DetailTabs 
                  episodes={movie.episodes} 
                  movieSlug={movie.slug} 
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Additional Info */}
            <div className="bg-[#171717] rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Thông Tin</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-[#CCFF00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/60 mb-1">Quốc Gia</p>
                    <p className="text-white">{movie.country.map(c => c.name).join(', ')}</p>
                  </div>
                </div>

                {movie.type === 'series' && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#CCFF00] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/60 mb-1">Số Tập</p>
                      <p className="text-white">{movie.episode_current}/{movie.episode_total}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-[#CCFF00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/60 mb-1">Đánh Giá</p>
                    <p className="text-white">{movie.tmdb?.vote_average?.toFixed(1) || 0}/10</p>
                  </div>
                </div>

                {movie.actor && movie.actor.length > 0 && (
                  <div className="flex items-start gap-3 mt-3">
                    <div>
                      <p className="text-white/60 mb-1">Diễn Viên</p>
                      <p className="text-white">{movie.actor.join(', ')}</p>
                    </div>
                  </div>
                )}
                {movie.director && movie.director.length > 0 && (
                  <div className="flex items-start gap-3 mt-3">
                    <div>
                      <p className="text-white/60 mb-1">Đạo Diễn</p>
                      <p className="text-white">{movie.director.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Movies - Moved to bottom for better visibility to show "Phần tiếp theo" */}
        {relatedMovies.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-white">Phần Tiếp Theo & Phim Liên Quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <MovieCard key={relatedMovie.id} movie={relatedMovie} size="md" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
