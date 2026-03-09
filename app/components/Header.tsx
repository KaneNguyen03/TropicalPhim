import Link from 'next/link';
import { Menu, ChevronDown, Film, Globe, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '../components/ui/sheet';
import { getCategories, getCountries } from '../services/ophim';
import { SearchBar } from '../components/SearchBar';

const danhSachLinks = [
  { label: 'Phim Lẻ', href: '/search?type=phim-le' },
  { label: 'Phim Bộ', href: '/search?type=phim-bo' },
  { label: 'Hoạt Hình', href: '/search?type=hoat-hinh' },
  { label: 'Phim Mới Cập Nhật', href: '/search?type=phim-moi-cap-nhat' },
  { label: 'TV Shows', href: '/search?type=tv-shows' },
];

export async function Header() {
  const [categories, countries] = await Promise.all([
    getCategories(),
    getCountries(),
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur supports-backdrop-filter:bg-[#0A0A0A]/80" suppressHydrationWarning>
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8 max-w-[1440px] mx-auto" suppressHydrationWarning>
        {/* Logo */}
        <Link href="/" prefetch={false} className="flex items-center space-x-2 shrink-0">
          <span className="block text-2xl font-bold">
            <span className="text-[#CCFF00]">Tropical</span>
            <span className="text-white">Phim</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            prefetch={false}
            className="px-3 py-2 text-sm text-white/80 hover:text-[#CCFF00] transition-colors rounded-md hover:bg-white/5"
          >
            Trang Chủ
          </Link>

          {/* Thể Loại Dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-white/80 hover:text-[#CCFF00] transition-colors rounded-md hover:bg-white/5">
              <Film className="h-4 w-4" />
              Thể Loại
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#171717] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-3 w-72 grid grid-cols-2 gap-1">
                {categories.slice(0, 24).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}`}
                    prefetch={false}
                    className="text-sm text-white/70 hover:text-[#CCFF00] hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quốc Gia Dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-white/80 hover:text-[#CCFF00] transition-colors rounded-md hover:bg-white/5">
              <Globe className="h-4 w-4" />
              Quốc Gia
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#171717] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-3 w-64 grid grid-cols-2 gap-1">
                {countries.slice(0, 20).map((country) => (
                  <Link
                    key={country.id}
                    href={`/search?country=${country.slug}`}
                    prefetch={false}
                    className="text-sm text-white/70 hover:text-[#CCFF00] hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors truncate"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Danh Sách Dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-white/80 hover:text-[#CCFF00] transition-colors rounded-md hover:bg-white/5">
              <List className="h-4 w-4" />
              Danh Sách
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#171717] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-3 w-52 flex flex-col gap-1">
                {danhSachLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-white/70 hover:text-[#CCFF00] hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Search Bar - Desktop & Mobile */}
        <div className="flex-1 max-w-xs mx-3 md:mx-6">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Favorites/Search button removed as SearchBar is now visible */}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:text-[#CCFF00]" aria-label="Mở menu điều hướng">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#171717] border-white/10 w-[280px] overflow-y-auto">
              <SheetTitle className="text-white text-lg font-bold mb-6">
                <span className="text-[#CCFF00]">Tropical</span>Phim
              </SheetTitle>
              <nav className="flex flex-col space-y-1">
                <SheetClose asChild>
                  <Link href="/" prefetch={false} className="text-base text-white/80 hover:text-[#CCFF00] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    Trang Chủ
                  </Link>
                </SheetClose>

                <div className="pt-4 pb-2">
                  <p className="text-xs text-white/60 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <Film className="h-3 w-3" /> Thể Loại
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.slice(0, 16).map((cat) => (
                      <SheetClose key={cat.id} asChild>
                        <Link href={`/search?category=${cat.slug}`} prefetch={false}
                          className="text-sm text-white/70 hover:text-[#CCFF00] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors truncate">
                          {cat.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                <div className="pt-2 pb-2">
                  <p className="text-xs text-white/60 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Quốc Gia
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {countries.slice(0, 12).map((country) => (
                      <SheetClose key={country.id} asChild>
                        <Link href={`/search?country=${country.slug}`} prefetch={false}
                          className="text-sm text-white/70 hover:text-[#CCFF00] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors truncate">
                          {country.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-white/60 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                    <List className="h-3 w-3" /> Danh Sách
                  </p>
                  {danhSachLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href} prefetch={false}
                        className="block text-sm text-white/70 hover:text-[#CCFF00] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
