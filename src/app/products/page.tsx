'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PRODUCTS, BRANDS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { FlashSale } from '@/components/FlashSale';
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
const FILTER_CRITERIA = [
  { id: 'usage', name: 'Nhu cầu sử dụng', options: ['Học tập - Văn phòng', 'Giải trí', 'Đồ họa - Sáng tạo', 'Chơi game', 'Cho trẻ em'], categories: ['tablet', 'laptop'] },
  { id: 'os', name: 'Hệ điều hành', options: ['iPadOS', 'Android', 'HarmonyOS', 'iOS'], categories: ['phone', 'tablet'] },
  { id: 'screen', name: 'Kích thước màn hình', options: ['Khoảng 7 - 8 inch', 'Từ 10 đến 11 inch', '11 inch', '12 inch', 'Từ 12 inch trở lên', '9 inch', '8 inch'], categories: ['phone', 'tablet', 'laptop'] },
  { id: 'ram', name: 'RAM', options: ['4 GB', '6 GB', '4 - 6GB', '8 - 12GB', '8 GB', '12 GB'], categories: ['phone', 'tablet', 'laptop'] },
  { id: 'storage', name: 'Bộ nhớ trong', options: ['32GB và 64GB', '128 GB', '128GB và 256GB', '256 GB', '512GB', '1 TB', '2 TB', '64 GB'], categories: ['phone', 'tablet', 'laptop'] },
  { id: 'hz', name: 'Tần số quét', options: ['60 Hz', '90 Hz', '120 Hz', '144 Hz', '165 Hz'], categories: ['phone', 'tablet', 'laptop'] },
  { id: 'chipset', name: 'Chipset', options: ['Apple A-series', 'Snapdragon', 'Exynos', 'MediaTek'], categories: ['phone', 'tablet'] },
  { id: 'special', name: 'Tính năng đặc biệt', options: ['Sạc nhanh', 'Chống nước', 'Hỗ trợ 5G', 'Bảo mật vân tay', 'Nhận diện khuôn mặt'], categories: ['phone', 'tablet', 'watch'] },
  { id: 'accessory_type', name: 'Loại phụ kiện', options: ['Tai nghe', 'Cáp sạc', 'Củ sạc', 'Ốp lưng', 'Đồng hồ'], categories: ['accessory'] },
  { id: 'headphone_type', name: 'Loại tai nghe', options: ['In-ear', 'Over-ear', 'True Wireless'], categories: ['accessory_Tai nghe'] },
  { id: 'audio_feature', name: 'Tính năng âm thanh', options: ['Chống ồn ANC', 'Xuyên âm'], categories: ['accessory_Tai nghe'] },
  // Cáp sạc
  { id: 'cable_brand', name: 'Thương hiệu', options: ['Apple', 'Samsung', 'Anker', 'Belkin', 'Baseus', 'Ugreen', 'Mophie'], categories: ['accessory_Cáp sạc'] },
  { id: 'connection_type', name: 'Loại cáp', options: ['Type-C to Type-C', 'Type-C to Lightning', 'USB to Type-C', 'USB to Lightning', 'Cáp đa năng'], categories: ['accessory_Cáp sạc'] },
  { id: 'cable_length', name: 'Chiều dài', options: ['Dưới 1m', '1m - 1.2m', '2m', 'Trên 2m'], categories: ['accessory_Cáp sạc'] },
  { id: 'cable_material', name: 'Chất liệu', options: ['Bọc dù chống gập', 'Nhựa TPE', 'Bọc da', 'Silicon'], categories: ['accessory_Cáp sạc'] },
  { id: 'cable_feature', name: 'Tính năng', options: ['Sạc siêu nhanh (100W+)', 'Sạc nhanh (20W-65W)', 'Chứng nhận MFi', 'Tích hợp màn hình LED', 'Chống rối'], categories: ['accessory_Cáp sạc'] },

  // Đồng hồ
  { id: 'watch_brand', name: 'Thương hiệu', options: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Amazfit', 'Xiaomi', 'Coros'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_size', name: 'Kích thước mặt', options: ['Dưới 40mm', '40mm', '41mm', '42mm', '44mm', '45mm', '49mm'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_material', name: 'Chất liệu viền', options: ['Nhôm', 'Thép không gỉ', 'Titanium', 'Nhựa/Polymer'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_health', name: 'Tính năng sức khỏe', options: ['Đo nhịp tim', 'Đo SpO2', 'Đo huyết áp', 'Điện tâm đồ ECG', 'Theo dõi giấc ngủ', 'Theo dõi chu kỳ kinh nguyệt', 'Phân tích thành phần cơ thể'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_smart', name: 'Tính năng thông minh', options: ['Nghe gọi trên đồng hồ (eSIM)', 'Nghe gọi qua Bluetooth', 'Định vị GPS độc lập', 'Phát nhạc độc lập', 'Trợ lý ảo', 'Màn hình Always-On'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_battery', name: 'Thời lượng pin', options: ['Dưới 2 ngày', '2-7 ngày', '7-14 ngày', 'Trên 14 ngày'], categories: ['accessory_Đồng hồ'] },
  { id: 'watch_water', name: 'Độ chịu nước', options: ['5 ATM', '10 ATM', 'IP68'], categories: ['accessory_Đồng hồ'] },
  { id: 'charging_power', name: 'Công suất sạc', options: ['20W', '25W', '65W'], categories: ['accessory_Cáp sạc'] },
  { id: 'charging_ports', name: 'Số cổng', options: ['1 cổng Type-C', '2 cổng Type-C'], categories: ['accessory_Cáp sạc'] },
  { id: 'case_type', name: 'Phân loại ốp', options: ['Chống sốc', 'Ốp trong', 'Ốp nhựa cứng', 'Bao da', 'Ốp dẻo', 'Bao da kiêm bàn phím', 'Ví kẹp thẻ', 'Ốp bảo vệ camera', 'Ốp kính'], categories: ['accessory_Ốp lưng'] },
  { id: 'case_feature', name: 'Tính năng', options: ['Hỗ trợ sạc MagSafe', 'Hỗ trợ sạc không dây', 'Có chân đứng', 'Siêu mỏng', 'Chống sốc, va đập', 'Có trackpad', 'Bàn phím có đèn nền', 'Chống trầy xước', 'Chống ngả màu', 'Hiển thị thông báo'], categories: ['accessory_Ốp lưng'] },
  { id: 'case_iphone', name: 'Dòng iPhone', options: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17e', 'iPhone 17', 'iPhone Air', 'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16e', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11 Pro Max', 'iPhone 11'], categories: ['accessory_Ốp lưng'] },
  { id: 'case_samsung', name: 'Dòng Samsung', options: ['Galaxy S26 Ultra', 'Galaxy S26 Plus', 'Galaxy S26', 'Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25 FE', 'Galaxy S25', 'Galaxy S24 Ultra', 'Galaxy S24 FE', 'Galaxy S24 Plus', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23 Plus', 'Galaxy S23', 'Galaxy S22 Plus', 'Galaxy S22'], categories: ['accessory_Ốp lưng'] },
];

function ProductsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy params từ URL
  const urlCategory = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';
  const urlSearch = searchParams.get('search') || '';
  const urlAccessoryType = searchParams.get('accessory_type') || '';

  // Quản lý state bộ lọc
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
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

    // Reset page loading when URL search params change
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [urlCategory, urlBrand, urlSearch, urlAccessoryType]);

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
    setSelectedCriteria({});
    setSearchQuery('');
    setSortBy('featured');
    router.push('/products');
  };

  const hasActiveFilters = selectedCategory || selectedBrand || selectedPriceRange || Object.keys(selectedCriteria).length > 0 || searchQuery;

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
    const priceA = Math.round(a.basePrice * (1 - a.discount / 100));
    const priceB = Math.round(b.basePrice * (1 - b.discount / 100));

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discount - a.discount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const activeFilterCriteria = (selectedCategory 
    ? FILTER_CRITERIA.filter(c => 
        c.categories.includes(selectedCategory) || 
        (selectedCriteria['accessory_type'] && c.categories.includes(`${selectedCategory}_${selectedCriteria['accessory_type']}`))
      )
    : FILTER_CRITERIA).filter(c => c.id !== 'accessory_type');

  // --- CONFIG CHO POPOVER BỘ LỌC ---
  const FilterContent = () => (
    <div className="w-[1100px] max-w-[95vw] bg-white rounded-2xl flex flex-col relative overflow-hidden">
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {activeFilterCriteria.map(criteria => (
            <div key={criteria.id} className={cn("space-y-3", criteria.options.length > 12 ? 'md:col-span-2' : '')}>
              <h4 className="text-sm font-bold text-brand-black">{criteria.name}</h4>
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
                      "cursor-pointer text-xs px-3 py-1.5 rounded-full border transition",
                      selectedCriteria[criteria.id] === option
                        ? "border-primary bg-primary-light text-primary font-bold"
                        : "border-gray-200 text-gray-600 hover:border-primary/50"
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
          {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Tất Cả Sản Phẩm'}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-1">
          Hiển thị <strong className="text-[#d70018f2]">{sortedProducts.length}</strong> sản phẩm phù hợp
        </p>
      </div>

      {/* FILTER BAR (TOP) - Mới */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 flex flex-col gap-4 relative z-10">
        
        {/* Tiêu chí lọc */}
        <div>
          <h3 className="font-bold text-base text-brand-black mb-3">Chọn theo tiêu chí</h3>
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Nút Bộ Lọc Mega Menu */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="cursor-pointer flex items-center gap-2 h-9 px-4 text-xs font-bold border-primary text-primary hover:bg-primary-light rounded-xl">
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

            <Button 
              variant="outline" 
              className={cn("cursor-pointer h-9 px-4 text-xs font-bold rounded-xl transition", inStock ? "border-primary text-primary bg-primary-light" : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100")}
              onClick={() => setInStock(!inStock)}
            >
              Sẵn hàng
            </Button>
            <Button 
              variant="outline" 
              className={cn("cursor-pointer h-9 px-4 text-xs font-bold rounded-xl transition", newArrival ? "border-primary text-primary bg-primary-light" : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100")}
              onClick={() => setNewArrival(!newArrival)}
            >
              Hàng mới về
            </Button>
            
            <Popover open={activePopover === 'price'} onOpenChange={(open) => setActivePopover(open ? 'price' : null)}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "cursor-pointer h-9 px-4 text-xs font-bold rounded-xl transition flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0",
                  selectedPriceRange ? "border-primary text-primary bg-primary-light" : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100"
                )}>
                  {selectedPriceRange ? priceRanges.find(p => p.id === selectedPriceRange)?.name : 'Xem theo giá'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-4 shadow-xl rounded-2xl border-gray-100" align="start">
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map(price => (
                    <button
                      key={price.id}
                      onClick={() => {
                        setSelectedPriceRange(prev => prev === price.id ? '' : price.id);
                        setActivePopover(null);
                      }}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition",
                        selectedPriceRange === price.id
                          ? "border-primary text-primary bg-primary-light"
                          : "border-gray-200 text-gray-600 bg-white hover:border-primary hover:text-primary"
                      )}
                    >
                      {price.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Dynamic Criteria Buttons */}
            {activeFilterCriteria.map(criteria => (
              <Popover key={criteria.id} open={activePopover === criteria.id} onOpenChange={(open) => setActivePopover(open ? criteria.id : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(
                    "cursor-pointer flex items-center gap-1.5 h-9 px-4 text-xs font-bold rounded-xl transition focus:outline-none focus:ring-0 focus-visible:ring-0",
                    selectedCriteria[criteria.id] 
                      ? "border-primary text-primary bg-primary-light" 
                      : "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100"
                  )}>
                    {selectedCriteria[criteria.id] || criteria.name}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("p-4 shadow-xl rounded-2xl border-gray-100", criteria.options.length > 12 ? 'w-[600px] max-w-[95vw]' : 'w-[320px] max-w-[90vw]')} align="start">
                  <div className="flex flex-wrap gap-2">
                    {criteria.options.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedCriteria(prev => ({
                            ...prev,
                            [criteria.id]: prev[criteria.id] === option ? '' : option
                          }));
                          setActivePopover(null);
                        }}
                        className={cn(
                          "cursor-pointer text-xs px-3 py-1.5 rounded-full border transition",
                          selectedCriteria[criteria.id] === option
                            ? "border-primary bg-primary-light text-primary font-bold"
                            : "border-gray-200 text-gray-600 hover:border-primary/50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            ))}
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
                  "flex items-center px-4 py-2 rounded-xl text-xs font-bold transition border",
                  sortBy === sort.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-600' 
                    : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100'
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