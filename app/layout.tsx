import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tropicalphim.com'),
  title: {
    default: "TropicalPhim — Xem Phim Trực Tuyến Miễn Phí",
    template: "%s | TropicalPhim",
  },
  description:
    "TropicalPhim — Nền tảng xem phim trực tuyến miễn phí chất lượng cao. Tổng hợp phim mới, phim bộ, phim lẻ, hoạt hình Vietsub & Thuyết Minh nhanh nhất.",
  keywords: ["xem phim", "xem phim trực tuyến", "phim mới", "phim vietsub", "tropicalphim", "phim hd"],
  authors: [{ name: "TropicalPhim Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://tropicalphim.com",
    siteName: "TropicalPhim",
    title: "TropicalPhim — Xem Phim Trực Tuyến Miễn Phí",
    description: "Nền tảng xem phim trực tuyến miễn phí chất lượng cao. Cập nhật phim mới mỗi ngày.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TropicalPhim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TropicalPhim — Xem Phim Trực Tuyến Miễn Phí",
    description: "Nền tảng xem phim trực tuyến miễn phí chất lượng cao.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://tropicalphim.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

import Layout from "./components/Layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/*
          Preconnect hints dưới dạng JSX đảm bảo render trong SSR HTML.
          crossOrigin="anonymous" cần thiết khi request đến CORS domain.
        */}
        <link rel="preconnect" href="https://img.ophim.live" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ophim1.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.ophim.live" />
        <link rel="dns-prefetch" href="https://ophim1.com" />
      </head>
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  );
}
