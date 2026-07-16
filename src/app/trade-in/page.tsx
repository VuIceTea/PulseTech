'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Smartphone, 
  Search, 
  CheckCircle2, 
  CreditCard, 
  Store, 
  Laptop, 
  Watch,
  Volume2,
  ChevronRight
} from 'lucide-react';
import { CATEGORIES, BRANDS } from '@/data/products';

export default function TradeInPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('phone');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for trade-in prices
  const tradeInDevices = [
    { id: 1, name: 'iPhone 14 Pro Max', category: 'phone', brand: 'Apple', priceType1: 18500000, priceType2: 17000000, priceType3: 15000000, img: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop' },
    { id: 2, name: 'iPhone 13 Pro Max', category: 'phone', brand: 'Apple', priceType1: 13500000, priceType2: 12000000, priceType3: 10500000, img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Samsung Galaxy S23 Ultra', category: 'phone', brand: 'Samsung', priceType1: 16000000, priceType2: 14500000, priceType3: 12500000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop' },
    { id: 4, name: 'MacBook Pro M2 13"', category: 'laptop', brand: 'Apple', priceType1: 22000000, priceType2: 20000000, priceType3: 18000000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
    { id: 5, name: 'iPad Pro 11" M2', category: 'tablet', brand: 'Apple', priceType1: 15500000, priceType2: 14000000, priceType3: 12500000, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' },
    { id: 6, name: 'AirPods Pro 2', category: 'audio', brand: 'Apple', priceType1: 3000000, priceType2: 2500000, priceType3: 18000000, img: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop' },
  ];

  const filteredDevices = tradeInDevices.filter(d => 
    d.category === selectedCategory && 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Thu Cũ Đổi Mới</span>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl overflow-hidden shadow-xl mb-12 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 px-6 py-12 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4 uppercase tracking-tight">
                  Thu Cũ Đổi Mới <br/>
                  <span className="text-yellow-400">Trợ Giá Lên Đời Đến 3 Triệu</span>
                </h1>
                <p className="text-red-100 text-lg md:text-xl font-medium mb-8 leading-relaxed">
                  Định giá nhanh chóng - Thủ tục 5 phút - Mang máy mới về nhà ngay hôm nay. PulseTech cam kết thu mua giá cao nhất thị trường.
                </p>
                <button className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:text-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1">
                  Định giá máy của bạn ngay
                </button>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
                  <RefreshCw className="h-32 w-32 text-white opacity-90 animate-[spin_10s_linear_infinite]" />
                </div>
              </div>
            </div>
          </div>

          {/* 3 Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-display font-bold text-center mb-8 text-brand-black">QUY TRÌNH THU CŨ SIÊU TỐC</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Search className="h-8 w-8" />, title: '1. Định giá online', desc: 'Tìm và chọn tên máy cũ của bạn để xem giá thu mua dự kiến ngay lập tức.' },
                { icon: <Store className="h-8 w-8" />, title: '2. Kiểm tra máy tại shop', desc: 'Mang máy ra cửa hàng gần nhất để kỹ thuật viên kiểm tra tình trạng thực tế.' },
                { icon: <CheckCircle2 className="h-8 w-8" />, title: '3. Chốt giá & Đổi máy', desc: 'Thanh toán khoản chênh lệch và rinh ngay siêu phẩm mới về nhà.' },
              ].map((step, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-100 group-hover:bg-red-500 transition-colors"></div>
                  <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Device Pricing Tool */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-16">
            <h2 className="text-2xl font-display font-bold mb-8 text-brand-black flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-primary" /> Bảng Định Giá Máy Cũ
            </h2>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-4 mb-6 hide-scrollbar gap-2 border-b border-gray-100">
              {[
                { id: 'phone', name: 'Điện thoại', icon: <Smartphone className="h-4 w-4" /> },
                { id: 'tablet', name: 'Máy tính bảng', icon: <Smartphone className="h-4 w-4" /> },
                { id: 'laptop', name: 'Laptop', icon: <Laptop className="h-4 w-4" /> },
                { id: 'audio', name: 'Âm thanh', icon: <Volume2 className="h-4 w-4" /> },
                { id: 'watch', name: 'Smartwatch', icon: <Watch className="h-4 w-4" /> },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-red-50 text-red-600 border-b-2 border-red-600' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-8 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nhập tên thiết bị bạn muốn bán (VD: iPhone 13 Pro Max...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-brand-black px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
              />
            </div>

            {/* Grid */}
            {filteredDevices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map(device => (
                  <div key={device.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all hover:border-red-200 cursor-pointer group bg-white">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 relative">
                        <img src={device.img} alt={device.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <h4 className="font-bold text-brand-black line-clamp-2 mb-2">{device.name}</h4>
                        <div className="mt-auto">
                          <p className="text-xs text-gray-500 mb-0.5">Giá thu Loại 1 (Dự kiến)</p>
                          <p className="text-red-600 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(device.priceType1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">Chưa có dữ liệu định giá cho thiết bị này.</p>
                <p className="text-sm text-gray-400 mt-2">Vui lòng mang máy ra cửa hàng gần nhất để được định giá trực tiếp.</p>
              </div>
            )}
          </div>

          {/* Classification Table */}
          <div className="bg-gradient-to-br from-gray-900 to-brand-black rounded-3xl p-6 md:p-10 text-white">
            <h2 className="text-2xl font-display font-bold mb-8 text-center text-white">PHÂN LOẠI TÌNH TRẠNG MÁY CŨ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4">L1</div>
                <h4 className="text-lg font-bold mb-3 text-white">Loại 1 - Máy Đẹp 99%</h4>
                <ul className="space-y-2 text-sm text-gray-300 font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Thân máy nguyên vẹn, không xước/cấn móp.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Màn hình đẹp, không ám ố, không trầy.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Pin từ 90% trở lên. Mọi chức năng hoàn hảo.</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4">L2</div>
                <h4 className="text-lg font-bold mb-3 text-white">Loại 2 - Có Trầy Xước 97%</h4>
                <ul className="space-y-2 text-sm text-gray-300 font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" /> Khung viền có xước dăm nhẹ, không cấn móp sâu.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" /> Màn hình xước siêu nhẹ.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" /> Pin từ 80-89%. Chức năng hoạt động bình thường.</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4">L3</div>
                <h4 className="text-lg font-bold mb-3 text-white">Loại 3 - Trầy Móp Nhiều</h4>
                <ul className="space-y-2 text-sm text-gray-300 font-medium">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Khung viền có cấn móp, màn hình xước lông mèo.</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Kính camera xước nhẹ (không ảnh hưởng ảnh chụp).</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Pin dưới 80%. Mất chống nước, máy từng mở.</li>
                </ul>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-8 font-medium">
              * Lưu ý: Giá thu mua cuối cùng sẽ do chuyên viên tại cửa hàng thẩm định dựa trên tình trạng thực tế của máy.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
