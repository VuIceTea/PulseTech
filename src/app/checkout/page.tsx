'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, userApi, orderApi, UserAddress, Coupon } from '@/lib/api';
import { ArrowLeft, CreditCard, Wallet, Banknote, ShieldCheck, CheckCircle, AlertCircle, Tag, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoaded, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState((user as any)?.phone || '');
  const [shippingAddress, setShippingAddress] = useState((user as any)?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, VNPAY, MOMO, STRIPE

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Ensure client render
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (user) {
      userApi.getAddresses(user.email).then(data => {
        setSavedAddresses(data);
        const defaultAddr = data.find(a => a.isDefault);
        if (defaultAddr && !shippingAddress) {
          setShippingAddress(`${defaultAddr.addressLine}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.city}`);
          setFullName(defaultAddr.fullName);
          setPhoneNumber(defaultAddr.phone);
        }
      }).catch(console.error);
    }
  }, [user]);

  // Redirect to cart if it's empty (e.g. after successful checkout or direct access)
  useEffect(() => {
    if (mounted && isLoaded && cart.length === 0) {
      router.replace('/cart');
    }
  }, [mounted, isLoaded, cart.length, router]);

  if (!mounted || !isLoaded || cart.length === 0) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-brand-black mb-2 text-center">
          Vui lòng đăng nhập
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Bạn cần đăng nhập tài khoản để tiến hành thanh toán và theo dõi đơn hàng.
        </p>
        <Link
          href="/login?redirect=/checkout"
          className="bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#d70018f2] transition-colors shadow-md"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handleApplyCoupon = async () => {
    setCouponError(null);
    if (!couponCode) return;
    try {
      const coupon = await orderApi.validateCoupon(couponCode);
      if (cartTotal < coupon.minOrderValue) {
        setCouponError(`Đơn hàng tối thiểu ${formatPrice(coupon.minOrderValue)}`);
      } else {
        setAppliedCoupon(coupon);
      }
    } catch (e: any) {
      setCouponError(e.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountValue = (cartTotal * appliedCoupon.discountPercent) / 100;
      if (appliedCoupon.maxDiscountValue > 0 && discountValue > appliedCoupon.maxDiscountValue) {
        discountValue = appliedCoupon.maxDiscountValue;
      }
    } else {
      discountValue = appliedCoupon.discountAmount;
    }
  }

  const shippingFee = cartTotal > 5000000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee - discountValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!fullName || !phoneNumber || !shippingAddress) {
      setCheckoutError('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setCheckoutError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }

    if (shippingAddress.trim().length < 10) {
      setCheckoutError('Địa chỉ giao hàng quá ngắn. Vui lòng nhập chi tiết hơn (số nhà, phường/xã...).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dùng API frontend để tạo đơn hàng.
      const order = await api.createOrder({
        customerName: fullName,
        customerPhone: phoneNumber,
        customerEmail: user?.email || '',
        address: shippingAddress,
        paymentMethod,
        items: cart.map(item => ({
          productId: item.id,
          color: item.color,
          storage: item.storage,
          quantity: item.quantity,
        })),
      });

      localStorage.setItem('last_order_info', JSON.stringify({
        customerName: fullName,
        totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        paymentMethod: paymentMethod === 'cod' ? 'Giao tận nơi (COD)' : 'Thanh toán trực tuyến (VNPay)'
      }));

      if (order.paymentUrl) {
        window.location.href = order.paymentUrl;
        return;
      }

      router.push(`/cart?payment_success=true&orderId=${order.id}`);

    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Không thể tạo đơn hàng');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-display font-extrabold text-2xl text-brand-black">
            Thanh Toán Đơn Hàng
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Form & Payments */}
          <div className="flex-1 space-y-6">

            {checkoutError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {checkoutError}
              </div>
            )}

            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-lg text-brand-black mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Thông tin giao hàng
              </h2>

              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn địa chỉ đã lưu</label>
                  <div className="grid gap-2">
                    {savedAddresses.map(addr => (
                      <div key={addr.id} onClick={() => {
                        setShippingAddress(`${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.city}`);
                        setFullName(addr.fullName);
                        setPhoneNumber(addr.phone);
                      }} className="p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-primary flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-sm font-bold">{addr.fullName} - {addr.phone}</p>
                          <p className="text-xs text-gray-500">{addr.addressLine}, {addr.ward}, {addr.district}, {addr.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-sm"
                    placeholder="Nhập họ tên người nhận"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-sm"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all text-sm"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-lg text-brand-black mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* Tiền mặt */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-primary focus:ring-primary" />
                  <div className="ml-3 flex items-center gap-3">
                    <Banknote className="w-15 h-15 text-emerald-600" />
                    <div>
                      <p className="font-bold text-sm text-brand-black">Tiền mặt (Thanh toán khi nhận hàng)</p>
                      <p className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi giao hàng tới nơi</p>
                    </div>
                  </div>
                </label>

                {/* VNPAY */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} className="text-primary focus:ring-primary" />
                  <div className="ml-3 flex items-center gap-3">
                    <img src="/icons/v-vnpay.svg" alt="VNPAY" className="h-15 w-auto object-contain" />
                    <div>
                      <p className="font-bold text-sm text-brand-black">VNPay</p>
                      <p className="text-xs text-gray-500">Quét mã qua ứng dụng ngân hàng hoặc ví VNPAY</p>
                    </div>
                  </div>
                </label>

                {/* MoMo */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'MOMO' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="MOMO" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} className="text-primary focus:ring-primary" />
                  <div className="ml-3 flex items-center gap-3">
                    <img src="/icons/momo.png" alt="MoMo" className="h-15 w-auto object-contain rounded" />
                    <div>
                      <p className="font-bold text-sm text-brand-black">MoMo</p>
                      <p className="text-xs text-gray-500">Thanh toán qua ví điện tử MoMo</p>
                    </div>
                  </div>
                </label>

                {/* Stripe */}
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'STRIPE' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="STRIPE" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} className="text-primary focus:ring-primary" />
                  <div className="ml-3 flex items-center gap-3">
                    <img src="/icons/stripe.svg" alt="Stripe" className="h-7 w-auto object-contain" />
                    <div>
                      <p className="font-bold text-sm text-brand-black">Stripe (Thẻ Quốc Tế)</p>
                      <p className="text-xs text-gray-500">Thanh toán an toàn qua thẻ Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-brand-black mb-4">Tổng quan đơn hàng</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-brand-black line-clamp-2 leading-snug mb-1">{item.name}</h4>
                      <div className="text-[10px] text-gray-500 font-medium space-x-1">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.color}</span>
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.storage}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col justify-between">
                      <span className="text-xs font-bold text-primary">{formatPrice(item.price)}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">x{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Tạm tính ({cart.length} SP)</span>
                  <span className="font-bold text-brand-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Phí vận chuyển</span>
                  <span className="font-bold text-brand-black">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium flex items-center gap-1"><Tag className="w-3 h-3" /> Mã giảm giá ({appliedCoupon.code})</span>
                    <span className="font-bold text-primary">-{formatPrice(discountValue)}</span>
                  </div>
                )}
              </div>

              {/* Nhập mã giảm giá */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Nhập mã giảm giá" className="flex-1 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-primary focus:border-primary" />
                  <button type="button" onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-700 shrink-0 whitespace-nowrap">Áp dụng</button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {appliedCoupon && <p className="text-green-600 text-xs mt-1">Đã áp dụng mã {appliedCoupon.code}</p>}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-700">Tổng thanh toán</span>
                  <span className="text-2xl font-display font-extrabold text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-[#d70018f2] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Đặt Hàng Ngay
              </button>

              <p className="text-[12px] text-gray-400 text-center mt-4">
                Bằng việc tiến hành đặt hàng, bạn đồng ý với Điều khoản và chính sách của chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
