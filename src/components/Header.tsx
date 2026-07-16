'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  Phone,
  FileText,
  LogOut,
  Menu,
  X,
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Laptop,
  Volume2,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full text-white shadow-md glass-header">
      {/* Top Header Bar */}
      <div className="mx-auto max-w-[1400px] px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-lg sm:text-2xl tracking-wider uppercase group-hover:opacity-90 transition-opacity">
              Pulse<span className="text-brand-black">Tech</span>
            </span>
          </Link>

          {/* Search bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Bạn cần tìm gì hôm nay?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-white/70 border border-white/20 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:bg-white focus:text-brand-black focus:placeholder-gray-400 focus:border-white transition-all duration-300 shadow-inner"
            />
            <button type="submit" className="absolute left-3 top-2.5 text-white/80 hover:text-white pointer-events-none">
              <Search className="h-4 w-4" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Nav Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
            {/* Phone */}
            <a href="tel:18002097" className="flex items-center gap-1.5 hover:bg-white/10 p-2 rounded-xl transition">
              <Phone className="h-4 w-4 shrink-0" />
              <div className="text-[10px] leading-tight text-left">
                <span className="block font-normal text-white/80">Gọi mua hàng</span>
                <span className="font-bold">1800.2097</span>
              </div>
            </a>

            {/* Store Locations */}
            <Link href="/products" className="flex items-center gap-1.5 hover:bg-white/10 p-2 rounded-xl transition">
              <MapPin className="h-4 w-4 shrink-0" />
              <div className="text-[10px] leading-tight text-left">
                <span className="block font-normal text-white/80">Cửa hàng</span>
                <span className="font-bold">Xem bản đồ</span>
              </div>
            </Link>

            {/* Track Orders */}
            <Link href="/order-tracking" className="flex items-center gap-1.5 hover:bg-white/10 p-2 rounded-xl transition">
              <FileText className="h-4 w-4 shrink-0" />
              <div className="text-[10px] leading-tight text-left">
                <span className="block font-normal text-white/80">Tra cứu</span>
                <span className="font-bold">Đơn hàng</span>
              </div>
            </Link>
          </div>

          {/* Cart & Account */}
          <div className="flex items-center gap-2 sm:gap-4 font-semibold text-xs shrink-0">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-white/15 hover:bg-white/20 p-2 sm:px-3 sm:py-2.5 rounded-xl transition duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-brand-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/20 p-2 sm:px-3 sm:py-2.5 rounded-xl transition duration-200"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline truncate max-w-[80px]">{user.name}</span>
                  </button>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white text-brand-black rounded-2xl shadow-xl border border-gray-150 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Tài khoản</p>
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                            router.push('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-red-50 text-primary hover:text-primary-dark transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/20 p-2 sm:px-3 sm:py-2.5 rounded-xl transition duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (with Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-primary-dark shadow-inner overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="md:hidden relative w-full">
                <input
                  type="text"
                  placeholder="Bạn cần tìm gì hôm nay?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-brand-black placeholder-gray-400 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>

              {/* Mobile Category Links (styled like the screenshot) */}
              <nav className="flex flex-col w-full bg-white rounded-2xl p-2 shadow-sm">
                {[
                  { id: 1, name: 'Điện thoại di động', icon: <Smartphone className="h-4 w-4" />, link: '/products?category=phone' },
                  { id: 2, name: 'Máy tính bảng (Tablet)', icon: <Tablet className="h-4 w-4" />, link: '/products?category=tablet' },
                  { id: 3, name: 'Phụ kiện công nghệ', icon: <Headphones className="h-4 w-4" />, link: '/products?category=accessory' },
                  { id: 4, name: 'Smartwatch (Đồng hồ)', icon: <Watch className="h-4 w-4" />, link: '/products' },
                  { id: 5, name: 'Laptop & Màn hình', icon: <Laptop className="h-4 w-4" />, link: '/products?category=laptop' },
                  { id: 6, name: 'Thiết bị âm thanh', icon: <Volume2 className="h-4 w-4" />, link: '/products?category=audio' },
                  { id: 7, name: 'Thu cũ đổi mới', icon: <RefreshCw className="h-4 w-4" />, link: '/trade-in' },
                ].map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </Link>
                ))}
              </nav>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
