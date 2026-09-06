'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useAuth } from './AuthContext';
import { api, CartItem as ApiCartItem } from '@/lib/api';

export interface CartItem extends ApiCartItem {
  brand?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color: string, storage: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string, color: string, storage: string) => Promise<void>;
  updateQuantity: (id: string, color: string, storage: string, quantity: number, productPrice: number, image: string, productName: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, isLoaded: isAuthLoaded } = useAuth();
  
  const getUserId = () => {
    if (user?.email) return user.email;
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    const fetchCart = async () => {
      try {
        const userId = getUserId();
        const data = await api.getCart(userId);
        setCart(data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart', error);
      }
    };
    fetchCart();
  }, [user, isAuthLoaded]);

  const addToCart = async (product: Product, color: string, storage: string, quantity = 1) => {
    if (product.stock === 0) return;

    const storageObj = product.storages.find(s => s.name === storage);
    const storageOffset = storageObj ? storageObj.priceOffset : 0;
    const finalPrice = product.basePrice + storageOffset;

    const colorObj = product.colors.find(c => c.name === color);
    const itemImage = colorObj ? colorObj.image : product.image;

    const existing = cart.find(item => item.id === product.id && item.color === color && item.storage === storage);
    const newQuantity = existing ? existing.quantity + quantity : quantity;

    const apiItem: ApiCartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: itemImage,
      quantity: newQuantity,
      color,
      storage
    };

    // Optimistic update
    setCart(prevCart => {
      if (existing) {
        return prevCart.map(item => item.id === product.id && item.color === color && item.storage === storage 
          ? { ...item, quantity: newQuantity } : item);
      }
      return [...prevCart, { ...apiItem, id: product.id }];
    });

    try {
      const data = await api.updateCartItem(getUserId(), apiItem);
      setCart(data.items || []);
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  const removeFromCart = async (productId: string, color: string, storage: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.color === color && item.storage === storage)));
    try {
      const data = await api.removeCartItem(getUserId(), productId, color, storage);
      setCart(data.items || []);
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const updateQuantity = async (productId: string, color: string, storage: string, quantity: number, productPrice: number, image: string, productName: string) => {
    if (quantity <= 0) {
      await removeFromCart(productId, color, storage);
      return;
    }
    
    setCart(prev => prev.map(item => (item.id === productId && item.color === color && item.storage === storage) ? { ...item, quantity } : item));
    
    try {
      const apiItem: ApiCartItem = { id: productId, name: productName, price: productPrice, image, quantity, color, storage };
      const data = await api.updateCartItem(getUserId(), apiItem);
      setCart(data.items || []);
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await api.clearCart(getUserId());
      // Ensure it stays empty even if a parallel fetchCart just finished
      setTimeout(() => setCart([]), 100);
      setTimeout(() => setCart([]), 500);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
