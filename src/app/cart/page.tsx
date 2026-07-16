'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Ticket, 
  Sparkles, 
  CreditCard,
  CheckCircle,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderFinished, setIsOrderFinished] = useState(false);

  // Form checkout fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Apply Coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'PULSETECH' || code === 'CELLPHONES') {
      setDiscountPercent(10); // 10% discount
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ. Thử: PULSETECH');
      setCouponApplied(false);
      setDiscountPercent(0);
    }
  };

  // Fees
  const shippingFee = cartTotal > 5000000 ? 0 : 30000;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = cartTotal - discountAmount + shippingFee;

  // Handle Checkout submit
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && phoneNumber && shippingAddress) {
      setIsOrderFinished(true);
      setTimeout(() => {
        clearCart();
      }, 500);
    }
  };

  if (isPageLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col font-semibold animate-pulse">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-5 mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items skeleton */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-between gap-4 h-[120px]">
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-150 rounded w-1/3" />
                  </div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded" />
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
          {/* Summary skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="space-y-2 pt-2">
                <div className="h-3.5 bg-gray-150 rounded w-full" />
                <div className="h-3.5 bg-gray-150 rounded w-5/6" />
              </div>
              <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col font-semibold">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-black flex items-center gap-2.5">
          <ShoppingBag className="h-7 w-7 text-primary" /> Giỏ Hàng Của Bạn
        </h1>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Items List (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: -100 }}
                className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between transition hover:border-gray-200"
              >
                {/* Item Details */}
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-sm text-brand-black truncate max-w-[240px] sm:max-w-[320px]">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] font-bold text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md">Màu: {item.color}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md">Dung lượng: {item.storage}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Adjusters */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-primary font-display font-extrabold text-sm block">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-gray-400 text-[10px] font-medium block">
                        {formatPrice(item.price)} / sản phẩm
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 font-bold text-xs text-gray-500 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs text-brand-black text-center min-w-[30px] bg-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 font-bold text-xs text-gray-500 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-primary p-2 hover:bg-red-50 rounded-xl transition"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}

            <Link 
              href="/products" 
              className="text-xs text-gray-500 font-bold hover:text-primary flex items-center gap-1.5 self-start pt-2 transition group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* RIGHT: Order Summary (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Promo Code Coupon Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <span className="text-xs font-bold text-gray-500 block mb-3 uppercase tracking-wider">MÃ GIẢM GIÁ</span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Mã: PULSETECH"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="w-full bg-gray-50 border border-gray-200 placeholder-gray-400 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                  <Ticket className="absolute right-3 top-2.5 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode}
                  className="bg-brand-black hover:bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  Áp dụng
                </button>
              </form>
              {couponApplied && (
                <div className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5 mt-2 flex items-center justify-between">
                  <span>Áp dụng thành công (Giảm 10% đơn hàng)</span>
                  <button 
                    onClick={() => {
                      setCouponApplied(false);
                      setDiscountPercent(0);
                      setCouponCode('');
                    }}
                    className="text-primary hover:underline ml-1"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[10px] font-bold text-red-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Calculations Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-500 border-b border-gray-100 pb-3 uppercase tracking-wider mb-2">
                TÓM TẮT ĐƠN HÀNG
              </span>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tạm tính</span>
                <span className="text-brand-black">{formatPrice(cartTotal)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Chiết khấu ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-brand-black">
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>

              {shippingFee > 0 && (
                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 p-2 rounded-lg flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 shrink-0" /> Mua thêm {formatPrice(5000000 - cartTotal)} để được Miễn phí giao hàng.
                </span>
              )}
              
              <div className="flex justify-between font-display font-extrabold text-base text-brand-black border-t border-gray-100 pt-4 mt-2">
                <span>Tổng cộng</span>
                <span className="text-primary text-xl">{formatPrice(finalTotal)}</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition mt-4"
              >
                Tiến Hành Thanh Toán
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Empty Cart State */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mb-5 text-2xl font-bold">
            🛒
          </div>
          <h2 className="font-display font-extrabold text-xl text-brand-black mb-2">
            Giỏ hàng của bạn còn trống!
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold max-w-xs mb-6">
            Hãy chọn các thiết bị di động, tablet hoặc phụ kiện mới nhất chính hãng từ cửa hàng của chúng tôi.
          </p>
          <Link
            href="/products"
            className="bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-2xl transition shadow-md hover:scale-105 active:scale-95"
          >
            Mua Sắm Ngay
          </Link>
        </motion.div>
      )}

      {/* Checkout details Modal Overlay (Framer Motion) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isOrderFinished) setIsCheckoutOpen(false);
              }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              
              {!isOrderFinished ? (
                /* Checkout Form */
                <form onSubmit={handleConfirmOrder} className="space-y-5 flex-1 overflow-y-auto pr-1">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
                    <h3 className="font-display font-extrabold text-brand-black text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" /> Thông tin thanh toán
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="bg-gray-150 text-gray-500 hover:bg-gray-200 font-bold p-1 rounded-full text-xs transition"
                    >
                      Đóng
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Họ tên người nhận *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="09XXXXXXXX"
                        pattern="[0-9]{10}"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Địa chỉ giao hàng *</label>
                      <textarea
                        required
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-500 block">Phương thức thanh toán</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 border rounded-xl text-left flex items-center justify-between text-xs font-bold transition ${
                          paymentMethod === 'cod' 
                            ? 'border-primary bg-primary-light text-primary' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>Thanh toán COD</span>
                        <CheckCircle className={`h-4 w-4 shrink-0 ${paymentMethod === 'cod' ? 'text-primary' : 'text-gray-300'}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('vnpay')}
                        className={`p-3 border rounded-xl text-left flex items-center justify-between text-xs font-bold transition ${
                          paymentMethod === 'vnpay' 
                            ? 'border-primary bg-primary-light text-primary' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>Cổng VNPay-QR</span>
                        <CheckCircle className={`h-4 w-4 shrink-0 ${paymentMethod === 'vnpay' ? 'text-primary' : 'text-gray-300'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Total calculation show */}
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between font-bold text-xs border border-gray-100">
                    <span className="text-gray-500">Tổng thanh toán:</span>
                    <span className="text-primary text-base font-display font-extrabold">{formatPrice(finalTotal)}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition"
                  >
                    Xác Nhận Đặt Hàng
                  </button>
                </form>
              ) : (
                /* Success animation and feedback */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-5"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                      ✓
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-xl text-brand-black uppercase tracking-wide">
                      Đặt hàng thành công!
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto font-semibold">
                      Cảm ơn bạn <strong className="text-brand-black">{fullName}</strong> đã tin dùng sản phẩm của PulseTech. Nhân viên chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 10 phút.
                    </p>
                  </div>

                  {/* Order review details */}
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-left text-[11px] font-bold text-gray-500 space-y-2.5 max-w-xs mx-auto">
                    <div className="flex justify-between">
                      <span>Mã đơn hàng:</span>
                      <span className="text-brand-black tracking-wider font-extrabold uppercase">PT{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng tiền đơn:</span>
                      <span className="text-primary font-display font-extrabold">{formatPrice(finalTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Người nhận:</span>
                      <span className="text-brand-black">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hình thức nhận:</span>
                      <span className="text-brand-black">Giao tận nơi (COD)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsOrderFinished(false);
                      router.push('/');
                    }}
                    className="bg-brand-black hover:bg-gray-900 text-white text-xs font-bold px-8 py-3 rounded-2xl shadow-md transition hover:scale-105 active:scale-95"
                  >
                    Về Trang Chủ
                  </button>
                </motion.div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
