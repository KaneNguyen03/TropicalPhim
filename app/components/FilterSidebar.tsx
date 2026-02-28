'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { categories, countries } from '../data/movies';

const qualities = ['4K', 'FHD', 'HD', 'CAM'];
const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCategories = searchParams?.getAll('category') || [];
  const selectedCountries = searchParams?.getAll('country') || [];
  const selectedYears = searchParams?.getAll('year').map(Number) || [];
  const selectedQualities = searchParams?.getAll('quality') || [];

  const updateUrl = (key: string, values: string[] | number[]) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete(key);
    values.forEach(v => params.append(key, v.toString()));
    router.push(`${pathname}?${params.toString()}`);
  };

  const onReset = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('category');
    params.delete('country');
    params.delete('year');
    params.delete('quality');
    router.push(`${pathname}?${params.toString()}`);
  };
  const toggleCategory = (categorySlug: string) => {
    if (selectedCategories.includes(categorySlug)) {
      updateUrl('category', selectedCategories.filter(c => c !== categorySlug));
    } else {
      updateUrl('category', [...selectedCategories, categorySlug]);
    }
  };

  const toggleCountry = (countrySlug: string) => {
    if (selectedCountries.includes(countrySlug)) {
      updateUrl('country', selectedCountries.filter(c => c !== countrySlug));
    } else {
      updateUrl('country', [...selectedCountries, countrySlug]);
    }
  };

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      updateUrl('year', selectedYears.filter(y => y !== year));
    } else {
      updateUrl('year', [...selectedYears, year]);
    }
  };

  const toggleQuality = (quality: string) => {
    if (selectedQualities.includes(quality)) {
      updateUrl('quality', selectedQualities.filter(q => q !== quality));
    } else {
      updateUrl('quality', [...selectedQualities, quality]);
    }
  };

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full border-white/20 text-white hover:bg-white/10"
      >
        <X className="mr-2 h-4 w-4" />
        Xóa Bộ Lọc
      </Button>

      {/* Quality */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Chất Lượng</h3>
        <div className="space-y-2">
          {qualities.map((quality) => (
            <div key={quality} className="flex items-center space-x-2">
              <Checkbox
                id={`quality-${quality}`}
                checked={selectedQualities.includes(quality)}
                onCheckedChange={() => toggleQuality(quality)}
                className="border-white/30 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]"
              />
              <Label
                htmlFor={`quality-${quality}`}
                className="text-sm text-white/80 cursor-pointer"
              >
                {quality}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Thể Loại</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2 pr-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => toggleCategory(category.slug)}
                  className="border-white/30 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm text-white/80 cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Countries */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Quốc Gia</h3>
        <ScrollArea className="h-[150px]">
          <div className="space-y-2 pr-4">
            {countries.map((country) => (
              <div key={country.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country.id}`}
                  checked={selectedCountries.includes(country.slug)}
                  onCheckedChange={() => toggleCountry(country.slug)}
                  className="border-white/30 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]"
                />
                <Label
                  htmlFor={`country-${country.id}`}
                  className="text-sm text-white/80 cursor-pointer"
                >
                  {country.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Years */}
      <div className="space-y-3">
        <h3 className="font-semibold text-white">Năm</h3>
        <div className="grid grid-cols-2 gap-2">
          {years.map((year) => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={selectedYears.includes(year)}
                onCheckedChange={() => toggleYear(year)}
                className="border-white/30 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00]"
              />
              <Label
                htmlFor={`year-${year}`}
                className="text-sm text-white/80 cursor-pointer"
              >
                {year}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-[#171717] border-r border-white/10 p-6">
        <div className="sticky top-20">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-[#CCFF00]" />
            <h2 className="font-bold text-white">Bộ Lọc</h2>
          </div>
          {renderFilterContent()}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="outline"
            className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-lg bg-[#CCFF00] hover:bg-[#CCFF00]/90 border-none"
          >
            <Filter className="h-6 w-6 text-[#0A0A0A]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-[#171717] border-white/10 w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#CCFF00]" />
              Bộ Lọc
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {renderFilterContent()}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
