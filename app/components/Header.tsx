import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

export function Header() {

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/search?category=phim-le', label: 'Phim Lẻ' },
    { href: '/search?category=phim-bo', label: 'Phim Bộ' },
    { href: '/search?category=hoat-hinh', label: 'Hoạt Hình' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/80">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <span className="text-[#CCFF00]">Tropical</span>
            <span className="text-white">Phim</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 hover:text-[#CCFF00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <form action="/search" method="GET" className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              name="q"
              type="search"
              placeholder="Tìm phim, diễn viên..."
              className="w-full pl-10 bg-[#171717] border-white/10 text-white placeholder:text-white/50 focus:border-[#CCFF00]"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:text-[#CCFF00]"
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-[#CCFF00]"
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#171717] border-white/10">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg text-white/80 hover:text-[#CCFF00] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
