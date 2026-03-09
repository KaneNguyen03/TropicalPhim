import { Skeleton } from '@/app/components/ui/skeleton';

/** 16:9 video player skeleton với shimmer effect */
export function VideoPlayerSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Video container */}
      <div className="relative aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/10">
        <Skeleton className="absolute inset-0 bg-white/5" />
        {/* Play icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <div className="w-0 h-0 border-t-10 border-t-transparent border-b-10 border-b-transparent border-l-18 border-l-white/10 ml-1" />
          </div>
        </div>
      </div>
      {/* Server switcher skeleton */}
      <div className="flex gap-3 bg-[#171717]/80 border border-white/5 rounded-xl p-3">
        <Skeleton className="h-10 w-36 rounded-full bg-white/5" />
        <Skeleton className="h-10 w-36 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

/** Skeleton cho phần info bên dưới player */
export function MovieInfoSkeleton() {
  return (
    <div className="px-4 py-6 border-t border-white/10 space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full bg-white/5" />
        <Skeleton className="h-5 w-12 rounded-full bg-white/5" />
        <Skeleton className="h-5 w-20 rounded-full bg-white/5" />
      </div>
      <Skeleton className="h-8 w-3/4 bg-white/5 rounded" />
      <Skeleton className="h-4 w-1/2 bg-white/5 rounded" />
    </div>
  );
}

/** Skeleton cho danh sách tập */
export function EpisodeListSkeleton() {
  return (
    <div className="bg-[#171717] rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-44 bg-white/5 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-full bg-white/5" />
          <Skeleton className="h-9 w-28 rounded-full bg-white/5" />
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <Skeleton key={i} className="h-12 rounded-md bg-white/5" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton cho grid "Phim Tương Tự" */
export function RelatedMoviesSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-36 bg-white/5 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-2/3 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-4 w-3/4 bg-white/5 rounded" />
            <Skeleton className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
