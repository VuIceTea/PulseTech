'use client';

import React from 'react';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
};
