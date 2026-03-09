import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0D0D0D] mt-20">
      <div className="container mx-auto px-4 lg:px-8 pt-12 pb-24 md:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-[#CCFF00]">Tropical</span>
              <span className="text-white">Phim</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Tổng hợp và cung cấp liên kết xem phim trực tuyến từ nhiều nguồn công khai trên internet.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Khám Phá</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/" className="hover:text-[#CCFF00] transition-colors">Trang Chủ</Link></li>
              <li><Link href="/search?type=phim-le" className="hover:text-[#CCFF00] transition-colors">Phim Lẻ</Link></li>
              <li><Link href="/search?type=phim-bo" className="hover:text-[#CCFF00] transition-colors">Phim Bộ</Link></li>
              <li><Link href="/search?type=hoat-hinh" className="hover:text-[#CCFF00] transition-colors">Hoạt Hình</Link></li>
              <li><Link href="/search?type=tv-shows" className="hover:text-[#CCFF00] transition-colors">TV Shows</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Thể Loại</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/search?category=hanh-dong" className="hover:text-[#CCFF00] transition-colors">Hành Động</Link></li>
              <li><Link href="/search?category=tinh-cam" className="hover:text-[#CCFF00] transition-colors">Tình Cảm</Link></li>
              <li><Link href="/search?category=co-trang" className="hover:text-[#CCFF00] transition-colors">Cổ Trang</Link></li>
              <li><Link href="/search?category=kinh-di" className="hover:text-[#CCFF00] transition-colors">Kinh Dị</Link></li>
              <li><Link href="/search?category=vien-tuong" className="hover:text-[#CCFF00] transition-colors">Viễn Tưởng</Link></li>
            </ul>
          </div>

          {/* Countries */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Quốc Gia</h3>
            <ul className="space-y-3 text-sm text-white/70 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 sm:space-y-0 lg:space-y-3">
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
          <div className="bg-[#171717]/80 backdrop-blur-sm border border-yellow-500/20 rounded-xl px-4 py-4 md:px-5 md:py-4 text-xs text-white/70 leading-relaxed space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="text-yellow-500 text-sm shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="mb-2">
                  <strong className="text-white/85">Tuyên bố miễn trừ trách nhiệm:</strong> TropicalPhim không lưu trữ bất kỳ tệp tin phim nào trên máy chủ. 
                  Toàn bộ nội dung được tổng hợp và liên kết từ các nguồn phim công khai có sẵn trên internet. 
                  Đây là dự án mang tính chất học tập và phi lợi nhuận.
                </p>
                <p>
                  Nếu bạn là chủ sở hữu bản quyền của bất kỳ nội dung nào được hiển thị trên trang web này và muốn gỡ bỏ, 
                  vui lòng liên hệ với chúng tôi và nội dung sẽ được xử lý ngay lập tức.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-white/60">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> <span className="text-[#CCFF00] font-medium">TropicalPhim</span>. Dự án mã nguồn mở.
          </p>
          <p>Không kinh doanh, không lưu trữ phim lậu.</p>
        </div>
      </div>
    </footer>
  );
}
