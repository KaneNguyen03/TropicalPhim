'use client';

import { Filter, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '../components/ui/sheet';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../components/ui/utils';
import { useState } from 'react';

interface FilterItem {
  id: string;
  name: string;
  slug: string;
}

/** Server-provided current filter state — no useSearchParams needed */
interface CurrentFilters {
  category?: string;
  country?: string;
  year?: string;
  quality?: string;
  type?: string;
  q?: string;
}

interface FilterSidebarProps {
  categories: FilterItem[];
  countries: FilterItem[];
  currentFilters?: CurrentFilters;
}

const qualities = ['4K', 'FHD', 'HD', 'CAM'];
const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
const types = [
  { label: 'Phim Lẻ', slug: 'phim-le' },
  { label: 'Phim Bộ', slug: 'phim-bo' },
  { label: 'Hoạt Hình', slug: 'hoat-hinh' },
  { label: 'TV Shows', slug: 'tv-shows' },
];

/** Build a URL combining current filters + toggling one key */
function buildFilterUrl(
  current: CurrentFilters,
  key: string,
  value: string
): string {
  const params = new URLSearchParams();

  // Carry over keyword if present
  if (current.q) params.set('q', current.q);

  const merged: Record<string, string> = Object.fromEntries(
    Object.entries({
      category: current.category,
      country:  current.country,
      year:     current.year,
      quality:  current.quality,
      type:     current.type,
    }).filter(([, v]) => Boolean(v)) as [string, string][]
  );

  // Toggle: if same value → remove, else set
  if (merged[key] === value) {
    delete merged[key];
  } else {
    merged[key] = value;
    // Clear conflicting params:
    // - type vs category dùng endpoint khác nhau, không thể đi chung
    // - type vẫn có thể kết hợp với country/year (Ophim cho phép)
    if (key === 'type') { delete merged.category; }
    if (key === 'category') { delete merged.type; }
    if (key === 'country') { delete merged.type; }
  }

  for (const [k, v] of Object.entries(merged)) params.set(k, v);
  const qs = params.toString();
  return qs ? `/search?${qs}` : '/search';
}

function buildResetUrl(current: CurrentFilters): string {
  if (current.q) return `/search?q=${encodeURIComponent(current.q)}`;
  return '/search';
}

function FilterChipLink({
  label,
  active,
  href,
  isMobile,
}: {
  label: string;
  active: boolean;
  href: string;
  isMobile?: boolean;
}) {
  const content = (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border inline-block',
        active
          ? 'bg-[#CCFF00] text-[#0A0A0A] border-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.3)]'
          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
      )}
    >
      {label}
    </Link>
  );

  if (isMobile) {
    return <SheetClose asChild>{content}</SheetClose>;
  }

  return content;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3 cursor-pointer group"
      >
        <h3 className="font-semibold text-white text-sm group-hover:text-[#CCFF00] transition-colors">{title}</h3>
        <ChevronDown className={cn('h-4 w-4 text-white/40 transition-transform group-hover:text-[#CCFF00]', isOpen && 'rotate-180')} />
      </button>
      {isOpen && children}
    </div>
  );
}

export function FilterSidebar({ categories, countries, currentFilters = {} }: FilterSidebarProps) {
  const selectedCategory = currentFilters.category ?? '';
  const selectedCountry = currentFilters.country ?? '';
  const selectedYear = currentFilters.year ?? '';
  const selectedQuality = currentFilters.quality ?? '';
  const selectedType = currentFilters.type ?? '';

  const hasActiveFilters = selectedCategory || selectedCountry || selectedYear || selectedQuality || selectedType;

  const renderFilterContent = (isMobile: boolean = false) => (
    <div className="space-y-4">
      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="w-full">
          {isMobile ? (
            <SheetClose asChild>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full text-white/60 hover:text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-all duration-200"
              >
                <Link href={buildResetUrl(currentFilters)} prefetch={false}>
                  <X className="mr-2 h-3.5 w-3.5" />
                  Xóa bộ lọc
                </Link>
              </Button>
            </SheetClose>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full text-white/60 hover:text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-all duration-200"
            >
              <Link href={buildResetUrl(currentFilters)} prefetch={false}>
                <X className="mr-2 h-3.5 w-3.5" />
                Xóa bộ lọc
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Loại Phim */}
      <CollapsibleSection title="Loại Phim">
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <FilterChipLink
              key={t.slug}
              label={t.label}
              isMobile={isMobile}
              active={selectedType === t.slug}
              href={buildFilterUrl(currentFilters, 'type', t.slug)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Chất Lượng */}
      <CollapsibleSection title="Chất Lượng">
        <div className="flex flex-wrap gap-1.5">
          {qualities.map((q) => (
            <FilterChipLink
              key={q}
              label={q}
              isMobile={isMobile}
              active={selectedQuality === q}
              href={buildFilterUrl(currentFilters, 'quality', q)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Thể Loại */}
      <CollapsibleSection title="Thể Loại" defaultOpen={false}>
        <ScrollArea className="h-[220px] pr-1">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <FilterChipLink
                key={cat.id}
                label={cat.name}
                isMobile={isMobile}
                active={selectedCategory === cat.slug}
                href={buildFilterUrl(currentFilters, 'category', cat.slug)}
              />
            ))}
          </div>
        </ScrollArea>
      </CollapsibleSection>

      {/* Quốc Gia */}
      <CollapsibleSection title="Quốc Gia" defaultOpen={false}>
        <ScrollArea className="h-[220px] pr-1">
          <div className="flex flex-wrap gap-1.5">
            {countries.map((country) => (
              <FilterChipLink
                key={country.id}
                label={country.name}
                isMobile={isMobile}
                active={selectedCountry === country.slug}
                href={buildFilterUrl(currentFilters, 'country', country.slug)}
              />
            ))}
          </div>
        </ScrollArea>
      </CollapsibleSection>

      {/* Năm */}
      <CollapsibleSection title="Năm Phát Hành" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {years.map((year) => (
            <FilterChipLink
              key={year}
              label={String(year)}
              isMobile={isMobile}
              active={selectedYear === String(year)}
              href={buildFilterUrl(currentFilters, 'year', String(year))}
            />
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-[#0D0D0D] border-r border-white/10">
        <div className="sticky top-16 p-5 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="h-4 w-4 text-[#CCFF00]" />
            <h2 className="font-bold text-white">Bộ Lọc</h2>
          </div>
          {renderFilterContent(false)}
        </div>
      </aside>

      {/* Mobile Filter FAB */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="outline"
            className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-lg bg-[#CCFF00] hover:bg-[#CCFF00]/90 border-none p-0 cursor-pointer"
          >
            <Filter className="h-6 w-6 text-[#0A0A0A]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-[#171717] border-white/10 w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2 font-bold">
              <Filter className="h-4 w-4 text-[#CCFF00]" />
              Bộ Lọc
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto pr-2 h-[calc(100vh-8rem)]">
            {renderFilterContent(true)}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
