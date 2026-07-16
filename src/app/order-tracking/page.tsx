'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronRight,
  ClipboardList,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'found' | 'not-found'>('idle');

  // Mock order data
  const mockOrder = {
    id: 'PT123456',
    status: 2, // 0: Đặt hàng, 1: Đã xác nhận, 2: Đang giao, 3: Đã giao
    customerName: 'Nguyễn Văn A',
    customerPhone: '0987654321',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    createdAt: '15/07/2026 14:30',
    totalPrice: 22490000,
    items: [
      {
        id: '1',
        name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
        price: 21990000,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=200&auto=format&fit=crop'
      },
      {
        id: '2',
        name: 'Ốp lưng MagSafe trong suốt',
        price: 500000,
        qty: 1,
        image: '/accessories/op-lung-iphone-15-pro-trong-suot-magsafe.png'
      }
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;

    setIsLoading(true);
    setSearchStatus('idle');

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      if (orderId.toUpperCase() === 'PT123456') {
        setSearchStatus('found');
      } else {
        setSearchStatus('not-found');
      }
    }, 1500);
  };

  const timelineSteps = [
    { title: 'Đã đặt hàng', icon: <ClipboardList className="w-5 h-5" />, desc: '15/07 14:30' },
    { title: 'Đã xác nhận', icon: <Package className="w-5 h-5" />, desc: '15/07 16:00' },
    { title: 'Đang giao hàng', icon: <Truck className="w-5 h-5" />, desc: '16/07 08:30' },
    { title: 'Giao thành công', icon: <CheckCircle2 className="w-5 h-5" />, desc: 'Dự kiến 16/07' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shimmer-sweep {
          background: linear-gradient(90deg, #22c55e 0%, #4ade80 20%, #bbf7d0 50%, #4ade80 80%, #22c55e 100%);
          background-size: 200% auto;
          animation: shimmer-sweep 2s linear infinite;
        }
      `}} />
      {/* Hero Header */}
      <div className="bg-brand-black pt-16 pb-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-wide uppercase mb-4">
            Tra Cứu Đơn Hàng
          </h1>
          <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
            Kiểm tra trạng thái đơn hàng của bạn nhanh chóng và chính xác nhất tại PulseTech.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 justify-start">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Tra cứu đơn hàng</span>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mã đơn hàng (VD: PT123456)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-brand-black px-12 py-4 rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Số điện thoại đặt hàng"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-brand-black px-12 py-4 rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  'Tra Cứu'
                )}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-4">
              * Mẹo: Nhập mã <strong className="text-brand-black">PT123456</strong> để xem dữ liệu mô phỏng.
            </p>
          </div>

          {/* Search Results */}
          <AnimatePresence mode="wait">
            {searchStatus === 'not-found' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-500 p-6 rounded-2xl text-center font-medium"
              >
                Không tìm thấy đơn hàng nào khớp với thông tin bạn cung cấp. Vui lòng kiểm tra lại mã đơn hàng hoặc số điện thoại.
              </motion.div>
            )}

            {searchStatus === 'found' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Timeline Box */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
                    <h2 className="text-xl font-display font-bold text-brand-black">Đơn hàng #{mockOrder.id}</h2>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                      Đang giao hàng
                    </span>
                  </div>

                  {/* Horizontal Timeline */}
                  <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-6 left-10 right-10 h-1 bg-gray-100 rounded-full hidden sm:block"></div>
                    {/* Active Line */}
                    <div
                      className="absolute top-6 left-10 h-1 rounded-full hidden sm:block transition-all duration-1000 ease-in-out animate-shimmer-sweep"
                      style={{ width: `${(mockOrder.status / (timelineSteps.length - 1)) * 100}%` }}
                    ></div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-0 relative z-10">
                      {timelineSteps.map((step, idx) => {
                        const isCompleted = idx <= mockOrder.status;
                        const isActive = idx === mockOrder.status;
                        return (
                          <div key={idx} className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-colors duration-500 ${isCompleted ? 'bg-green-500 text-white border-green-100' : 'bg-white text-gray-300 border-gray-100'
                              } ${isActive ? 'ring-4 ring-green-500/20 shadow-lg' : ''}`}>
                              {step.icon}
                            </div>
                            <div>
                              <p className={`font-bold text-sm sm:text-base ${isCompleted ? 'text-brand-black' : 'text-gray-400'}`}>
                                {step.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Customer Info */}
                  <div className="md:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-display font-bold text-brand-black mb-4">Thông tin nhận hàng</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                        <User className="w-5 h-5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Người nhận</p>
                          <p className="font-semibold text-brand-black">{mockOrder.customerName}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Số điện thoại</p>
                          <p className="font-semibold text-brand-black">{mockOrder.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Địa chỉ giao hàng</p>
                          <p className="font-semibold text-brand-black leading-relaxed">{mockOrder.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Thanh toán</p>
                          <p className="font-semibold text-brand-black">{mockOrder.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="font-display font-bold text-brand-black mb-4 border-b border-gray-100 pb-3">Sản phẩm đã đặt</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                      {mockOrder.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-brand-black line-clamp-2 mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-500">Số lượng: {item.qty}</p>
                          </div>
                          <div className="font-bold text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Tạm tính</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mockOrder.totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Phí vận chuyển</span>
                        <span>0 ₫</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-brand-black pt-2">
                        <span>Tổng tiền</span>
                        <span className="text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mockOrder.totalPrice)}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
