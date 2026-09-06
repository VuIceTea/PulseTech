'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { userApi, api } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string; // product id
  name: string;
  brand: string;
  image: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  category: string;
  stock: number;
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
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or API on mount / user change
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const apiWishlist = await userApi.getWishlist(user.email);
          if (apiWishlist && apiWishlist.productIds && apiWishlist.productIds.length > 0) {
            // Fetch product details for each id
            const items: WishlistItem[] = [];
            for (const pid of apiWishlist.productIds) {
              try {
                const product = await api.product(pid);
                items.push({
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  image: product.image,
                  basePrice: product.basePrice,
                  originalPrice: product.originalPrice,
                  discount: product.discount,
                  category: product.category,
                  stock: product.stock,
                });
              } catch (e) {
                console.error('Failed to fetch wishlist product', pid, e);
              }
            }
            setWishlist(items);
          } else {
            setWishlist([]); // Clear if empty on backend
          }
        } catch (error) {
          console.error('Failed to load wishlist from API', error);
        }
      } else {
        const storedWishlist = localStorage.getItem('pulsetech_wishlist');
        if (storedWishlist) {
          try {
            setWishlist(JSON.parse(storedWishlist));
          } catch (error) {
            console.error('Failed to parse wishlist storage', error);
          }
        } else {
          setWishlist([]);
        }
      }
      setIsLoaded(true);
    };

    loadWishlist();
  }, [user]);

  // Save to localStorage or API when changed
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        userApi.saveWishlist({
          id: user.email,
          productIds: wishlist.map(item => item.id)
        }).catch(console.error);
      } else {
        localStorage.setItem('pulsetech_wishlist', JSON.stringify(wishlist));
      }
    }
  }, [wishlist, isLoaded, user]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        basePrice: product.basePrice,
        originalPrice: product.originalPrice,
        discount: product.discount,
        category: product.category,
        stock: product.stock
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
