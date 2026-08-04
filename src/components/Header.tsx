'use client';

import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, MapPin, Menu, Phone, Search, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, isLoaded } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigations, setNavigations] = useState<{id: string, title: string, href: string}[]>([]);

  useEffect(() => {
    import('@/lib/api').then(({ api }) => {
      api.getNavigation().then(data => {
        if (data) setNavigations(data);
      }).catch(() => {});
    });
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileOpen(false);
  };

  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <header className="glass-header sticky top-0 z-50 w-full text-white shadow-md">
      <div className="mx-auto max-w-[1600px] px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 font-display text-lg font-extrabold uppercase tracking-wider sm:text-2xl">Pulse<span className="text-brand-black">Tech</span></Link>

          <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 md:flex">
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Bạn cần tìm gì hôm nay?" className="w-full rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:bg-white focus:text-brand-black focus:placeholder:text-gray-400" />
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-white/70"><X className="h-4 w-4" /></button>}
          </form>

          <nav className="hidden items-center gap-2 text-xs font-semibold lg:flex">
            <a href="tel:18002097" className="flex items-center gap-2 rounded-xl p-2 hover:bg-white/10"><Phone className="h-4 w-4" /><span>1800.2097</span></a>
            <Link href="/products" className="flex items-center gap-2 rounded-xl p-2 hover:bg-white/10"><MapPin className="h-4 w-4" /><span>Cửa hàng</span></Link>
            <Link href={user ? "/orders" : "/order-tracking"} className="flex items-center gap-2 rounded-xl p-2 hover:bg-white/10"><FileText className="h-4 w-4" /><span>Đơn hàng</span></Link>
            <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-amber-400 text-brand-black px-2.5 py-1.5 font-bold hover:bg-amber-300 transition shadow-sm"><span>Quản trị (Admin)</span></a>
          </nav>

          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold sm:gap-3">
            <Link href="/cart" className="relative flex items-center gap-2 rounded-xl bg-white/15 p-2 transition hover:bg-white/20 sm:px-3 sm:py-2.5">
              <ShoppingCart className="h-5 w-5" /><span className="hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-brand-black">{cartCount}</span>}
            </Link>

            {!isLoaded ? (
              <span className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
            ) : user ? (
              <Link href="/profile" aria-label={`Mở hồ sơ của ${user.name}`} title={user.name} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-white text-sm font-extrabold text-primary shadow-sm transition hover:scale-105 hover:shadow-md">{initials}</Link>
            ) : (
              <Link href="/login" className="rounded-xl bg-white/15 px-3 py-2.5 transition hover:bg-white/20">Đăng nhập</Link>
            )}

            <button onClick={() => setMobileOpen((value) => !value)} aria-label="Mở menu" className="rounded-xl p-2 hover:bg-white/10 lg:hidden">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 bg-primary-dark lg:hidden">
            <div className="space-y-3 px-4 py-4">
              <form onSubmit={handleSearch} className="relative md:hidden"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm sản phẩm..." className="w-full rounded-xl bg-white py-2.5 pl-10 pr-4 text-sm text-brand-black outline-none" /><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /></form>
              <nav className="grid gap-1 rounded-2xl bg-white p-2 text-sm font-bold text-gray-600">
                <a onClick={() => setMobileOpen(false)} href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="rounded-xl px-3 py-3 bg-amber-50 text-amber-800 font-extrabold hover:bg-amber-100">Quản trị (Admin Dashboard)</a>
                {navigations.map(nav => (
                  <Link key={nav.id} onClick={() => setMobileOpen(false)} href={nav.href} className="rounded-xl px-3 py-3 hover:bg-gray-50">{nav.title}</Link>
                ))}
                <Link onClick={() => setMobileOpen(false)} href={user ? "/orders" : "/order-tracking"} className="rounded-xl px-3 py-3 hover:bg-gray-50 border-t border-gray-100">{user ? "Lịch sử đơn hàng" : "Tra cứu đơn hàng"}</Link>
                {user && <Link onClick={() => setMobileOpen(false)} href="/profile" className="rounded-xl px-3 py-3 text-primary hover:bg-red-50">Hồ sơ của tôi</Link>}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};