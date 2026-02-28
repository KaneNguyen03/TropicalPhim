'use client'

import { Home, Search, Film, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '../components/ui/utils';
import { Suspense } from 'react';

const navItems = [
  { icon: Home, label: 'Trang Chủ', path: '/', matchExact: true },
  { icon: Search, label: 'Tìm Kiếm', path: '/search', params: {}, matchExact: true },
  { icon: Film, label: 'Phim Bộ', path: '/search', params: { type: 'phim-bo' }, matchExact: false },
  { icon: Tv, label: 'Phim Lẻ', path: '/search', params: { type: 'phim-le' }, matchExact: false },
];

function NavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="grid grid-cols-4 h-16">
      {navItems.map((item) => {
        let isActive = false;
        
        if (item.matchExact) {
          isActive = pathname === item.path && (!item.params || Object.keys(item.params).length === 0 || Array.from(searchParams.entries()).length === 0);
        } else if (item.params) {
          isActive = pathname === item.path && Object.entries(item.params).every(([key, val]) => searchParams.get(key) === val);
        } else {
          isActive = pathname.startsWith(item.path);
        }

        const href = item.params && Object.keys(item.params).length > 0
          ? `${item.path}?${new URLSearchParams(item.params as Record<string, string>).toString()}`
          : item.path;

        return (
          <Link
            key={href}
            href={href}
            prefetch={true}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              isActive
                ? 'text-[#CCFF00]'
                : 'text-white/60 hover:text-white'
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#171717]/95 border-t border-white/10 backdrop-blur-lg">
      <Suspense fallback={<div className="h-16 w-full animate-pulse bg-white/5" />}>
        <NavContent />
      </Suspense>
    </nav>
  );
}
