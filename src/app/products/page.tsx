'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS, BRANDS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import {
  SlidersHorizontal, RotateCcw, ChevronDown, Check, X, Star,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function ProductsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const urlCategory = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';
  const urlSearch = searchParams.get('search') || '';

  // Quản lý state bộ lọc
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedRam, setSelectedRam] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // State mở Popover bộ lọc (mobile & desktop)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setSearchQuery(urlSearch);

    // Reset page loading when URL search params change
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [urlCategory, urlBrand, urlSearch]);

  const priceRanges = [
    { id: 'under-5', name: 'Dưới 5 triệu', min: 0, max: 5000000 },
    { id: '5-10', name: '5 - 10 triệu', min: 5000000, max: 10000000 },
    { id: '10-20', name: '10 - 20 triệu', min: 10000000, max: 20000000 },
    { id: 'over-20', name: 'Trên 20 triệu', min: 20000000, max: 999999999 }
  ];

  const rams = ['6 GB', '8 GB', '12 GB', '16 GB'];

  // --- XỬ LÝ LỌC ---

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedPriceRange('');
    setSelectedRam('');
    setSearchQuery('');
    setSortBy('featured');
    router.push('/products');
  };

  const hasActiveFilters = selectedCategory || selectedBrand || selectedPriceRange || selectedRam || searchQuery;

  // --- DATA LỌC & SẮP XẾP ---

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedBrand && product.brand !== selectedBrand) return false;

    const discountedPrice = Math.round(product.basePrice * (1 - product.discount / 100));
    if (selectedPriceRange) {
      const activeRange = priceRanges.find(r => r.id === selectedPriceRange);
      if (activeRange) {
        if (discountedPrice < activeRange.min || discountedPrice > activeRange.max) return false;
      }
    }

    if (selectedRam && !product.specs.ram.toLowerCase().includes(selectedRam.toLowerCase())) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!product.name.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Math.round(a.basePrice * (1 - a.discount / 100));
    const priceB = Math.round(b.basePrice * (1 - b.discount / 100));

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discount - a.discount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // --- CONFIG CHO POPOVER BỘ LỌC ---
  const FilterContent = () => (
    <div className="w-[320px] sm:w-[360px] p-4 max-h-[80vh] overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-extrabold text-brand-black text-base flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Bộ lọc nâng cao
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={() => {
              handleResetFilters();
              setIsFilterOpen(false);
            }} 
            className="cursor-pointer text-primary text-[11px] font-bold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Xóa tất cả
          </button>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Danh mục */}
      <div className="space-y-2 mb-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-4 text-left">Danh Mục</h4>
        <div className="flex flex-col gap-1 px-4">
          <button 
            onClick={() => {
              setSelectedCategory('');
              setIsFilterOpen(false);
            }} 
            className={cn("cursor-pointer flex items-center justify-between text-xs font-bold px-3 py-2.5 rounded-xl text-left transition w-full", !selectedCategory ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50')}
          >
            <span>Tất cả</span>
            {!selectedCategory && <Check className="h-3.5 w-3.5" />}
          </button>
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => {
                setSelectedCategory(cat.id);
                setIsFilterOpen(false);
              }} 
              className={cn("cursor-pointer flex items-center justify-between text-xs font-bold px-3 py-2.5 rounded-xl text-left transition w-full", selectedCategory === cat.id ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50')}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Mức giá */}
      <div className="space-y-2 mb-5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-4 text-left">Mức Giá</h4>
        <div className="flex flex-col gap-1 px-4">
          {priceRanges.map((range) => (
            <button 
              key={range.id} 
              onClick={() => {
                setSelectedPriceRange(selectedPriceRange === range.id ? '' : range.id);
                setIsFilterOpen(false);
              }} 
              className={cn("cursor-pointer flex items-center justify-between text-xs font-bold px-3 py-2.5 rounded-xl text-left transition w-full", selectedPriceRange === range.id ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50')}
            >
              <span>{range.name}</span>
              {selectedPriceRange === range.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* RAM */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-4 text-left">Bộ Nhớ RAM</h4>
        <div className="flex flex-wrap gap-2 px-4">
          {rams.map((ram) => (
            <button 
              key={ram} 
              onClick={() => {
                setSelectedRam(selectedRam === ram ? '' : ram);
                setIsFilterOpen(false);
              }} 
              className={cn("cursor-pointer text-xs font-bold py-2 px-3 border rounded-xl transition", selectedRam === ram ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // --- UI COMPONENTS ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 flex flex-col bg-[#f5f5f7]">

      {/* HEADER TIÊU ĐỀ */}
      <div className="mb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-black">
          {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Tất Cả Sản Phẩm'}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
          Hiển thị <strong className="text-[#d70018f2]">{sortedProducts.length}</strong> sản phẩm phù hợp
        </p>
      </div>

      {/* FILTER BAR (TOP) - Giống CellphoneS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 mb-6 flex flex-wrap items-center gap-2 sticky top-[72px] z-30 backdrop-blur-md bg-white/95">

        {/* 1. Nút Bộ Lọc (Popover) */}

        {/* 2. Filter Chips (Quick Filters) - Desktop & Mobile */}
        {/* Chip Hãng */}
        {/* Danh sách hãng */}
        <div className="w-full mb-4">
          <h3 className="text-sm font-bold text-brand-black mb-3">
            Chọn hãng
          </h3>

          <div className="flex flex-wrap gap-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="cursor-pointer flex items-center gap-2 h-9 px-4 text-xs font-bold border-gray-200 hover:border-primary hover:text-primary rounded-full">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ Lọc
                  {hasActiveFilters && <span className="bg-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center">!</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0 border-none ring-0 shadow-lg bg-popover text-popover-foreground rounded-2xl" align="start">
                <FilterContent />
              </PopoverContent>
            </Popover>
            <button
              onClick={() => setSelectedBrand("")}
              className={cn(
                "cursor-pointer px-5 py-2 rounded-xl border text-sm font-semibold transition",
                selectedBrand === ""
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white hover:border-primary hover:text-primary"
              )}
            >
              Tất cả
            </button>

            {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={cn(
                  "cursor-pointer px-5 py-2 rounded-xl border text-sm font-semibold transition",
                  selectedBrand === brand
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white hover:border-primary hover:text-primary"
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Chip Giá */}
        <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="cursor-pointer flex items-center gap-1.5 h-9 px-4 text-xs font-bold border-gray-200 hover:border-primary hover:text-primary rounded-full">
              Giá {selectedPriceRange && <span className="text-primary">({priceRanges.find(r => r.id === selectedPriceRange)?.name})</span>}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 border-none ring-0 shadow-lg bg-popover text-popover-foreground rounded-2xl" align="start">
            <div className="flex flex-col gap-1 px-1 w-full">
              <button 
                onClick={() => {
                  setSelectedPriceRange('');
                  setIsPriceOpen(false);
                }} 
                className={cn("cursor-pointer flex items-center justify-between text-xs font-bold px-3 py-2 rounded-lg text-left transition w-full", !selectedPriceRange ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50')}
              >
                <span>Tất cả</span>
                {!selectedPriceRange && <Check className="h-3.5 w-3.5" />}
              </button>
              {priceRanges.map((range) => (
                <button 
                  key={range.id} 
                  onClick={() => {
                    setSelectedPriceRange(range.id);
                    setIsPriceOpen(false);
                  }} 
                  className={cn("cursor-pointer flex items-center justify-between text-xs font-bold px-3 py-2 rounded-lg text-left transition w-full", selectedPriceRange === range.id ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50')}
                >
                  <span>{range.name}</span>
                  {selectedPriceRange === range.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 3. Hiển thị chip lọc đang active */}
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory('')} 
            className="cursor-pointer h-9 px-3 text-xs font-bold bg-primary-light text-primary rounded-full flex items-center gap-1.5 border border-primary/20 hover:bg-red-100 transition"
          >
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
            <X className="h-3 w-3" />
          </button>
        )}
        {selectedRam && (
          <button 
            onClick={() => setSelectedRam('')} 
            className="cursor-pointer h-9 px-3 text-xs font-bold bg-primary-light text-primary rounded-full flex items-center gap-1.5 border border-primary/20 hover:bg-red-100 transition"
          >
            RAM: {selectedRam}
            <X className="h-3 w-3" />
          </button>
        )}

        {/* 4. Nút Reset tất cả */}
        {hasActiveFilters && (
          <button 
            onClick={handleResetFilters} 
            className="cursor-pointer h-9 px-3 text-xs font-bold text-gray-500 hover:text-primary rounded-full flex items-center gap-1 transition"
          >
            <RotateCcw className="h-3 w-3" /> Bỏ lọc
          </button>
        )}

        {/* 5. Khoảng trống đẩy Sort Bar sang phải */}
        <div className="flex-1"></div>

        {/* 6. Sort Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-50 rounded-full p-1">
          {[
            { id: 'featured', name: 'Nổi bật' },
            { id: 'price-asc', name: 'Giá tăng', icon: <ArrowUp className="h-3 w-3" /> },
            { id: 'price-desc', name: 'Giá giảm', icon: <ArrowDown className="h-3 w-3" /> },
            { id: 'rating', name: 'Đánh giá' },
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition",
                sortBy === sort.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-brand-black'
              )}
            >
              {sort.icon}
              {sort.name}
            </button>
          ))}
        </div>
      </div>

      {/* SORT BAR (MOBILE) */}
      <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'featured', name: 'Nổi bật' },
          { id: 'price-asc', name: 'Giá tăng', icon: <ArrowUp className="h-3 w-3" /> },
          { id: 'price-desc', name: 'Giá giảm', icon: <ArrowDown className="h-3 w-3" /> },
          { id: 'rating', name: 'Đánh giá' },
        ].map((sort) => (
          <button
            key={sort.id}
            onClick={() => setSortBy(sort.id)}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap transition",
              sortBy === sort.id ? 'bg-brand-black text-white border-brand-black' : 'bg-white text-gray-600 border-gray-200'
            )}
          >
            {sort.icon}
            {sort.name}
          </button>
        ))}
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <section>
        {isPageLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-gray-100 rounded-3xl p-4 flex flex-col justify-between h-[360px]"
              >
                <div>
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-4" />
                  {/* Brand Placeholder */}
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                  {/* Name Placeholder */}
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  {/* Specs tag Placeholder */}
                  <div className="flex gap-2.5 mb-3">
                    <div className="h-3 bg-gray-150 rounded w-1/4" />
                    <div className="h-3 bg-gray-150 rounded w-1/3" />
                  </div>
                  {/* Star Rating Placeholder */}
                  <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                </div>
                {/* Pricing Area Placeholder */}
                <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-50">
                  <div className="space-y-1.5 w-1/2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-150 rounded w-1/2" />
                  </div>
                  {/* Add to Cart button Placeholder */}
                  <div className="w-9 h-9 rounded-2xl bg-gray-200 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <X className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-display font-bold text-lg text-brand-black mb-2">
              Không tìm thấy sản phẩm!
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mb-6 font-medium">
              Rất tiếc, chúng tôi không tìm thấy thiết bị nào khớp với bộ lọc của bạn. Vui lòng thử lại với lựa chọn khác.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-2xl transition shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Reset Bộ Lọc
            </button>
          </motion.div>
        )}
      </section>

    </div>
  );
}

export default function ProductsList() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-20 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsListContent />
    </Suspense>
  );
}