'use client'

import { Home, Search, Film, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '../components/ui/utils';

export function MobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navItems = [
    { icon: Home, label: 'Trang Chủ', path: '/' },
    { icon: Search, label: 'Tìm Kiếm', path: '/search' },
    { icon: Film, label: 'Phim Bộ', path: '/search?type=series' },
    { icon: User, label: 'Cá Nhân', path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#171717] border-t border-white/10 backdrop-blur-lg">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path || 
            (item.path.includes('?') && pathname + '?' + (searchParams?.toString() || '') === item.path);
          
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
