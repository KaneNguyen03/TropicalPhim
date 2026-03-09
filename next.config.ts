import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu CSS: inline critical CSS để loại bỏ render-blocking stylesheet
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "date-fns", "recharts"],
  },
  compiler: {
    // Xóa console.log trên production build để giảm JS bundle size
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  images: {
    // Ưu tiên AVIF (nhỏ hơn WebP ~50%), fallback WebP
    formats: ["image/avif", "image/webp"],
    // Whitelist các giá trị quality được dùng trong app:
    // 40 = cực nhỏ cho ảnh movie card không active (lazy load)
    // 60 = movie card (ưu tiên LCP) + ảnh slider nền
    // 75 = hero LCP slide (giữ chất lượng cao)
    // 90 = ảnh ưu tiên siêu nét (ví dụ MovieCard priority)
    qualities: [20, 40, 60, 75, 80, 90, 95],
    // deviceSizes cho full-width images (hero slider, etc.)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes cho images có sizes prop (MovieCard grid):
    // 200px card @ DPR1 → 256, @ DPR1.5 → 320 (mới), @ DPR2 → 384
    // 220px card desktop @ DPR2 → 480 ✓ (tránh nhảy lên 640)
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 320, 384, 480],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Cache ảnh 30 ngày để giảm re-fetch
    minimumCacheTTL: 86400 * 30,
    // Tránh timeout Optimizer trong môi trường dev (chậm do chuyển đổi AVIF/WebP từ Ophim)
    // Prod vẫn dùng optimizer đầy đủ để tối ưu tốc độ tải.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
