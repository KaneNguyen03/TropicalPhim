
import Link from 'next/link';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#171717] mt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="text-2xl font-bold">
                <span className="text-[#CCFF00]">Tropical</span>
                <span className="text-white">Phim</span>
              </div>
              <p className="text-white/60 text-sm">
                Nền tảng xem phim trực tuyến cao cấp với hàng ngàn bộ phim chất lượng HD, 4K.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Khám Phá</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/" className="hover:text-[#CCFF00] transition-colors">Trang Chủ</Link></li>
                <li><Link href="/search" className="hover:text-[#CCFF00] transition-colors">Phim Lẻ</Link></li>
                <li><Link href="/search" className="hover:text-[#CCFF00] transition-colors">Phim Bộ</Link></li>
                <li><Link href="/search" className="hover:text-[#CCFF00] transition-colors">Hoạt Hình</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">Thể Loại</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/search?category=hanh-dong" className="hover:text-[#CCFF00] transition-colors">Hành Động</Link></li>
                <li><Link href="/search?category=phieu-luu" className="hover:text-[#CCFF00] transition-colors">Phiêu Lưu</Link></li>
                <li><Link href="/search?category=lang-man" className="hover:text-[#CCFF00] transition-colors">Lãng Mạn</Link></li>
                <li><Link href="/search?category=kinh-di" className="hover:text-[#CCFF00] transition-colors">Kinh Dị</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hỗ Trợ</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="#" className="hover:text-[#CCFF00] transition-colors">Trung Tâm Trợ Giúp</Link></li>
                <li><Link href="#" className="hover:text-[#CCFF00] transition-colors">Liên Hệ</Link></li>
                <li><Link href="#" className="hover:text-[#CCFF00] transition-colors">Điều Khoản</Link></li>
                <li><Link href="#" className="hover:text-[#CCFF00] transition-colors">Bảo Mật</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
            © 2026 TropicalPhim. Thiết kế bởi Figma Make - Nền tảng phim cao cấp.
          </div>
        </div>
      </footer>
    </div>
  );
}