
import { Suspense } from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Suspense fallback={
        <header className="sticky top-0 z-50 w-full h-16 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur" />
      }>
        <Header />
      </Suspense>
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D0D0D] mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span className="text-[#CCFF00]">Tropical</span>
                <span className="text-white">Phim</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Tổng hợp và cung cấp liên kết xem phim trực tuyến từ nhiều nguồn công khai trên internet.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Khám Phá</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/" className="hover:text-[#CCFF00] transition-colors">Trang Chủ</Link></li>
                <li><Link href="/search?type=phim-le" className="hover:text-[#CCFF00] transition-colors">Phim Lẻ</Link></li>
                <li><Link href="/search?type=phim-bo" className="hover:text-[#CCFF00] transition-colors">Phim Bộ</Link></li>
                <li><Link href="/search?type=hoat-hinh" className="hover:text-[#CCFF00] transition-colors">Hoạt Hình</Link></li>
                <li><Link href="/search?type=tv-shows" className="hover:text-[#CCFF00] transition-colors">TV Shows</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">Thể Loại</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/search?category=hanh-dong" className="hover:text-[#CCFF00] transition-colors">Hành Động</Link></li>
                <li><Link href="/search?category=tinh-cam" className="hover:text-[#CCFF00] transition-colors">Tình Cảm</Link></li>
                <li><Link href="/search?category=co-trang" className="hover:text-[#CCFF00] transition-colors">Cổ Trang</Link></li>
                <li><Link href="/search?category=kinh-di" className="hover:text-[#CCFF00] transition-colors">Kinh Dị</Link></li>
                <li><Link href="/search?category=vien-tuong" className="hover:text-[#CCFF00] transition-colors">Viễn Tưởng</Link></li>
              </ul>
            </div>

            {/* Countries */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quốc Gia</h3>
              <ul className="space-y-2 text-sm text-white/50">
                <li><Link href="/search?country=han-quoc" className="hover:text-[#CCFF00] transition-colors">Hàn Quốc</Link></li>
                <li><Link href="/search?country=trung-quoc" className="hover:text-[#CCFF00] transition-colors">Trung Quốc</Link></li>
                <li><Link href="/search?country=au-my" className="hover:text-[#CCFF00] transition-colors">Âu Mỹ</Link></li>
                <li><Link href="/search?country=nhat-ban" className="hover:text-[#CCFF00] transition-colors">Nhật Bản</Link></li>
                <li><Link href="/search?country=thai-lan" className="hover:text-[#CCFF00] transition-colors">Thái Lan</Link></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <div className="bg-[#171717] border border-yellow-500/20 rounded-xl px-5 py-4 text-xs text-white/50 leading-relaxed space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-yellow-500 text-sm shrink-0">⚠️</span>
                <span>
                  <strong className="text-white/70">Tuyên bố miễn trừ trách nhiệm:</strong> TropicalPhim không lưu trữ bất kỳ tệp tin phim nào trên máy chủ. 
                  Toàn bộ nội dung được tổng hợp và liên kết từ các nguồn phim công khai có sẵn trên internet. 
                  Đây là dự án mang tính chất học tập và phi lợi nhuận.
                </span>
              </p>
              <p className="pl-6">
                Nếu bạn là chủ sở hữu bản quyền của bất kỳ nội dung nào được hiển thị trên trang web này và muốn gỡ bỏ, 
                vui lòng liên hệ với chúng tôi và nội dung sẽ được xử lý ngay lập tức.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-xs text-white/30">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> <span className="text-[#CCFF00]/60">TropicalPhim</span>. Dự án mã nguồn mở — Không kinh doanh, không lưu trữ phim lậu.
          </div>
        </div>
      </footer>
    </div>
  );
}