'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface User { name: string; email: string; }
interface AuthResult { success: boolean; message?: string; }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('pulsetech_user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch { localStorage.removeItem('pulsetech_user'); }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const loggedUser = await api.login(email, password);
      
      const guestId = localStorage.getItem('guest_id');
      if (guestId) {
        try {
          await api.mergeCarts(guestId, loggedUser.email);
        } catch (err) {
          console.error('Failed to merge cart', err);
        }
      }
      
      setUser(loggedUser);
      localStorage.setItem('pulsetech_user', JSON.stringify(loggedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Đăng nhập thất bại' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await api.register(name, email, password);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Đăng ký thất bại' };
    }
  };

  const logout = async () => {
    if (user) {
      const guestId = localStorage.getItem('guest_id');
      if (guestId) {
        try {
          const userCart = await api.getCart(user.email);
          if (userCart && userCart.items && userCart.items.length > 0) {
            for (const item of userCart.items) {
              await api.updateCartItem(guestId, item);
            }
          }
        } catch (e) {
          console.error('Failed to sync cart on logout', e);
        }
      }
    }
    setUser(null);
    localStorage.removeItem('pulsetech_user');
  };

  return <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoaded }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};