import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu CSS: inline critical CSS để loại bỏ render-blocking stylesheet (App Router compatible)
  experimental: {
    inlineCss: true,
  },
  images: {
    // Ưu tiên AVIF (nhỏ hơn WebP ~50%), fallback WebP
    formats: ['image/avif', 'image/webp'],
    // Whitelist các giá trị quality được dùng trong app:
    // 60 = hero slides chưa active, 65 = movie cards, 75 = hero LCP slide
    qualities: [60, 65, 75],
    // deviceSizes khớp breakpoints Tailwind: sm(640) md(768) lg(1024) xl(1280) 2xl(1536) 4K
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes cho fill/fixed images: khớp với grid columns thực tế
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Minimize layout shift với minimumCacheTTL
    minimumCacheTTL: 86400, // 24 tiếng
  },
};

export default nextConfig;
