"use client";
import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"all" | "apple" | "samsung">(
    "all",
  );

  // Filter featured products
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured);

  const filteredFeatured = featuredProducts.filter((p) => {
    if (activeTab === "apple") return p.brand === "Apple";
    if (activeTab === "samsung") return p.brand === "Samsung";
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

  return (
    <div className="pb-16 bg-[#f8f9fa] overflow-hidden">
      {/* Banner Section */}
      <HeroBanner />

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-1 bg-primary rounded-full" />
          <h2 className="font-display font-extrabold text-lg sm:text-xl uppercase tracking-wider text-brand-black">
            Danh Mục Nổi Bật
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              id: "phone",
              name: "Điện thoại",
              icon: <Smartphone className="h-5 w-5" />,
              colorClass:
                "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
              badge: "Hot",
              count: "250+ sản phẩm",
            },
            {
              id: "tablet",
              name: "Máy tính bảng",
              icon: <Tablet className="h-5 w-5" />,
              colorClass:
                "bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
              badge: "Mới",
              count: "80+ sản phẩm",
            },
            {
              id: "accessory",
              name: "Phụ kiện",
              icon: <Headphones className="h-5 w-5" />,
              colorClass:
                "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
              badge: "Giảm 30%",
              count: "150+ sản phẩm",
            },
            {
              id: "laptop",
              name: "Laptop",
              icon: <Laptop className="h-5 w-5" />,
              colorClass:
                "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
              badge: "Ưu đãi",
              count: "120+ sản phẩm",
            },
            {
              id: "watch",
              name: "Đồng hồ",
              icon: <Watch className="h-5 w-5" />,
              colorClass:
                "bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
              badge: "Bán chạy",
              count: "90+ sản phẩm",
            },
            {
              id: "audio",
              name: "Âm thanh",
              icon: <Headphones className="h-5 w-5" />,
              colorClass:
                "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white",
              badge: "Deal hời",
              count: "110+ sản phẩm",
            },
          ].map((cat) => (
            <Link
              key={cat.id}
              href={
                cat.id === "phone" ||
                cat.id === "tablet" ||
                cat.id === "accessory"
                  ? `/products?category=${cat.id}`
                  : "/products"
              }
              className="bg-white p-5 rounded-4xl flex flex-col items-center justify-center gap-3 text-center group hover:border-primary/20 hover:shadow-lg transition-all duration-500 cursor-pointer active:scale-95 relative overflow-hidden"
            >
              {/* Promotion Badge */}
              <span
                className={`absolute top-2.5 right-2.5 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider scale-95 transition-all duration-300 ${
                  cat.badge === "Hot"
                    ? "bg-red-500 text-white"
                    : cat.badge === "Mới"
                      ? "bg-blue-500 text-white"
                      : cat.badge === "Ưu đãi"
                        ? "bg-amber-500 text-brand-light"
                        : "bg-brand-black text-white"
                }`}
              >
                {cat.badge}
              </span>

              {/* Icon Container */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 shadow-sm ${cat.colorClass}`}
              >
                {cat.icon}
              </div>

              {/* Text details */}
              <div className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-xs text-brand-black group-hover:text-primary transition-colors leading-tight">
                  {cat.name}
                </span>
                <span className="text-[9px] text-gray-400 font-semibold group-hover:text-primary/70 transition-colors">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner (countdown + dynamic products) */}
      <FlashSale />

      {/* Featured Products Tabs Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-display font-extrabold text-lg sm:text-2xl uppercase tracking-wider text-brand-black flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span>Gợi Ý Cho Bạn</span>
          </h2>

          {/* Brand Tabs */}
          <div className="flex gap-2">
            {[
              { id: "all", name: "Tất cả" },
              { id: "apple", name: "Apple" },
              { id: "samsung", name: "Samsung" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition duration-300 ${
                  activeTab === tab.id
                    ? "bg-brand-black text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
        >
          {filteredFeatured.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

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
