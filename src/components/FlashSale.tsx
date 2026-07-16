'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, Flame, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

export const FlashSale: React.FC = () => {
  const dealProducts = PRODUCTS.filter(p => p.discount > 0).slice(0, 5);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 2, minutes: 11, seconds: 54 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="w-full mt-6 mb-8">
      <div className="bg-[#f9405e] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <div className="flex items-center">
            <img src="/hot-sale-cuoi-tuan.gif" alt="Hot Sale Cuối Tuần" className="h-10 object-contain" />
          </div>
          
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <span>Kết thúc sau:</span>
            <div className="flex items-center gap-1 font-bold text-brand-black">
              <span className="bg-white rounded-md px-1.5 py-0.5 text-sm">{pad(timeLeft.days)}</span>
              <span className="text-white">:</span>
              <span className="bg-white rounded-md px-1.5 py-0.5 text-sm">{pad(timeLeft.hours)}</span>
              <span className="text-white">:</span>
              <span className="bg-white rounded-md px-1.5 py-0.5 text-sm">{pad(timeLeft.minutes)}</span>
              <span className="text-white">:</span>
              <span className="bg-white rounded-md px-1.5 py-0.5 text-sm">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {dealProducts.map((product, idx) => {
              const salePrice = Math.round(product.basePrice * (1 - product.discount / 100));

              return (
                <div key={product.id} className="bg-white rounded-xl p-3 flex flex-col cursor-pointer relative hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                  {/* Badges */}
                  <div className="absolute top-0 left-0 z-10">
                    <span className="bg-[#d70018] text-white text-[10px] font-bold px-2 py-1 rounded-br-xl rounded-tl-xl inline-block shadow-sm">
                      Giảm {product.discount}%
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 z-10">
                    <span className="bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-xl inline-block shadow-sm">
                      Trả góp 0%
                    </span>
                  </div>

                  {/* Image */}
                  <Link href={`/products/${product.id}`} className="flex flex-col flex-1 h-full">
                    <div className="relative w-full aspect-square mt-6 mb-4 flex items-center justify-center p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1">
                      <h3 className="font-bold text-[13px] text-brand-black leading-snug line-clamp-2 mb-2 hover:text-[#d70018] transition-colors">
                        {product.name} {product.specs?.ram?.split(' ')[0]} {product.specs?.storage}
                      </h3>
                      
                      <div className="flex items-end gap-2 mb-2">
                        <span className="font-extrabold text-[#d70018] text-lg">
                          {salePrice.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-sm text-gray-400 line-through font-semibold mb-[1px]">
                          {product.basePrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      <div className="bg-[#f3f4f6] border border-gray-200 rounded text-[10px] text-gray-600 p-1.5 mb-3 leading-tight line-clamp-2 mt-auto">
                        Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6 tháng
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold text-[9px]">
                            <Truck className="h-3 w-3" /> 2 Giờ
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-500">
                            <Star className="h-3 w-3 fill-current" /> {Math.floor(product.rating || 4)}
                          </span>
                        </div>
                        <button className="text-blue-500 hover:text-[#d70018] transition-colors" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
