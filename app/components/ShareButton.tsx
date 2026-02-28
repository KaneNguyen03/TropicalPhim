'use client';

import { Share2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error('Error sharing:', e);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className="border-white/30 bg-white/10 hover:bg-white/20 text-white transition-all"
      onClick={handleShare}
    >
      {copied ? <Check className="mr-2 h-5 w-5 text-green-400" /> : <Share2 className="mr-2 h-5 w-5" />}
      {copied ? "Đã copy link" : "Chia Sẻ"}
    </Button>
  );
}
