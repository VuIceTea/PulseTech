'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Percent, Sparkles } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Format price helper
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Calculate discounted price
  const discountedPrice = Math.round(product.basePrice * (1 - product.discount / 100));

  // Dynamic badge color
  const getBadgeColor = (badge: string) => {
    const text = badge.toLowerCase();
    if (text.includes('trả góp')) return 'bg-blue-500';
    if (text.includes('độc quyền') || text.includes('s-pen')) return 'bg-purple-500';
    if (text.includes('bán chạy') || text.includes('chính hãng')) return 'bg-green-500';
    if (text.includes('giá rẻ') || text.includes('mỏng')) return 'bg-orange-500';
    return 'bg-brand-black';
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking button
    // Add default color and storage
    const defaultColor = product.colors[0]?.name || 'Mặc định';
    const defaultStorage = product.storages[0]?.name || 'Mặc định';
    addToCart(product, defaultColor, defaultStorage, 1);
    
    // Quick notification / visual cue
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Đã thêm';
    btn.classList.add('bg-green-600');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-green-600');
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col justify-between overflow-hidden bg-white border border-gray-100 rounded-3xl p-4 transition-all duration-300 group select-none cursor-pointer h-full"
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
          {product.discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-[#ff2b54] text-white text-[10px] font-bold px-2.5 py-1 rounded-tl-xl rounded-br-xl shadow-sm flex items-center gap-0.5">
              <Percent className="h-2.5 w-2.5" /> Giảm {product.discount}%
            </span>
          )}
          {product.badge && (
            <span className={cn(getBadgeColor(product.badge), "text-white text-[10px] font-bold px-2.5 py-1 rounded-tl-xl rounded-br-xl shadow-sm")}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Brand */}
        <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded-md w-fit inline-block">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-display font-bold text-sm text-brand-black group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* Đặc điểm nổi bật */}
        <div className="bg-[#f8f9fa] rounded-lg p-2.5 mb-3 flex-1">
          <p className="text-[10px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-yellow-500" /> Đặc điểm nổi bật
          </p>
          <ul className="text-[9px] text-gray-600 space-y-1">
            {['phone', 'tablet', 'laptop'].includes(product.category) ? (
              <>
                {product.specs.screen && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>{product.specs.screen}</li>}
                {product.specs.cpu && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Chip: {product.specs.cpu}</li>}
                {product.specs.battery && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Pin: {product.specs.battery}</li>}
              </>
            ) : ['accessory', 'audio'].includes(product.category) ? (
              <>
                {product.specs.accessoryType && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Loại: {product.specs.accessoryType}</li>}
                {product.specs.audioFeature && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Âm thanh: {product.specs.audioFeature}</li>}
                {product.specs.chargingPower && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Công suất: {product.specs.chargingPower}</li>}
                {product.specs.caseFeature && <li className="line-clamp-1"><span className="text-gray-400 mr-1">•</span>Tính năng: {product.specs.caseFeature}</li>}
                {!product.specs.audioFeature && !product.specs.chargingPower && !product.specs.caseFeature && (
                  <li className="line-clamp-2"><span className="text-gray-400 mr-1">•</span>Thiết kế cao cấp, độ bền vượt trội</li>
                )}
              </>
            ) : null}
          </ul>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4 text-[11px] text-gray-500 font-semibold">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 fill-current ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                }`} 
              />
            ))}
          </div>
          <span>({product.reviewsCount})</span>
        </div>

        {/* Pricing & Add to Cart Area */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-primary font-display font-extrabold text-base leading-tight">
              {formatPrice(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-gray-400 text-xs line-through font-semibold">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="text-primary hover:text-[#d70018f2] transition-all duration-300 shrink-0 group/btn active:scale-95 p-1 cursor-pointer"
            title="Thêm nhanh vào giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};
