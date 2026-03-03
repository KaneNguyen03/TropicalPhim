import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu CSS: inline critical CSS để loại bỏ render-blocking stylesheet
  experimental: {
    inlineCss: true,
  },
  // Next.js 16 dùng Turbopack mặc định — khai báo để silence warning
  // Turbopack tự tree-shake và handle modern browser targets tốt hơn Webpack
  turbopack: {},
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
    // 60 = movie cards + hero slides không active
    // 75 = hero LCP slide (giữ chất lượng cao)
    qualities: [60, 75],
    // deviceSizes cho full-width images (hero slider, etc.)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes cho images có sizes prop (MovieCard grid):
    // Card desktop ~221px × DPR 2 = 442px → 480 ≥ 442 ✓ (tránh nhảy lên 640)
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 480],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Cache ảnh 30 ngày để giảm re-fetch
    minimumCacheTTL: 86400 * 30,
  },
};

export default nextConfig;
