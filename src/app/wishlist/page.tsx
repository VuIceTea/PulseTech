'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { HeartCrack, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handleMoveToCart = async (productId: string) => {
    setLoadingProductId(productId);
    try {
      // Fetch full product details to get default color and storage
      const product = await api.product(productId);
      const defaultColor = product.colors?.[0]?.name || 'Mặc định';
      const defaultStorage = product.storages?.[0]?.name || 'Mặc định';
      
      addToCart(product, defaultColor, defaultStorage, 1);
      removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to move to cart:', error);
      alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoadingProductId(null);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <HeartCrack className="w-20 h-20 text-gray-300 mb-6" strokeWidth={1} />
        <h2 className="font-display font-extrabold text-2xl text-brand-black mb-2">
          Danh sách yêu thích trống
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy duyệt qua các sản phẩm và nhấn nút trái tim để lưu lại nhé!
        </p>
        <Link 
          href="/"
          className="bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#d70018f2] transition-colors shadow-md flex items-center gap-2"
        >
          Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-extrabold text-3xl text-brand-black mb-8">
          Sản Phẩm Yêu Thích ({wishlist.length})
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => {
            const salePrice = item.basePrice;
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col group relative">
                {/* Delete button */}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 z-10"
                  title="Xóa khỏi danh sách"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/products/${item.id}`} className="flex-1 flex flex-col">
                  <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#ff3b60] text-white text-[10px] font-bold px-2 py-1 rounded capitalize z-10">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">
                    {item.brand}
                  </span>
                  
                  <h3 className="font-display font-bold text-sm text-brand-black group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                    {item.name}
                  </h3>
                  
                  <div className="mt-auto pt-2 flex flex-col">
                    <span className="font-extrabold text-base text-primary">
                      {formatPrice(salePrice)}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-gray-400 text-[11px] line-through font-semibold">
                      {item.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                    )}
                  </div>
                </Link>

                <button 
                  onClick={() => handleMoveToCart(item.id)}
                  disabled={loadingProductId === item.id}
                  className="mt-4 w-full bg-brand-black text-white font-bold py-2.5 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loadingProductId === item.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  Thêm vào giỏ hàng
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
