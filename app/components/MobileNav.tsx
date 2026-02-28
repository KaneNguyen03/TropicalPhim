'use client'

import { Home, Search, Film, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../components/ui/utils';

const navItems = [
  { icon: Home, label: 'Trang Chủ', path: '/', matchExact: true },
  { icon: Search, label: 'Tìm Kiếm', path: '/search', matchExact: false },
  { icon: Film, label: 'Phim Bộ', path: '/search?type=phim-bo', matchExact: false },
  { icon: Tv, label: 'Phim Lẻ', path: '/search?type=phim-le', matchExact: false },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#171717]/95 border-t border-white/10 backdrop-blur-lg">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.path
            : pathname.startsWith(item.path.split('?')[0]) && item.path === '/search'
              ? pathname === '/search'
              : pathname === item.path.split('?')[0];

          return (
            <Link
              key={item.path}
              href={item.path}
              prefetch={true}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-[#CCFF00]'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
