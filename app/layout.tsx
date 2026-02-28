import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TropicalPhim — Xem Phim Trực Tuyến",
    template: "%s | TropicalPhim",
  },
  description:
    "TropicalPhim — Tổng hợp phim trực tuyến miễn phí, xem phim HD Vietsub, Thuyết Minh mới nhất 2026.",
  icons: {
    icon: "/favicon.svg",
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
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
