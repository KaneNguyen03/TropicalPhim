import Image from 'next/image';

interface EpisodeThumbnailProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Reusable Episode Thumbnail component with Next.js Image optimization
 * Optimized for performance and avoiding Layout Shift (CLS)
 */
export function EpisodeThumbnail({
  src,
  alt,
  priority = false,
  className = "",
  width,
  height,
}: EpisodeThumbnailProps) {
  // If width and height are provided, use them. 
  // Otherwise default to fill with aspect-video container (16:9).
  
  if (width && height) {
    return (
      <div className={`overflow-hidden rounded-lg bg-zinc-900 ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
