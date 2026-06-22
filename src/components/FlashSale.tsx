'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from './ProductCard';

export const FlashSale: React.FC = () => {
  // Set target to end of today
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Restart loop for simulation
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  // Filter flash sale products
  const flashProducts = PRODUCTS.filter(p => p.isFlashSale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />

        {/* Header with countdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/20 pb-5 mb-6">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white text-red-600 p-2 rounded-2xl animate-pulse">
              <Flame className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-wider">
                Giờ Vàng Giá Sốc
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Số lượng có hạn, nhanh tay săn ngay!</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-xs font-bold mr-2 uppercase tracking-wide flex items-center gap-1">
              <Clock className="h-4 w-4" /> Kết thúc sau:
            </span>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-sm sm:text-base">
              <div className="bg-brand-black text-white px-3 py-2 rounded-xl shadow-inner min-w-[38px] text-center">
                {formatNumber(timeLeft.hours)}
              </div>
              <span className="text-white">:</span>
              <div className="bg-brand-black text-white px-3 py-2 rounded-xl shadow-inner min-w-[38px] text-center">
                {formatNumber(timeLeft.minutes)}
              </div>
              <span className="text-white">:</span>
              <div className="bg-brand-black text-white px-3 py-2 rounded-xl shadow-inner min-w-[38px] text-center">
                {formatNumber(timeLeft.seconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {flashProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="relative flex flex-col h-full bg-white rounded-3xl p-1">
              <ProductCard product={product} />
              
              {/* Progress bar */}
              <div className="px-5 pb-4 pt-1">
                <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden relative flex items-center justify-center">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                    style={{ width: `${(product.stock / 50) * 100}%` }}
                  />
                  <span className="absolute text-[8px] font-extrabold text-brand-black z-10 uppercase tracking-wide">
                    🔥 Còn {product.stock} suất
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="flex justify-center mt-6">
          <Link 
            href="/products" 
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition border border-white/10 hover:scale-105 active:scale-95"
          >
            Xem tất cả Flash Sale <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
