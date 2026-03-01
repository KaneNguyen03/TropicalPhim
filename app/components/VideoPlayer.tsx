'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Server, MonitorPlay, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8?: string;
}

interface VideoPlayerProps {
  episode: Episode | null;
  movieName: string;
  movieSlug: string;
  thumbUrl: string;
  trailerUrl?: string;
}

export function VideoPlayer({ episode, movieName, movieSlug, thumbUrl, trailerUrl }: VideoPlayerProps) {
  const [server, setServer] = useState<'embed' | 'm3u8'>('embed');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hlsError, setHlsError] = useState<string | null>(null);

  // Reset loading state when changing server or episode
  useEffect(() => {
    setIsIframeLoading(true);
  }, [server, episode?.slug]);

  // Auto-rotate logic for mobile
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement === containerRef.current) {
        // Tentative lock to landscape
        try {
          const orientation = window.screen.orientation as ScreenOrientation & { lock?: (type: string) => Promise<void> };
          if (orientation?.lock) {
            orientation.lock('landscape').catch(() => {
              // Ignore if fails (e.g. not supported or requires gesture)
            });
          }
        } catch (e) {
          console.warn("Orientation lock error:", e);
        }
      } else {
        // Unlock orientation
        try {
          const orientation = window.screen.orientation as ScreenOrientation & { unlock?: () => void };
          if (orientation?.unlock) {
            orientation.unlock();
          }
        } catch {}
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!episode || !videoRef.current) return;
    try {
      // Ignore first few seconds to prevent accidental immediate saves overwriting completed progress
      if (videoRef.current.currentTime > 5) {
        localStorage.setItem(`tropicalphim_progress_${movieSlug}`, JSON.stringify({
          episodeSlug: episode.slug,
          time: videoRef.current.currentTime,
          duration: videoRef.current.duration,
          movieName,
          thumbUrl,
          updatedAt: Date.now()
        }));

        // Update recent list
        const recent = JSON.parse(localStorage.getItem('tropicalphim_recent') || '[]');
        const filtered = recent.filter((r: { slug: string }) => r.slug !== movieSlug);
        const updated = [{ slug: movieSlug, name: movieName, thumb: thumbUrl, updatedAt: Date.now() }, ...filtered].slice(0, 10);
        localStorage.setItem('tropicalphim_recent', JSON.stringify(updated));
      }
    } catch {
      // Ignore if block storage
    }
  };

  useEffect(() => {
    // Restore time progress
    const restoreProgress = (vid: HTMLVideoElement) => {
      try {
        if (!episode) return;
        const saved = localStorage.getItem(`tropicalphim_progress_${movieSlug}`);
        if (saved) {
          const { episodeSlug, time } = JSON.parse(saved);
          if (episodeSlug === episode.slug && time > 5) {
            vid.currentTime = time;
          }
        }
      } catch {
        // Ignore
      }
    };

    // Reset error when switching
    setHlsError(null);
    
    // We try dynamic import for hls.js just in case it's installed, 
    // or fallback to native video if strictly supported.
    if (server === 'm3u8' && episode?.link_m3u8 && videoRef.current) {
      const video = videoRef.current;
      
      const loadHls = async () => {
        try {
          const Hls = (await import('hls.js')).default;
          
          if (Hls.isSupported()) {
            const hls = new Hls({
               enableWorker: false // Safe default for dynamic imports
            });
            hls.loadSource(episode.link_m3u8 as string);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
              restoreProgress(video);
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hls.on(Hls.Events.ERROR, function (_event: any, data: any) {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    setHlsError("Lỗi kết nối mạng: Không tải được stream.");
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    setHlsError("Lôi phát lại video M3U8.");
                    break;
                }
              }
            });
            return () => hls.destroy();
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari fallback
            video.src = episode.link_m3u8 as string;
            video.addEventListener('loadedmetadata', () => restoreProgress(video));
          } else {
            setHlsError("Trình duyệt không hỗ trợ HLS. Vui lòng chọn Server Embed.");
          }
        } catch {
          // hls.js is not installed, fallback to native if possible
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = episode.link_m3u8 as string;
            video.addEventListener('loadedmetadata', () => restoreProgress(video));
          } else {
            console.warn("HLS.js not installed and native HLS not supported.");
            setHlsError("Bạn cần cài đặt 'hls.js' bằng lệnh 'npm install hls.js' hoặc trình duyệt của bạn không hỗ trợ HLS.");
          }
        }
      };
      
      loadHls();
    }
  }, [server, episode, movieSlug]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Container video */}
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group shadow-2xl"
      >
        {!episode ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]">

            <Image 
              src={thumbUrl} 
              alt={movieName} 
              fill
              priority
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover opacity-30 blur-sm brightness-50 z-0" 
            />
            <div className="relative z-10 text-center space-y-4">
              <div className="bg-[#CCFF00] rounded-full p-4 md:p-6 inline-block opacity-80 animate-pulse">
                <MonitorPlay className="w-8 h-8 md:w-10 md:h-10 text-black" />
              </div>
              <p className="text-white text-lg md:text-xl font-medium">Vui lòng chọn tập phim để xem</p>
            </div>
          </div>
        ) : (!episode.link_embed && !episode.link_m3u8) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] text-center p-6 space-y-5">
            <Image 
              src={thumbUrl} 
              alt={movieName} 
              fill
              priority
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover opacity-20 blur-sm brightness-50 z-0" 
            />
            <div className="relative z-10 space-y-4 max-w-md">
              <div className="bg-yellow-500/20 rounded-full p-4 inline-block">
                <AlertCircle className="w-10 h-10 text-yellow-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white text-xl font-bold">Phim chưa có bản xem trực tuyến</h3>
                <p className="text-white/60 text-sm">
                  Hiện tại phim này đang ở trạng thái Trailer hoặc chưa được cập nhật link xem từ máy chủ. 
                  Bạn có thể xem Trailer bên dưới hoặc quay lại sau.
                </p>
              </div>
              {trailerUrl && (
                <Button 
                  asChild
                  className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] font-bold rounded-full px-8"
                >
                  <a href={trailerUrl} target="_blank" rel="noopener noreferrer">
                    Xem Trailer trên YouTube
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {server === 'embed' ? (
              <div className="w-full h-full absolute top-0 left-0 bg-black">
                {isIframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-white space-y-4">
                    <div className="bg-[#CCFF00]/20 p-4 rounded-full">
                      <Loader2 className="w-8 h-8 text-[#CCFF00] animate-spin" />
                    </div>
                    <p className="font-medium animate-pulse">Đang kết nối máy chủ Embed...</p>
                  </div>
                )}
                <iframe
                  key={`embed-${episode.slug}`}
                  src={episode.link_embed || undefined}
                  onLoad={() => setIsIframeLoading(false)}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                  className={`w-full h-full border-0 absolute top-0 left-0 z-0 transition-opacity duration-500 ${isIframeLoading ? 'opacity-0' : 'opacity-100'}`}
                  title={`${movieName} - ${episode.name}`}
                />
              </div>
            ) : (
               <div className="w-full h-full absolute top-0 left-0 bg-black flex items-center justify-center">
                  {hlsError ? (
                    <div className="flex flex-col items-center gap-3 text-red-400 p-6 text-center z-10 bg-black/80 rounded-lg">
                      <AlertCircle className="w-10 h-10" />
                      <p className="font-medium">{hlsError}</p>
                      <Button 
                        variant="outline" 
                        className="mt-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                        onClick={() => setServer('embed')}
                      >
                         Chuyển sang Server Embed
                      </Button>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      controls
                      autoPlay
                      onTimeUpdate={handleTimeUpdate}
                      className="w-full h-full object-contain"
                      poster={thumbUrl}
                    />
                  )}
               </div>
            )}
            
            {/* Overlay hint if not interacting */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <Badge className="bg-black/60 text-[#CCFF00] border-[#CCFF00]/50 backdrop-blur-md">
                 Đang phát trên Server {server === 'embed' ? 'Embed' : 'M3U8'}
               </Badge>
            </div>
          </>
        )}
      </div>

      {/* Control panel: Server switch */}
      {episode && (
        <div className="flex flex-wrap bg-[#171717]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 md:p-4 gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-white/70 text-sm font-medium whitespace-nowrap hidden sm:block">Các Máy Chủ:</span>
            
            <Button
              variant={server === 'embed' ? 'default' : 'outline'}
              onClick={() => setServer('embed')}
              className={`min-w-[130px] rounded-full transition-all duration-300 ${
                server === 'embed' 
                  ? 'bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                  : 'text-white border-white/10 hover:bg-white/10 hover:border-white/30 bg-transparent'
              }`}
            >
              <Server className="w-4 h-4 mr-2" />
              Server #1 (Embed)
            </Button>
            
            {episode.link_m3u8 && (
              <Button
                variant={server === 'm3u8' ? 'default' : 'outline'}
                onClick={() => setServer('m3u8')}
                className={`min-w-[130px] rounded-full transition-all duration-300 ${
                  server === 'm3u8' 
                    ? 'bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                    : 'text-white border-white/10 hover:bg-white/10 hover:border-white/30 bg-transparent'
                }`}
              >
                <MonitorPlay className="w-4 h-4 mr-2" />
                Server #2 (HLS)
              </Button>
            )}
          </div>
          
          <div className="hidden md:flex items-center">
             <span className="text-xs text-white/40">Gặp lỗi mờ/đứng? Vui lòng đổi server</span>
          </div>
        </div>
      )}
    </div>
  );
}
