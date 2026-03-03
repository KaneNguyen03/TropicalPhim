import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu CSS: inline critical CSS để loại bỏ render-blocking stylesheet (App Router compatible)
  experimental: {
    inlineCss: true,
  },
  compiler: {
    // Xóa console.log trên production build để giảm JS bundle size
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    // Ưu tiên AVIF (nhỏ hơn WebP ~50%), fallback WebP
    formats: ['image/avif', 'image/webp'],
    // Whitelist các giá trị quality được dùng trong app:
    // 60 = movie cards + hero slides không active (giảm từ 65 → 60: thêm ~10% savings)
    // 75 = hero LCP slide (giữ chất lượng cao cho ảnh hero rõ nét)
    qualities: [60, 75],
    // deviceSizes cho full-width images (hero slider, etc.)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes cho images có sizes prop (MovieCard grid, thumbnails)
    // Tính toán: card desktop max-width ~221px × DPR 2 = 442px cần thiết
    // Thêm 480 để bridge gap giữa 384 và 640:
    //   Trước: 384 < 442 → Next.js nhảy lên 640 (waste ~72 KiB/ảnh)
    //   Sau:   480 ≥ 442 → Next.js serve 480px (tiết kiệm ~72 KiB/ảnh)
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 480],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Minimize layout shift với minimumCacheTTL
    minimumCacheTTL: 86400 * 30, // 30 ngày
  },
};

export default nextConfig;
