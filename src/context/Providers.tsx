'use client';

import React from 'react';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';

import { WishlistProvider } from './WishlistContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};
