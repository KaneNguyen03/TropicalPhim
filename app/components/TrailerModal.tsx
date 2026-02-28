'use client';

import { Play } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "./ui/dialog";

export function TrailerModal({ trailerUrl }: { trailerUrl: string }) {
  const getEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('/embed/')) {
      return url;
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    return url;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-[#CCFF00]"
        >
          <Play className="mr-2 h-5 w-5" />
          Trailer
        </Button>
      </DialogTrigger>
        <DialogContent 
        className="max-w-[90vw]! md:max-w-[70vw]! w-full p-0 bg-transparent border-none shadow-none [&>button]:bg-black/50 [&>button]:text-white [&>button]:hover:bg-black/80"
        >
        <DialogTitle className="sr-only">Trailer Phim</DialogTitle>
        
        {/* Wrapper giữ tỉ lệ 16:9 */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/20 shadow-2xl">
            <iframe
            src={getEmbedUrl(trailerUrl)}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            />
        </div>
        </DialogContent>
    </Dialog>
  );
}
