'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Percent } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

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
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="bg-brand-black text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg tracking-wider uppercase shadow-sm">
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
              <Percent className="h-3 w-3" /> Giảm {product.discount}%
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
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
          {product.brand}
        </span>

        {/* Product Name */}
        <h3 className="font-display font-bold text-sm text-brand-black group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>

        {/* High-end specs tag */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-gray-100 text-gray-600 text-[9px] font-semibold px-2 py-0.5 rounded-md">
            RAM {product.specs.ram.split(' ')[0]}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[9px] font-semibold px-2 py-0.5 rounded-md">
            {product.specs.screen.split(',')[0]}
          </span>
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
            className="bg-brand-black hover:bg-primary text-white p-2.5 rounded-2xl transition-all duration-300 shrink-0 group/btn shadow-md active:scale-95"
            title="Thêm nhanh vào giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:rotate-12" />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};
