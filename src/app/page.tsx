"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { FlashSale } from "@/components/FlashSale";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import {
  Smartphone,
  Tablet,
  Headphones,
  ShieldAlert,
  Award,
  Sparkles,
  ChevronRight,
  Watch,
  Laptop,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | "phone" | "accessory">(
    "all",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Filter recommended products
  const recommendedProducts = PRODUCTS.filter((p) => {
    if (activeTab === "phone") return p.category === "phone";
    if (activeTab === "accessory") return p.category === "accessory";
    return true;
  });

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "phone":
        return <Smartphone className="h-6 w-6" />;
      case "tablet":
        return <Tablet className="h-6 w-6" />;
      case "accessory":
        return <Headphones className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isPageLoading) {
    return (
      <div className="pb-16 bg-[#f8f9fa] overflow-hidden">
        {/* Banner Skeleton */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="w-full h-[280px] sm:h-[400px] bg-gray-200 animate-pulse rounded-3xl" />
        </div>

        {/* ===== DANH MỤC NỔI BẬT SKELETON ===== */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center w-full animate-pulse">
                <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mt-3 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1.5 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale Banner Skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full h-[180px] sm:h-[260px] bg-gray-200 animate-pulse rounded-3xl" />
        </div>

        {/* Recommended for You Skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl h-[120px]">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-[#f8f9fa] overflow-hidden">
      {/* Banner Section */}
      <HeroBanner />

      {/* ===== DANH MỤC NỔI BẬT (COLLECTION LIST) ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-black tracking-tight uppercase">
            Danh Mục Nổi Bật
          </h2>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-brand-black hover:bg-primary hover:border-primary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-brand-black hover:bg-primary hover:border-primary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Row — 6 large circular cards filling the space */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center">
          {[
            {
              id: "phone",
              name: "ĐIỆN THOẠI",
              count: "250+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#dbebff]",
              href: "/products?category=phone",
            },
            {
              id: "tablet",
              name: "MÁY TÍNH BẢNG",
              count: "80+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#e0f2fe]",
              href: "/products?category=tablet",
            },
            {
              id: "headphone",
              name: "TAI NGHE",
              count: "110+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#f3f4f6]",
              href: "/products?category=accessory",
            },
            {
              id: "charger",
              name: "CÁP & CỦ SẠC",
              count: "45+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#111827]",
              href: "/products?category=accessory",
            },
            {
              id: "case",
              name: "ỐP LƯNG",
              count: "95+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#27273a]",
              href: "/products?category=accessory",
            },
            {
              id: "smartwatch",
              name: "ĐỒNG HỒ",
              count: "90+ SẢN PHẨM",
              img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&crop=center&q=80",
              bg: "bg-[#181824]",
              href: "/products?category=accessory",
            },
          ].map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex flex-col items-center w-full"
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center gap-3 cursor-pointer w-full text-center"
              >
                {/* Large round image container */}
                <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-44 xl:h-44 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-350 relative border border-gray-200/20">
                  <div className={`absolute inset-0 ${cat.bg} transition-opacity duration-300`} />
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-350 group-hover:scale-110"
                  />
                </div>

                {/* Text underneath */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-display font-bold text-xs sm:text-sm text-brand-black tracking-wider group-hover:text-primary transition-colors duration-200 uppercase">
                    {cat.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Flash Sale Banner (countdown + dynamic products) */}
      <FlashSale />

      {/* Recommended for You — Redesigned matching reference image */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 mb-6">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-black tracking-tight uppercase">
            Gợi Ý Cho Bạn
          </h2>

          {/* Categories Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", name: "TẤT CẢ SẢN PHẨM" },
              { id: "phone", name: "ĐIỆN THOẠI" },
              { id: "accessory", name: "PHỤ KIỆN" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-extrabold tracking-wider pb-2 transition-all duration-300 border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-brand-black"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3x3 Horizontal Product Cards Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl h-[120px]"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0" />
                  {/* Info Placeholder */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-150 rounded w-1/3" />
                  </div>
                </div>
                {/* Chevron Placeholder */}
                <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {recommendedProducts.slice(0, 9).map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Link
                  href="/products"
                  className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer h-[120px]"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Left Side: Product Image with background container */}
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl flex items-center justify-center p-2 shrink-0 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Middle: Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-display font-bold text-sm sm:text-base text-brand-black truncate group-hover:text-primary transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <span className="font-extrabold text-sm text-primary mt-1">
                        {product.basePrice.toLocaleString("vi-VN")}đ
                      </span>
                      <span className="inline-flex items-center text-[9px] sm:text-[10px] bg-green-50 text-green-600 font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md mt-2 self-start">
                        Còn hàng
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Action Chevron */}
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs ml-2">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Brand Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Apple banner */}
          <div className="relative rounded-3xl overflow-hidden h-[180px] bg-linear-to-r from-zinc-800 to-zinc-950 p-8 flex items-center justify-between text-white shadow-lg group cursor-pointer">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-extrabold tracking-widest text-primary uppercase">
                Apple Authorized Reseller
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl">
                Thế Giới Apple Đỉnh Cao
              </h3>
              <p className="text-gray-400 text-xs max-w-[200px]">
                Trải nghiệm iPhone, iPad, AirPods chính hãng giá tốt.
              </p>
              <Link
                href="/products?brand=Apple"
                className="text-primary font-bold text-xs flex items-center gap-1 hover:underline pt-2"
              >
                Mua ngay Apple <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop"
              alt="Apple devices"
              className="w-1/3 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-md"
            />
          </div>

          {/* Samsung banner */}
          <div className="relative rounded-3xl overflow-hidden h-[180px] bg-linear-to-r from-blue-900 to-indigo-950 p-8 flex items-center justify-between text-white shadow-lg group cursor-pointer">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-extrabold tracking-widest text-yellow-400 uppercase">
                Galaxy Innovation
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl">
                Trải Nghiệm Galaxy AI
              </h3>
              <p className="text-gray-400 text-xs max-w-[200px]">
                Tính năng dịch thuật trực tiếp, khoanh vùng tìm kiếm AI độc
                quyền.
              </p>
              <Link
                href="/products?brand=Samsung"
                className="text-primary font-bold text-xs flex items-center gap-1 hover:underline pt-2"
              >
                Mua ngay Samsung <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400&auto=format&fit=crop"
              alt="Samsung devices"
              className="w-1/3 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-gray-100 py-12 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                🏆
              </div>
              <h4 className="font-bold text-sm text-brand-black mt-2">
                Thương hiệu uy tín
              </h4>
              <p className="text-xs text-gray-500">
                Đối tác được ủy quyền bán lẻ hàng đầu tại Việt Nam.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                🚚
              </div>
              <h4 className="font-bold text-sm text-brand-black mt-2">
                Giao hàng tận nơi
              </h4>
              <p className="text-xs text-gray-500">
                Miễn phí giao hàng trên toàn quốc với mọi đơn từ 500k.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                💳
              </div>
              <h4 className="font-bold text-sm text-brand-black mt-2">
                Trả góp linh hoạt
              </h4>
              <p className="text-xs text-gray-500">
                Trả góp 0% lãi suất bằng thẻ tín dụng hoặc các công ty tài
                chính.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-light text-primary rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                🔧
              </div>
              <h4 className="font-bold text-sm text-brand-black mt-2">
                Bảo hành dài hạn
              </h4>
              <p className="text-xs text-gray-500">
                Đổi mới trong 30 ngày nếu lỗi phần cứng từ NSX.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
