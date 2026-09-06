'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { FlashSale } from '@/components/FlashSale';
import { api, Category, Filter } from '@/lib/api';
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
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { cn } from '@/lib/utils';

function ProductsListContent() {
  const { products, isLoading: isProductsLoading } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<Filter[]>([]);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getFilters()
    ]).then(([catData, filterData]) => {
      if (catData) setCategories(catData);
      if (filterData) setFilterCriteria(filterData);
    }).catch(() => {});
  }, []);

  // Lấy params từ URL
  const urlCategory = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';
  const urlSearch = searchParams.get('search') || '';
  const urlAccessoryType = searchParams.get('accessory_type') || '';

  // Quản lý state bộ lọc
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [selectedCriteria, setSelectedCriteria] = useState<Record<string, string>>(
    urlAccessoryType ? { accessory_type: urlAccessoryType } : {}
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [inStock, setInStock] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // State mở Popover bộ lọc (mobile & desktop)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedBrand(urlBrand);
    setSearchQuery(urlSearch);
    if (urlAccessoryType) {
      setSelectedCriteria(prev => ({ ...prev, accessory_type: urlAccessoryType }));
    }

    setIsPageLoading(false);
  }, [urlCategory, urlBrand, urlSearch, urlAccessoryType]);

  const rams = ['6 GB', '8 GB', '12 GB', '16 GB'];

  // --- XỬ LÝ LỌC ---

  const handleCriterionSelect = (filterId: string, option: string) => {
    setSelectedCriteria(prev => {
      const newCriteria = { ...prev };
      if (newCriteria[filterId] === option) {
        delete newCriteria[filterId];
      } else {
        newCriteria[filterId] = option;
      }
      return newCriteria;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 50000000]);
    setSelectedCriteria({});
    setSearchQuery('');
    setSortBy('featured');
    router.push('/products');
  };

  const hasActiveFilters = selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 50000000 || Object.keys(selectedCriteria).length > 0 || searchQuery;

  // --- DATA LỌC & SẮP XẾP ---

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedBrand && product.brand !== selectedBrand) return false;

    const discountedPrice = product.basePrice;
    if (discountedPrice < priceRange[0] || discountedPrice > priceRange[1]) return false;

    if (Object.keys(selectedCriteria).length > 0) {
      for (const [key, value] of Object.entries(selectedCriteria)) {
        if (!value) continue;
        const specsString = JSON.stringify(product.specs).toLowerCase();
        if (!specsString.includes(value.toLowerCase())) {
          return false;
        }
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      if (!product.name.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.basePrice;
    const priceB = b.basePrice;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discount - a.discount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const activeFilterCriteria = (selectedCategory 
    ? filterCriteria.filter(c => 
        c.categories.includes(selectedCategory) || 
        (selectedCriteria['accessory_type'] && c.categories.includes(`${selectedCategory}_${selectedCriteria['accessory_type']}`))
      )
    : filterCriteria).filter(c => c.filterId !== 'accessory_type');

  // --- CONFIG CHO POPOVER BỘ LỌC ---
  const FilterContent = () => (
    <div className="w-[1100px] max-w-[95vw] bg-white rounded-2xl flex flex-col relative overflow-hidden">
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-sm font-bold text-brand-black uppercase tracking-wider">KHOẢNG GIÁ</h4>
            <div className="px-2 mt-4">
              <DualRangeSlider
                min={0}
                max={50000000}
                step={500000}
                value={priceRange}
                onChange={setPriceRange}
                formatLabel={(val) => val.toLocaleString('vi-VN') + ' đ'}
              />
            </div>
          </div>
          {activeFilterCriteria.map(criteria => (
            <div key={criteria.id} className={cn("space-y-3", criteria.options.length > 12 ? 'md:col-span-2' : '')}>
              <h4 className="text-sm font-bold text-brand-black uppercase tracking-wider">{criteria.name}</h4>
              <div className="flex flex-wrap gap-2">
                {criteria.options.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedCriteria(prev => ({
                        ...prev,
                        [criteria.id]: prev[criteria.id] === option ? '' : option
                      }));
                    }}
                    className={cn(
                      "cursor-pointer text-xs px-4 py-2 border rounded-full transition-colors",
                      selectedCriteria[criteria.id] === option
                        ? "bg-[#1A56DB] text-white font-bold border-[#1A56DB]"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 p-4 border-t border-gray-100 bg-white w-full">
        <Button variant="outline" className="w-32 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setIsFilterOpen(false)}>
          Đóng
        </Button>
        <Button className="w-32 rounded-xl bg-[#e57373] hover:bg-[#ef5350] text-white font-bold border-none" onClick={() => setIsFilterOpen(false)}>
          Xem kết quả
        </Button>
      </div>
    </div>
  );


  // --- UI COMPONENTS ---
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 flex-1 flex flex-col bg-[#f5f5f7]">

      {/* HEADER TIÊU ĐỀ */}
      <div className="mb-5">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-black">
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Tất Cả Sản Phẩm'}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
          Hiển thị <strong className="text-[#d70018f2]">{sortedProducts.length}</strong> sản phẩm phù hợp
        </p>
      </div>

      {/* FILTER BAR (TOP) - Mới */}
      <div className="p-4 sm:p-6 mb-6 flex flex-col gap-4 relative z-10">
        
        {/* Tiêu chí lọc */}
        <div>
          <h3 className="font-bold text-base text-brand-black mb-3">Chọn theo tiêu chí</h3>
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Nút Bộ Lọc Mega Menu */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button className="cursor-pointer flex items-center gap-2 h-9 px-4 text-xs font-bold border-none text-primary hover:bg-primary-light bg-white shadow-sm rounded-xl">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                  {(() => {
                    const activeCount = Object.entries(selectedCriteria).filter(([k, v]) => k !== 'accessory_type' && v !== '').length;
                    return activeCount > 0 && <span className="bg-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center">{activeCount}</span>;
                  })()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[1100px] max-w-[95vw] p-0 border-none ring-0 shadow-lg bg-transparent rounded-2xl" align="start">
                <FilterContent />
              </PopoverContent>
            </Popover>

            {activeFilterCriteria.map((filter) => {
              const hasSelection = !!selectedCriteria[filter.filterId];
              return (
                <Popover key={filter.filterId}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-8 rounded-full px-4 text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 whitespace-nowrap shadow-sm transition-all",
                        hasSelection && "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                      )}
                    >
                      {hasSelection ? (
                        <span className="flex items-center gap-1.5">
                          {filter.name}: {selectedCriteria[filter.filterId]}
                          <X
                            className="h-3.5 w-3.5 hover:text-red-500 hover:scale-110 transition-transform cursor-pointer ml-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCriterionSelect(filter.filterId, selectedCriteria[filter.filterId]);
                            }}
                          />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          {filter.name}
                          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl border-gray-100" align="start">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-50">
                        <span className="text-xs font-bold text-gray-900">{filter.name}</span>
                        {hasSelection && (
                          <span
                            className="text-[10px] text-primary cursor-pointer hover:underline font-semibold"
                            onClick={() => handleCriterionSelect(filter.filterId, selectedCriteria[filter.filterId])}
                          >
                            Bỏ chọn
                          </span>
                        )}
                      </div>
                      <div className="max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                        {filter.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedCriteria[filter.filterId] === option}
                              onCheckedChange={() => handleCriterionSelect(filter.filterId, option)}
                              className="h-4 w-4 rounded-[4px] border-gray-300 text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="text-[13px] text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                </PopoverContent>
              </Popover>
              );
            })}
          </div>
        </div>

        {/* Nút Reset tất cả */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
             <span className="text-xs font-bold text-gray-500">Đang lọc:</span>
             <button 
               onClick={handleResetFilters} 
               className="cursor-pointer h-8 px-3 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-full flex items-center gap-1 transition"
             >
               <RotateCcw className="h-3 w-3" /> Xóa tất cả
             </button>
          </div>
        )}

        {/* Sắp xếp theo */}
        <div>
          <h3 className="font-bold text-base text-brand-black mb-3">Sắp xếp theo</h3>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'featured', name: 'Phổ biến', icon: <Star className="h-4 w-4 mr-1" /> },
              { id: 'discount', name: 'Khuyến mãi HOT' },
              { id: 'price-asc', name: 'Giá Thấp - Cao', icon: <ArrowUp className="h-4 w-4 mr-1" /> },
              { id: 'price-desc', name: 'Giá Cao - Thấp', icon: <ArrowDown className="h-4 w-4 mr-1" /> },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => setSortBy(sort.id)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-xl text-xs font-bold transition border-none",
                  sortBy === sort.id 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'text-gray-600 bg-white shadow-sm hover:bg-gray-50'
                )}
              >
                {sort.icon}
                {sort.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* HOT SALE SECTION */}
      <FlashSale />

      {/* DANH SÁCH SẢN PHẨM */}
      <section>
        {isPageLoading || isProductsLoading ? (
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
