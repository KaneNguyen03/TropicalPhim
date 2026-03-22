'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Server, MonitorPlay, AlertCircle, Loader2, LightbulbOff, Lightbulb, ToggleLeft, ToggleRight, StepForward } from 'lucide-react';
import { Badge } from './ui/badge';
import { EpisodeThumbnail } from './EpisodeThumbnail';

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
  nextEpisodeName?: string | null;
  nextEpisodeUrl?: string | null;
}

export function VideoPlayer({ episode, movieName, movieSlug, thumbUrl, trailerUrl, nextEpisodeName, nextEpisodeUrl }: VideoPlayerProps) {
  const router = useRouter();
  const [server, setServer] = useState<'embed' | 'm3u8'>('embed');
  const [isLightsOff, setIsLightsOff] = useState(false);
  const [isAutoNext, setIsAutoNext] = useState(true);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSavedTimeRef = useRef(0);
  const [hlsError, setHlsError] = useState<string | null>(null);
  const [showNextOverlay, setShowNextOverlay] = useState(false);

  // Reset loading state when changing server or episode
  useEffect(() => {
    setIsIframeLoading(true);
    setShowNextOverlay(false);
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
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 0;

      // Logic for Next Episode Overlay
      if (nextEpisodeUrl && duration > 0) {
        const timeLeft = duration - currentTime;
        // Show overlay when less than 15s remaining, and hide if we seeked back
        if (timeLeft <= 15 && timeLeft > 0) {
          if (!showNextOverlay) setShowNextOverlay(true);
        } else {
          if (showNextOverlay) setShowNextOverlay(false);
        }
      }

      // Bỏ qua vài giây đầu và throttle việc lưu để tránh ghi localStorage quá dày gây giật UI
      if (currentTime <= 5 || duration <= 0) return;

      const lastSaved = lastSavedTimeRef.current;
      // Chỉ lưu mỗi 10 giây hoặc khi tiến độ tăng thêm tối thiểu 10% duration
      const shouldSaveByTime = currentTime - lastSaved >= 10;
      const shouldSaveByPercent = duration > 0 && (currentTime - lastSaved) / duration >= 0.1;

      if (!shouldSaveByTime && !shouldSaveByPercent) return;

      lastSavedTimeRef.current = currentTime;

      localStorage.setItem(`tropicalphim_progress_${movieSlug}`, JSON.stringify({
        episodeSlug: episode.slug,
        time: currentTime,
        duration,
        movieName,
        thumbUrl,
        updatedAt: Date.now()
      }));

      // Cập nhật danh sách gần đây nhưng cũng đã được throttle theo time ở trên
      const recent = JSON.parse(localStorage.getItem('tropicalphim_recent') || '[]');
      const filtered = recent.filter((r: { slug: string }) => r.slug !== movieSlug);
      const updated = [{ slug: movieSlug, name: movieName, thumb: thumbUrl, updatedAt: Date.now() }, ...filtered].slice(0, 10);
      localStorage.setItem('tropicalphim_recent', JSON.stringify(updated));
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
  }, [server, episode, episode?.slug, episode?.link_m3u8, movieSlug]);

  const handleVideoEnded = () => {
    if (isAutoNext && nextEpisodeUrl) {
      router.push(nextEpisodeUrl);
    }
  };

  return (
    <>
      {/* Lights out overlay */}
      {isLightsOff && (
        <div 
          className="fixed inset-0 bg-black/95 z-60 cursor-pointer" 
          onClick={() => setIsLightsOff(false)}
          title="Bật đèn (Click để thoát)"
        />
      )}
      
      <div className={`flex flex-col gap-4 w-full ${isLightsOff ? 'relative z-70' : ''}`}>
      {/* Container video */}
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group shadow-2xl"
      >
        {!episode ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]">

            <EpisodeThumbnail 
              src={thumbUrl} 
              alt={movieName} 
              priority
              className="absolute inset-0 opacity-30 blur-sm brightness-50 z-0" 
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
            <EpisodeThumbnail 
              src={thumbUrl} 
              alt={movieName} 
              priority
              className="absolute inset-0 opacity-20 blur-sm brightness-50 z-0" 
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
                  // Dùng `allow` theo chuẩn mới — bao gồm cả fullscreen
                  // Không dùng `allowFullScreen` deprecated để tránh warning conflict
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
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
                        key={`m3u8-${episode.slug}`}
                        ref={videoRef}
                        controls
                        autoPlay
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-contain"
                        poster={thumbUrl}
                      />
                  )}
               </div>
            )}
            
            {/* Overlay hint if not interacting */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               <Badge className="bg-black/60 text-[#CCFF00] border-[#CCFF00]/50 backdrop-blur-md">
                 Đang phát trên Server {server === 'embed' ? 'Embed' : 'M3U8'}
               </Badge>
            </div>

            {/* Next Episode Overlay */}
            {showNextOverlay && nextEpisodeUrl && nextEpisodeName && (
              <div className="absolute bottom-20 right-4 md:right-8 z-30 bg-black/90 border border-white/20 p-4 md:p-5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in slide-in-from-right-8 fade-in flex flex-col gap-3 max-w-sm w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Chuẩn bị phát</span>
                  <span className="text-white font-medium text-sm line-clamp-1">{nextEpisodeName}</span>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowNextOverlay(false)} 
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Bỏ qua
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all"
                  >
                    <Link href={nextEpisodeUrl}>
                      Chuyển tập <StepForward className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Control panel: Server switch & Actions */}
      {episode && (
        <div className="flex flex-col md:flex-row bg-[#171717]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 md:p-4 gap-4 items-start md:items-center justify-between">
          
          {/* Left Side: Server Switch */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <span className="text-white/70 text-sm font-medium whitespace-nowrap hidden sm:block">Các Máy Chủ:</span>
            
            <Button
              variant={server === 'embed' ? 'default' : 'outline'}
              onClick={() => setServer('embed')}
              size="sm"
              className={`min-w-[120px] rounded-full transition-all duration-300 ${
                server === 'embed' 
                  ? 'bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                  : 'text-white border-white/10 hover:bg-white/10 hover:border-white/30 bg-transparent'
              }`}
            >
              <Server className="w-3.5 h-3.5 mr-2" />
              Server #1 (Embed)
            </Button>
            
            {episode.link_m3u8 && (
              <Button
                variant={server === 'm3u8' ? 'default' : 'outline'}
                onClick={() => setServer('m3u8')}
                size="sm"
                className={`min-w-[120px] rounded-full transition-all duration-300 ${
                  server === 'm3u8' 
                    ? 'bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0A0A0A] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                    : 'text-white border-white/10 hover:bg-white/10 hover:border-white/30 bg-transparent'
                }`}
              >
                <MonitorPlay className="w-3.5 h-3.5 mr-2" />
                Server #2 (HLS)
              </Button>
            )}
          </div>
          
          {/* Right Side: Toggles & Next Episode */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-white/10">
             
             {/* Toggle Lights */}
             <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-black/40 border-white/10 hover:bg-white/10 text-white text-xs px-3"
                onClick={() => setIsLightsOff(!isLightsOff)}
             >
                {isLightsOff ? <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-[#CCFF00]" /> : <LightbulbOff className="w-3.5 h-3.5 mr-1.5" />}
                {isLightsOff ? 'Bật đèn' : 'Tắt đèn'}
             </Button>

             {/* Auto Next Toggle */}
             {nextEpisodeUrl && (
               <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-black/40 border-white/10 hover:bg-white/10 text-white text-xs px-3"
                  onClick={() => setIsAutoNext(!isAutoNext)}
               >
                  {isAutoNext ? <ToggleRight className="w-4 h-4 mr-1.5 text-[#CCFF00]" /> : <ToggleLeft className="w-4 h-4 mr-1.5 text-white/50" />}
                  Chuyển tập: {isAutoNext ? 'Bật' : 'Tắt'}
               </Button>
             )}

             {/* Next Episode Button */}
             {nextEpisodeUrl && nextEpisodeName && (
                <Button 
                   asChild
                   size="sm"
                   className="rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 hover:bg-[#CCFF00]/20 text-[#CCFF00] text-xs px-4 ml-auto md:ml-2"
                >
                   <Link href={nextEpisodeUrl} prefetch={false}>
                      Tập tiếp: {nextEpisodeName}
                      <StepForward className="w-3.5 h-3.5 ml-1.5" />
                   </Link>
                </Button>
             )}

          </div>
        </div>
      )}
    </div>
    </>
  );
}
