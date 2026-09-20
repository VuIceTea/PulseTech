'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, userApi, orderApi, UserAddress, Coupon, FullCoupon } from '@/lib/api';
import {
  AppliedCoupons,
  CHECKOUT_COUPONS_STORAGE_KEY,
  calculateCheckoutTotals,
  consumeCheckoutCouponTransfer,
  couponKindLabel,
  getCouponKind,
  listAppliedCoupons,
} from '@/lib/checkoutCoupons';
import { ArrowLeft, Banknote, ShieldCheck, CheckCircle, AlertCircle, Tag, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoaded, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<{ orderId: string; customerName: string; totalPrice: number; paymentMethod: string } | null>(null);
  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState((user as any)?.phone || '');
  const [shippingAddress, setShippingAddress] = useState((user as any)?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY' | 'MOMO' | 'STRIPE'>('COD');

  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupons>({});
  const [couponError, setCouponError] = useState<string | null>(null);

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<FullCoupon[]>([]);

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

      orderApi.getCoupons(user.email).then(data => {
        setAvailableVouchers(data.filter(c => c.isActive));
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (!mounted) return;
    const cartKey = cart
      .map(item => `${item.id}:${item.color}:${item.storage}:${item.quantity}`)
      .sort()
      .join('|');
    setAppliedCoupons(consumeCheckoutCouponTransfer(cartKey));
  }, [mounted, cart]);

  // Redirect to cart if it's empty (e.g. after successful checkout or direct access)
  useEffect(() => {
    if (mounted && isLoaded && cart.length === 0 && !isSubmitting && !successOrder) {
      router.replace('/cart');
    }
  }, [mounted, isLoaded, cart.length, isSubmitting, successOrder, router]);

  if (!mounted || !isLoaded || (cart.length === 0 && !successOrder)) return null;

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

  const handleApplyCoupon = async (codeToApply: string = couponCode) => {
    setCouponError(null);
    if (!codeToApply) return;
    try {
      const products = await api.products();
      const productIds = cart.map(item => {
        const product = products.find(candidate =>
          candidate.id === item.id || candidate.storages?.some(storage =>
            item.id === `${candidate.id}-${storage.name.replace(/\s+/g, '-')}`
          )
        );
        return product?.id || item.id;
      });
      const res = await orderApi.validateCoupon({ code: codeToApply.trim(), orderAmount: cartTotal, shippingFee, productIds, customerEmail: user?.email || '' });
      if (res && res.success) {
        const nextCoupon = res.data as Coupon;
        const kind = getCouponKind(nextCoupon);
        const nextCoupons = { ...appliedCoupons, [kind]: nextCoupon };
        setAppliedCoupons(nextCoupons);
        setCouponCode(nextCoupon.code);
        setShowVoucherModal(false);
        setCouponError(null);
      } else {
        setCouponError(typeof res.data === 'string' ? res.data : 'Mã giảm giá không hợp lệ.');
      }
    } catch (e) {
      setCouponError(e instanceof Error ? e.message : 'Không thể kiểm tra mã giảm giá.');
    }
  };

  const shippingFee = cartTotal > 5000000 ? 0 : 30000;
  const { productDiscount, shippingDiscount, payableShippingFee, finalTotal, totalDiscount } = calculateCheckoutTotals(cartTotal, shippingFee, appliedCoupons);
  const appliedCouponList = listAppliedCoupons(appliedCoupons);

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
      // Resolve legacy generated variant ids before sending the order. The
      // backend accepts the parent product id plus color/storage selections.
      const products = await api.products();
      const normalizedItems = cart.map(item => {
        const product = products.find(candidate =>
          candidate.id === item.id || candidate.storages?.some(storage =>
            item.id === `${candidate.id}-${storage.name.replace(/\s+/g, '-')}`
          )
        );
        if (!product) {
          throw new Error(`Sản phẩm "${item.name}" không còn tồn tại. Vui lòng xóa khỏi giỏ hàng.`);
        }
        return {
          productId: product.id,
          color: item.color,
          storage: item.storage,
          quantity: item.quantity,
        };
      });

      const order = await api.createOrder({
        customerName: fullName,
        customerPhone: phoneNumber,
        customerEmail: user?.email || '',
        address: shippingAddress,
        paymentMethod,
        couponCodes: appliedCouponList.map(coupon => coupon.code),
        items: normalizedItems,
      });

      if (!order?.id || !Array.isArray(order.items) || order.totalPrice < 0) {
        throw new Error('Backend trả về thông tin đơn hàng không hợp lệ. Vui lòng thử lại.');
      }

      localStorage.setItem('last_order_info', JSON.stringify({
        customerName: fullName,
        orderId: order.id,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        discountAmount: totalDiscount > 0 ? totalDiscount : undefined,
        couponCodes: appliedCouponList.map(coupon => coupon.code),
      }));

      if (order.paymentUrl) {
        sessionStorage.removeItem(CHECKOUT_COUPONS_STORAGE_KEY);
        window.location.href = order.paymentUrl;
        return;
      }

      await clearCart();
      sessionStorage.removeItem(CHECKOUT_COUPONS_STORAGE_KEY);
      setSuccessOrder({
        orderId: order.id,
        customerName: order.customerName || fullName,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
      });

    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Không thể tạo đơn hàng');
    } finally {
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
                  <span className="font-bold text-brand-black">{payableShippingFee === 0 ? 'Miễn phí' : formatPrice(payableShippingFee)}</span>
                </div>
                {appliedCoupons.PRODUCT && productDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium flex items-center gap-1"><Tag className="w-3 h-3" /> Mã sản phẩm ({appliedCoupons.PRODUCT.code})</span>
                    <span className="font-bold text-primary">-{formatPrice(productDiscount)}</span>
                  </div>
                )}
                {appliedCoupons.SHIPPING && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium flex items-center gap-1"><Tag className="w-3 h-3" /> Mã vận chuyển ({appliedCoupons.SHIPPING.code})</span>
                    <span className="font-bold text-primary">-{formatPrice(shippingDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Nhập mã giảm giá */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Mã giảm giá</label>
                  <button type="button" onClick={() => setShowVoucherModal(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    <Ticket className="w-4 h-4" />
                    Chọn mã giảm giá
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Nhập mã giảm giá" className="flex-1 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-primary focus:border-primary" />
                  <button type="button" onClick={() => handleApplyCoupon()} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-700 shrink-0 whitespace-nowrap">Áp dụng</button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                {appliedCouponList.map((coupon) => {
                  const kind = getCouponKind(coupon);
                  return (
                    <div key={kind} className="flex items-center justify-between gap-2 text-green-600 text-xs mt-1">
                      <span>Đã áp dụng mã {couponKindLabel(kind)} {coupon.code}</span>
                      <button
                        type="button"
                        className="text-primary font-bold hover:underline"
                        onClick={() => {
                          const nextCoupons = { ...appliedCoupons };
                          delete nextCoupons[kind];
                          setAppliedCoupons(nextCoupons);
                          if (couponCode.trim().toUpperCase() === coupon.code) setCouponCode('');
                        }}
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                  );
                })}
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

      <AnimatePresence>
        {successOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 m-auto w-[92%] max-w-2xl h-fit bg-white rounded-[28px] shadow-2xl p-8 sm:p-10 z-50 overflow-hidden text-center"
            >
              <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-brand-black">
                Đặt hàng thành công!
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base font-semibold leading-7 text-gray-500">
                Cảm ơn bạn <strong className="text-brand-black">{successOrder.customerName}</strong> đã tin dùng sản phẩm của PulseTech.
                Nhân viên chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 10 phút.
              </p>

              <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-gray-100 bg-gray-50 p-6 text-left text-sm font-bold text-gray-500 space-y-5">
                <div className="flex justify-between gap-4">
                  <span>Mã đơn hàng:</span>
                  <span className="text-brand-black">{successOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span>Tổng tiền:</span>
                  <span className="font-display text-2xl font-extrabold text-primary">{formatPrice(successOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Người nhận:</span>
                  <span className="text-brand-black">{successOrder.customerName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Hình thức thanh toán:</span>
                  <span className="text-brand-black text-right">{successOrder.paymentMethod}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-8 rounded-2xl bg-brand-black px-10 py-4 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:bg-gray-900 active:scale-95"
              >
                Về Trang Chủ
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Voucher Modal */}
      <AnimatePresence>
        {showVoucherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-gray-50 shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-3xl flex justify-between items-center">
                <h3 className="font-bold text-lg text-brand-black">Chọn Mã Giảm Giá</h3>
                <button onClick={() => setShowVoucherModal(false)} className="text-gray-400 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                {availableVouchers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">Không có mã giảm giá nào.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableVouchers.map((v) => {
                      const isEligible = cartTotal >= v.minOrderValue;
                      return (
                        <div key={v.id} className={`h-full ${isEligible ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`} onClick={() => isEligible && handleApplyCoupon(v.code)}>
                          <BackgroundGradient className={`p-4 flex flex-col justify-between relative overflow-hidden h-full shadow-sm ${isEligible ? 'text-white' : 'text-gray-200'}`}>
                            <div className="absolute top-0 right-0 h-16 w-16 bg-white/10 rounded-bl-full z-0 blur-xl"></div>
                            <div className="relative z-10 flex flex-col h-full">
                              <div>
                                <span className="inline-block rounded bg-white/20 backdrop-blur-md px-2 py-1 text-xs font-bold shadow-sm">
                                  {v.discountPercent > 0 ? `Giảm ${v.discountPercent}%` : `Giảm ${v.discountAmount / 1000}K`}
                                </span>
                                <h4 className="mt-2 font-bold text-lg">{v.code}</h4>
                                {(v.count ?? 0) > 1 && (
                                  <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[11px] font-extrabold text-primary shadow-sm">
                                    x{v.count}
                                  </span>
                                )}
                                <p className="mt-1 text-xs opacity-90 flex-1 line-clamp-2">{v.description}</p>
                                <p className="mt-2 text-[10px] font-medium opacity-80">Đơn tối thiểu: {v.minOrderValue.toLocaleString()}đ</p>
                              </div>
                            </div>
                          </BackgroundGradient>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
