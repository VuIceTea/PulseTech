"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { FlashSale } from "@/components/FlashSale";
import { PRODUCTS } from "@/data/products";
import {
  Smartphone,
  Tablet,
  Headphones,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  CheckCircle,
  ChevronRight,
  Star,
  Heart,
  Eye,
  Shuffle,
  ShoppingBag,
  ArrowRight,
  Watch,
  Laptop,
  Wallet
} from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/ScrollReveal";

export default function Home() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="flex-1 min-h-[65vh] flex flex-col items-center justify-center bg-[#f8f9fa] transition-opacity duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200/80 border-t-primary" />
          <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest animate-pulse">
            Đang Tải...
          </span>
        </div>
      </div>
    );
  }

  // Phụ kiện, thiết bị điện thoại
  const newAccessories = PRODUCTS.filter(p => p.category === 'accessory').slice(0, 2);
  const recentlyAdded = PRODUCTS.filter(p => p.category === 'phone' || p.category === 'accessory').slice(2, 8);
  const hotSummerProducts = PRODUCTS.filter(p => p.category === 'accessory').slice(2, 6);

  // Thẻ sản phẩm thu gọn cho phần Hot Summer (Bên phải)
  const SmallProductCard = ({ product }: { product: any }) => {
    const salePrice = Math.round(product.basePrice * (1 - product.discount / 100));
    return (
      <div className="group flex items-center p-3 bg-white border border-gray-100 border-b-[3px] hover:border-b-primary rounded-xl transition-all duration-300 cursor-pointer relative">
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 z-10 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase text-white bg-primary">
            -{product.discount}%
          </span>
        )}
        <div className="w-28 h-28 bg-[#f5f5f7] rounded-lg flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center ml-3 text-left">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
            {product.brand}
          </span>
          <h3 className="font-display font-bold text-sm text-brand-black truncate group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-extrabold text-sm text-primary">
              {salePrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-xs text-gray-400 line-through font-semibold">
              {product.basePrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Thẻ sản phẩm dọc tiêu chuẩn
  const VerticalProductCard = ({ product }: { product: any }) => {
    const salePrice = Math.round(product.basePrice * (1 - product.discount / 100));
    return (
      <div className="group relative bg-white rounded-xl border border-gray-100 border-b-[3px] hover:border-b-primary p-3 transition-all duration-300 flex flex-col h-full cursor-pointer">
        <div className="absolute top-3 left-0 z-10">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-r-full capitalize text-white ${product.discount > 15 ? 'bg-[#ff3b60]' : product.discount > 0 ? 'bg-[#ff9900]' : 'bg-[#00c3f5]'}`}>
            {product.discount > 15 ? 'Hot' : product.discount > 0 ? `-${product.discount}%` : 'New'}
          </span>
        </div>
        <div className="flex justify-end items-start mb-2 relative z-10">
          <button className="text-gray-300 hover:text-primary transition-colors cursor-pointer">
            <Heart className="h-4 w-4 fill-current" />
          </button>
        </div>
        <Link href={`/products/${product.id}`} className="flex-1 flex flex-col cursor-pointer">
          <div className="flex items-center justify-center relative mb-3 h-48">
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-contain transition-transform duration-500 ${product.id !== 'tai-nghe-apple-airpods-pro-2' ? 'mix-blend-multiply ' : ''
                }${['cu-sac-samsung-25w', 'op-lung-magsafe-iphone-15'].includes(product.id)
                  ? 'scale-[1.6] group-hover:scale-[1.75]'
                  : 'group-hover:scale-110'
                }`}
            />
            {/* Hover Actions */}
            <div className="absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2.5 items-center justify-center w-full pb-2">
              <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Shuffle className="h-4 w-4" /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Eye className="h-4 w-4" /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><Heart className="h-4 w-4" /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><ShoppingBag className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="flex flex-col mt-auto text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              {product.brand}
            </span>
            <h3 className="font-display font-bold text-sm text-brand-black leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-[10px] text-gray-400 ml-1">({(4 + Math.random()).toFixed(1)})</span>
            </div>

            <div className="flex items-end justify-between mb-1">
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-primary leading-tight">
                  {salePrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-xs text-gray-400 line-through font-semibold">
                  {product.basePrice.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="text-primary text-[11px] font-bold border border-primary/30 rounded-full py-1 px-3 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center gap-1.5 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 duration-300"
              >
                <ShoppingBag className="w-3 h-3" /> Thêm
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="pb-10 bg-[#f8f9fa] overflow-hidden">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* ===== 2. DANH MỤC NỔI BẬT (COLLECTION LIST) ===== */}
      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 mt-4">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#d70018f2] tracking-tight uppercase">
              Danh Mục Nổi Bật
            </h2>
            <Link
              href="/products"
              className="text-sm font-bold text-primary hover:text-primary hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Category Row — 6 large circular cards filling the space */}
        <ScrollRevealGroup
          className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 md:gap-6 justify-items-center"
          staggerDelay={0.08}
        >
          {[
            {
              id: "phone",
              name: "ĐIỆN THOẠI",
              count: "250+ SẢN PHẨM",
              img: "/phone.png",
              bg: "bg-[#dbebff]",
              href: "/products?category=phone",
            },
            {
              id: "tablet",
              name: "MÁY TÍNH BẢNG",
              count: "80+ SẢN PHẨM",
              img: "/tablet.png",
              bg: "bg-[#e0f2fe]",
              href: "/products?category=tablet",
            },
            {
              id: "headphone",
              name: "TAI NGHE",
              count: "110+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#f3f4f6]",
              href: "/products?category=accessory&accessory_type=Tai%20nghe",
            },
            {
              id: "charger",
              name: "CÁP & CỦ SẠC",
              count: "45+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#111827]",
              href: "/products?category=accessory&accessory_type=Cáp%20sạc",
            },
            {
              id: "case",
              name: "ỐP LƯNG",
              count: "95+ SẢN PHẨM",
              img: "/accessories/op-lung-iphone-15-pro-trong-suot-magsafe.png",
              bg: "bg-[#27273a]",
              href: "/products?category=accessory&accessory_type=Ốp%20lưng",
            },
            {
              id: "smartwatch",
              name: "ĐỒNG HỒ",
              count: "90+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#181824]",
              href: "/products?category=accessory&accessory_type=Đồng%20hồ",
            },
          ].map((cat, i) => (
            <ScrollRevealItem
              key={cat.id}
              className="flex flex-col items-center w-full"
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center gap-2 sm:gap-3 cursor-pointer w-full text-center"
              >
                {/* Large round image container */}
                <div className="w-20 h-20 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-all duration-350 relative border border-gray-200/20">
                  <div className={`absolute inset-0 ${cat.bg} transition-opacity duration-300`} />
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className={`absolute inset-0 w-full h-full object-center transition-transform duration-350 group-hover:scale-110 ${['phone', 'tablet'].includes(cat.id) ? 'object-contain p-2 md:p-3' : 'object-cover'
                      }`}
                  />
                </div>

                {/* Text underneath */}
                <div className="flex flex-col items-center gap-0.5 px-1">
                  <span className="font-display font-bold text-[10px] xs:text-xs sm:text-sm text-brand-black tracking-wider group-hover:text-primary transition-colors duration-200 uppercase line-clamp-2">
                    {cat.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wide hidden xs:block">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </section>

      {/* 3. Deal Trong Tuần (Flash Sale) */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <FlashSale />
      </div>

      {/* 4. Black Friday & Sale Banners - Mobile/Accessories Themed */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f2f8fc] rounded-2xl p-6 sm:p-8 flex items-center justify-between h-[220px] border border-[#e5f0f9] overflow-hidden group cursor-pointer">
              <div className="z-10 w-1/2 pr-2">
                <span className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Đại Tiệc Sale</span>
                <h3 className="font-display font-extrabold text-xl lg:text-3xl text-brand-black my-2 leading-tight">Siêu Sale Apple Black Friday</h3>
                <Link href="/products" className="mt-3 inline-flex items-center gap-1.5 bg-white border border-gray-200 text-brand-black text-[10px] font-bold px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                  Mua Ngay <ArrowRight className="w-3 h-3 text-primary" />
                </Link>
              </div>
              <div className="w-1/2 relative h-full flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop" className="w-[110%] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 drop-shadow-xl absolute right-0" alt="iPhone Black Friday" />
              </div>
            </div>
            <div className="bg-[#fff6e6] rounded-2xl p-6 sm:p-8 flex items-center justify-between h-[220px] border border-[#ffecca] overflow-hidden group cursor-pointer">
              <div className="z-10 w-1/2 pr-2">
                <span className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider">Giảm Giá Sốc</span>
                <h3 className="font-display font-extrabold text-xl lg:text-3xl text-brand-black my-2 leading-tight">Ốp Lưng Điện Thoại Siêu Rẻ</h3>
                <Link href="/products" className="mt-3 inline-flex items-center gap-1.5 bg-white border border-gray-200 text-brand-black text-[10px] font-bold px-4 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                  Mua Ngay <ArrowRight className="w-3 h-3 text-primary" />
                </Link>
              </div>
              <div className="w-1/2 relative h-full flex items-center justify-center">
                <img src="/accessories/op-lung-iphone-15-pro-trong-suot-magsafe.png" className="w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl absolute right-0 mix-blend-multiply" alt="Phone Case Offer" />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Phụ kiện điện thoại mới */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-extrabold text-2xl text-brand-black tracking-tight">
              Phụ Kiện Điện Thoại Nổi Bật
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronRight className="w-4 h-4 rotate-180" /></button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[350px]">
            <div className="lg:col-span-1 bg-[#ffcc00] rounded-2xl p-8 lg:p-10 flex flex-col justify-center border border-[#e6b800] relative overflow-hidden group cursor-pointer min-h-[350px]">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover blur-[2px] group-hover:scale-105 transition-transform duration-700 z-0 opacity-90 mix-blend-multiply" alt="Headphones Banner" />
              <div className="absolute inset-0 bg-white/10 z-0" />
              <div className="z-10 relative flex flex-col justify-center w-full">
                <h3 className="font-display font-black text-[36px] xl:text-[36px] text-white leading-[1.1] tracking-tight mb-6 drop-shadow-md">
                  Giảm Ngay 30%<br />Tai Nghe Bluetooth
                </h3>
                <Link href="/products" className="inline-flex self-start items-center gap-2 bg-white text-brand-black text-sm font-bold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
                  Mua Ngay <ArrowRight className="w-4 h-4 text-[#ff3b60]" />
                </Link>
              </div>
            </div>
            {/* Right Products (2 Cards converted to Banners) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-gray-100 relative overflow-hidden group cursor-pointer min-h-[300px]">
                <img src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover blur-[2px] group-hover:scale-105 transition-transform duration-700 z-0" alt="AirPods Banner" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-0" />
                <div className="z-10 relative h-full flex flex-col justify-start">
                  <span className="text-[10px] font-extrabold uppercase text-gray-300 tracking-wider mb-2">Phụ Kiện Apple</span>
                  <h3 className="font-display font-extrabold text-2xl lg:text-3xl text-white leading-snug w-4/5">AirPods Pro 2 Chống Ồn</h3>
                  <Link href="/products/tai-nghe-apple-airpods-pro-2" className="mt-5 inline-flex self-start items-center gap-1.5 bg-white border border-gray-200 text-brand-black text-sm font-bold px-5 py-2 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-3 h-3 text-primary" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-gray-100 relative overflow-hidden group cursor-pointer min-h-[300px]">
                <img src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover blur-[2px] group-hover:scale-105 transition-transform duration-700 z-0 mix-blend-multiply" alt="Cáp Sạc Banner" />
                <div className="absolute inset-0 bg-[#f8fafc]/50 z-0" />
                <div className="z-10 relative h-full flex flex-col justify-start">
                  <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider mb-2">Siêu Bền Bỉ</span>
                  <h3 className="font-display font-extrabold text-2xl lg:text-3xl text-brand-black leading-snug w-4/5">Cáp Sạc Nhanh Apple</h3>
                  <Link href="/products/cap-sac-apple-lightning" className="mt-5 inline-flex self-start items-center gap-1.5 bg-white border border-gray-200 text-brand-black text-sm font-bold px-5 py-2 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-3 h-3 text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Sản phẩm vừa thêm */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 bg-[#fdfdfd] border-t border-gray-100 mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-extrabold text-2xl text-brand-black tracking-tight">
              Thiết Bị Vừa Được Thêm Gần Đây
            </h2>
            <div className="hidden sm:flex gap-3">
              <button className="text-[10px] font-extrabold tracking-wide uppercase border border-gray-200 px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors hover:border-primary cursor-pointer">Mới Nhất</button>
              <button className="text-[10px] font-extrabold tracking-wide uppercase bg-primary text-white border border-primary px-5 py-2 rounded-full shadow-sm cursor-pointer">Phổ Biến</button>
              <button className="text-[10px] font-extrabold tracking-wide uppercase border border-gray-200 px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors hover:border-primary cursor-pointer">Bán Chạy</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 3x2 Grid of Products */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentlyAdded.map(product => (
                <VerticalProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* 2 Vertical Stacked Banners */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-end items-start flex-1 border border-gray-100 group overflow-hidden relative text-left cursor-pointer min-h-[320px]">
                <img src="/accessories/airpod-pro-gen2.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" alt="AirPods" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-0" />
                <div className="z-10 relative">
                  <span className="text-[10px] font-extrabold uppercase text-gray-300 tracking-wider">Ưu Đãi Đặc Biệt</span>
                  <h3 className="font-display font-extrabold text-2xl text-white leading-snug mt-1 mb-4">AirPods Chống Ồn Tuyệt Đỉnh</h3>
                  <Link href="/products" className="inline-flex items-center gap-1.5 bg-white text-brand-black text-[10px] font-bold px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-end items-start flex-1 border border-gray-100 group overflow-hidden relative text-left cursor-pointer min-h-[320px]">
                <img src="/accessories/day-sac-nhanh-typec-to-lightning.webp" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" alt="Cáp Sạc" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-0" />
                <div className="z-10 relative">
                  <span className="text-[10px] font-extrabold uppercase text-gray-300 tracking-wider">Chỉ Từ 490k</span>
                  <h3 className="font-display font-extrabold text-2xl text-white leading-snug mt-1 mb-4">Cáp Sạc Siêu Nhanh Bền Bỉ</h3>
                  <Link href="/products" className="inline-flex items-center gap-1.5 bg-white text-brand-black text-[10px] font-bold px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. Hot Summer Offer */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-extrabold text-2xl text-brand-black tracking-tight">
              Gợi Ý Nổi Bật Mùa Này
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronRight className="w-4 h-4 rotate-180" /></button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
            {/* 2 Stacked Horizontal Banners */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#f0f4f8] rounded-2xl p-6 md:p-8 flex items-center flex-1 relative overflow-hidden group cursor-pointer min-h-[220px]">
                <div className="z-10 w-3/5">
                  <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Lên Tới Giảm 50%</span>
                  <h3 className="font-display font-extrabold text-xl md:text-2xl text-brand-black my-2 leading-snug">AirPods Chống Ồn Tuyệt Đỉnh</h3>
                  <Link href="/products" className="mt-3 inline-flex items-center gap-1.5 bg-white text-brand-black text-[10px] font-bold px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-2.5 h-2.5 text-primary" />
                  </Link>
                </div>
                <div className="w-2/5 absolute right-0 bottom-0 h-full flex items-end justify-end">
                  <img src="/accessories/airpod-pro-gen2.png" className="h-[120%] object-cover group-hover:scale-105 transition-transform duration-500 origin-bottom-right rounded-br-2xl mix-blend-multiply" alt="AirPods" />
                </div>
              </div>
              <div className="bg-[#e6f4ea] rounded-2xl p-6 md:p-8 flex items-center flex-1 relative overflow-hidden group cursor-pointer min-h-[220px]">
                <div className="z-10 w-3/5">
                  <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">Ưu Đãi Đến 40%</span>
                  <h3 className="font-display font-extrabold text-xl md:text-2xl text-brand-black my-2 leading-snug">Củ Sạc Siêu Nhanh 25W</h3>
                  <Link href="/products" className="mt-3 inline-flex items-center gap-1.5 bg-white text-brand-black text-[10px] font-bold px-4 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors shadow-sm cursor-pointer">
                    Mua Ngay <ArrowRight className="w-2.5 h-2.5 text-primary" />
                  </Link>
                </div>
                <div className="w-2/5 absolute right-0 bottom-0 h-full flex items-end justify-end">
                  <img src="/accessories/cu-sac-nhanh-samsung-typeC.webp" className="h-full object-cover group-hover:scale-105 transition-transform duration-500 origin-bottom-right mix-blend-multiply" alt="Củ Sạc" />
                </div>
              </div>
            </div>
            {/* Grid of 4 Small Products -> Now VerticalProductCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hotSummerProducts.map(product => (
                <VerticalProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 8. Features */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-0 divide-y sm:divide-y-0 lg:divide-x divide-gray-200 bg-white py-8 px-4 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100">
            {[
              { icon: Headset, title: "Hỗ Trợ 24/7", subtitle: "Sẵn sàng phục vụ bạn mọi lúc." },
              { icon: Truck, title: "Miễn Phí Giao Hàng", subtitle: "Áp dụng cho đơn hàng đầu tiên." },
              { icon: Wallet, title: "Thanh Toán An Toàn", subtitle: "Đa dạng phương thức bảo mật." },
              { icon: RotateCcw, title: "Đổi Trả Dễ Dàng", subtitle: "Hệ thống đổi trả minh bạch." },
              { icon: ShieldCheck, title: "Bảo Mật Thông Tin", subtitle: "Dữ liệu cá nhân luôn được bảo vệ." },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 px-4 lg:px-6">
                <div className="text-[#ff3b60] shrink-0">
                  <f.icon className="w-10 h-10" strokeWidth={1.2} />
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="font-bold text-[13px] text-brand-black mb-1 leading-snug">{f.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 9. Footer Newsletter Banner */}
      <ScrollReveal>
        <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 mb-4">
          <div className="bg-zinc-950 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-zinc-800 group shadow-xl cursor-pointer">
            <div className="z-10 relative mb-6 md:mb-0 w-full md:w-3/5">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mb-4">
                Sẵn Sàng Mua Sắm Cùng Chúng Tôi.<br />Nhận Ngay Ưu Đãi Giảm 10% Trọn Đời
              </h2>
              <Link href="/products" className="bg-[#00c3f5] text-white font-bold text-xs px-6 py-3.5 rounded-full hover:bg-[#00b0dd] transition-colors shadow-[0_4px_20px_rgba(0,195,245,0.4)] flex items-center gap-2 w-fit mt-6 cursor-pointer">
                Bắt Đầu Mua Sắm Ngay
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 h-full w-full md:w-1/2 flex justify-end opacity-40 md:opacity-100 pointer-events-none">
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop" className="h-full object-cover object-right rounded-r-3xl" alt="Phone User" />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-0"></div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
