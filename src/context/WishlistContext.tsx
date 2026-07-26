'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';

export interface WishlistItem {
  id: string; // product id
  name: string;
  brand: string;
  image: string;
  basePrice: number;
  discount: number;
  category: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('pulsetech_wishlist');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist storage', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulsetech_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        basePrice: product.basePrice,
        discount: product.discount,
        category: product.category,
      }];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
