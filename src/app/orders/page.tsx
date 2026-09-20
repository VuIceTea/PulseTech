'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, ClipboardList, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { api, type Order } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function OrderHistoryPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.getOrderHistory(user.email);
        setOrders(data);
      } catch (err) {
        setError('Không thể lấy lịch sử đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user, isLoaded]);

  const handleCancelOrder = (orderId: string) => {
    setCancelTarget(orderId);
  };

  const confirmCancelOrder = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 4 } : o));
      toast.success('Hủy đơn hàng thành công!');
      setCancelTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      setCancelTarget(null);
    }
  };

  const timelineSteps = [
    { title: 'Đã đặt', icon: <ClipboardList className="w-4 h-4" /> },
    { title: 'Xác nhận', icon: <Package className="w-4 h-4" /> },
    { title: 'Đang giao', icon: <Truck className="w-4 h-4" /> },
    { title: 'Thành công', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const formatDate = (dateStr: string) => {
    return dateStr; // Backend already formats as dd/MM/yyyy HH:mm
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><RefreshCw className="h-8 w-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Header */}
      <div className="bg-brand-black pt-16 pb-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-wide uppercase mb-4">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
            Xem lại danh sách và trạng thái các đơn hàng bạn đã mua tại PulseTech.
          </p>
        </div>
      </div>

      <main className="flex-1 pt-3 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 justify-start">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Lịch sử đơn hàng</span>
          </div>

          {!user ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-2xl mx-auto">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-brand-black mb-2">Bạn chưa đăng nhập</h2>
              <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem lịch sử mua hàng của bạn. Hoặc bạn có thể tra cứu đơn hàng bằng Mã đơn hàng nếu bạn mua với tư cách khách.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/order-tracking" className="bg-brand-black hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-xl transition">
                  Tra Cứu Mã Đơn Hàng
                </Link>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-2xl text-center font-medium max-w-2xl mx-auto">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-2xl mx-auto">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-brand-black mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch mua hàng nào. Hãy khám phá các sản phẩm tuyệt vời của PulseTech nhé!</p>
              <Link href="/" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl transition inline-block">
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {orders.map((order, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={order.id}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-brand-black uppercase">Đơn hàng #{order.id}</h2>
                        <p className="text-sm text-gray-500 mt-1">Đặt ngày: {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                          order.status === 4 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {['Đã đặt hàng', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng'][order.status] ?? (order.status === 4 ? 'Đã hủy' : 'Đang xử lý')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-brand-black text-base truncate">{item.name}</h4>
                              <p className="text-sm text-gray-500 mt-1">{item.color} | {item.storage}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-medium">x{item.qty}</span>
                                <span className="font-bold text-brand-black text-lg">{formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="lg:w-[420px] bg-gray-50 rounded-2xl p-6 flex flex-col justify-between shrink-0">
                        <div className="space-y-4 text-sm font-medium text-gray-600 mb-6">
                          <div className="flex justify-between gap-4">
                            <span className="shrink-0">Người nhận:</span>
                            <span className="text-brand-black text-base font-semibold text-right">{order.customerName}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="shrink-0">Thanh toán:</span>
                            <span className="text-brand-black text-base font-semibold text-right">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-4 mt-4 items-center gap-4">
                            <span className="font-bold text-brand-black text-base shrink-0">Tổng tiền:</span>
                            <span className="font-extrabold text-primary text-2xl text-right">{formatPrice(order.totalPrice)}</span>
                          </div>
                        </div>
                        
                        <div className="relative pt-6 border-t border-gray-200 mt-2">
                           {/* Background Line */}
                           <div className="absolute top-[40px] left-[16px] right-[16px] h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
                             <motion.div
                               initial={{ width: 0 }}
                               animate={{ width: `${(Math.min(order.status === 4 ? 0 : order.status, 3) / 3) * 100}%` }}
                               transition={{ duration: 1, ease: 'easeOut' }}
                               className={`h-full progress-stripes ${order.status === 4 ? 'bg-red-500' : 'bg-green-500'}`}
                             />
                           </div>
                           
                           <div className="flex justify-between relative z-10">
                              {timelineSteps.map((step, sIdx) => {
                                const isCanceled = order.status === 4;
                                const isCompleted = sIdx <= (isCanceled ? 0 : order.status);
                                const isCanceledStep = isCanceled && sIdx === 0; // Highlight the first step as canceled if you want, but we'll just keep it green or make it red. Let's make it red if canceled.
                                
                                let circleClass = 'bg-white text-gray-300 border-gray-200';
                                if (isCanceledStep) {
                                  circleClass = 'bg-red-500 text-white border-red-100 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
                                } else if (isCompleted) {
                                  circleClass = 'bg-green-500 text-white border-green-100 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
                                }

                                return (
                                  <div key={sIdx} className="flex flex-col items-center text-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 relative ${circleClass}`}>
                                      {step.icon}
                                    </div>
                                    <span className={`text-xs font-bold max-w-[60px] leading-tight ${isCanceledStep ? 'text-red-500' : isCompleted ? 'text-brand-black' : 'text-gray-400'}`}>
                                      {isCanceledStep ? 'Đã hủy' : step.title}
                                    </span>
                                  </div>
                                );
                              })}
                           </div>
                        </div>
                        
                        {order.status <= 1 && (
                          <div className="mt-6">
                            <button onClick={() => handleCancelOrder(order.id)} className="w-full text-white bg-red-500 hover:bg-red-600 font-bold py-3 rounded-xl transition-colors shadow-sm">
                              Hủy đơn hàng
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-50 border-[6px] border-yellow-100/50 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://img.icons8.com/color/96/error--v1.png" alt="Warning" className="h-14 w-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2 text-center">Xác nhận hủy đơn</h3>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Bạn có chắc chắn muốn hủy đơn hàng #{cancelTarget} không? Thao tác này không thể hoàn tác.
                {orders.find(o => o.id === cancelTarget)?.status === 1 && (
                  <span className="block mt-2 font-semibold text-red-500">
                    Đơn hàng này đã thanh toán. Tiền sẽ được hoàn lại vào tài khoản của bạn ngay lập tức.
                  </span>
                )}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 py-3 font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => confirmCancelOrder(cancelTarget)}
                  className="flex-1 py-3 font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
