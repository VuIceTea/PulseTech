import type { Coupon } from '@/lib/api';

export type CouponKind = 'PRODUCT' | 'SHIPPING';
export type AppliedCoupons = Partial<Record<CouponKind, Coupon>>;

export const CHECKOUT_COUPONS_STORAGE_KEY = 'pulsetech_checkout_coupons';
export const CHECKOUT_COUPONS_TRANSFER_KEY = 'pulsetech_checkout_coupon_transfer';

export function getCouponKind(coupon: Pick<Coupon, 'code'> & Partial<Pick<Coupon, 'couponType'>>): CouponKind {
  if (coupon.couponType === 'SHIPPING' || coupon.couponType === 'PRODUCT') {
    return coupon.couponType;
  }
  const code = coupon.code.toUpperCase();
  return code.includes('SHIP') || code.includes('DELIVERY') ? 'SHIPPING' : 'PRODUCT';
}

export function couponKindLabel(kind: CouponKind) {
  return kind === 'SHIPPING' ? 'vận chuyển' : 'sản phẩm';
}

export function listAppliedCoupons(coupons: AppliedCoupons) {
  return [coupons.PRODUCT, coupons.SHIPPING].filter(Boolean) as Coupon[];
}

export function calculateCheckoutTotals(cartTotal: number, shippingFee: number, coupons: AppliedCoupons) {
  const productDiscount = Math.min(cartTotal, Math.max(0, coupons.PRODUCT?.discountAmount ?? 0));
  const shippingDiscount = Math.min(shippingFee, Math.max(0, coupons.SHIPPING?.discountAmount ?? 0));
  const payableShippingFee = Math.max(0, shippingFee - shippingDiscount);
  const finalTotal = Math.max(0, cartTotal - productDiscount + payableShippingFee);

  return {
    productDiscount,
    shippingDiscount,
    totalDiscount: productDiscount + shippingDiscount,
    payableShippingFee,
    finalTotal,
  };
}

export function saveCheckoutCouponTransfer(coupons: AppliedCoupons, cartKey: string) {
  if (typeof window === 'undefined') return;
  const values = listAppliedCoupons(coupons);
  if (values.length === 0) {
    sessionStorage.removeItem(CHECKOUT_COUPONS_TRANSFER_KEY);
    return;
  }
  sessionStorage.setItem(CHECKOUT_COUPONS_TRANSFER_KEY, JSON.stringify({
    cartKey,
    coupons: values,
  }));
}

export function consumeCheckoutCouponTransfer(cartKey: string): AppliedCoupons {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(CHECKOUT_COUPONS_TRANSFER_KEY);
    sessionStorage.removeItem(CHECKOUT_COUPONS_TRANSFER_KEY);
    sessionStorage.removeItem(CHECKOUT_COUPONS_STORAGE_KEY);
    if (!raw) return {};
    const payload = JSON.parse(raw) as { cartKey?: string; coupons?: Coupon[] };
    if (payload.cartKey !== cartKey || !Array.isArray(payload.coupons)) return {};
    return payload.coupons.reduce<AppliedCoupons>((acc, coupon) => {
      acc[getCouponKind(coupon)] = coupon;
      return acc;
    }, {});
  } catch {
    return {};
  }
}
