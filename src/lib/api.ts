import type { Product } from '@/types/product';

const browserApiPrefix = '/backend-api';
const serverApiPrefix = `${process.env.API_URL ?? 'http://localhost:8080'}/api`;

export interface ApiUser { id: string; name: string; email: string; }
export interface RegisterResponse { email: string; message: string; }
export interface VerifyResponse { message: string; }
export interface OrderItemRequest { productId: string; color: string; storage: string; quantity: number; }
export interface OrderItem { id: string; productId: string; name: string; price: number; qty: number; image: string; color: string; storage: string; }
export interface Order {
  id: string; status: number; customerName: string; customerPhone: string; address: string;
  paymentMethod: string; createdAt: string; totalPrice: number; items: OrderItem[];
  paymentUrl?: string;
}
export interface CartItem {
  id: string; name: string; price: number; image: string; quantity: number; color: string; storage: string;
}
export interface Cart {
  id: string; items: CartItem[];
}

export interface Category { id: string; name: string; englishName: string; order: number; priority: number; }
export interface Brand { id: string; name: string; logoUrl: string; order: number; }
export interface Banner { id: string; imageUrl: string; title: string; subtitle: string; promoText: string; bgColor: string; link: string; position: string; order: number; }
export interface Filter { id: string; filterId: string; name: string; options: string[]; categories: string[]; }
export interface Navigation { id: string; title: string; href: string; icon: string; order: number; }
export interface MegaMenu { id: string; name: string; icon: string; link: string; sections: { title: string; links: { name: string; link: string; }[]; }[]; }
export interface FooterLink { id: string; title: string; links: { name: string; link: string; }[]; }
export interface Store { id: string; name: string; address: string; phone: string; mapUrl: string; openingHours: string; }
export interface Article { id: string; title: string; slug: string; summary: string; content: string; imageUrl: string; author: string; publishedAt: string; category: string; viewCount: number; }
export interface Policy { id: string; title: string; icon: string; contentHtml: string; orderIndex: number; }
export interface Wishlist { id: string; productIds: string[]; }
export interface UserAddress { id?: string; userId: string; fullName: string; phone: string; addressLine: string; ward: string; district: string; city: string; isDefault: boolean; }
export interface Coupon { code: string; discountAmount: number; discountType: string; finalAmount: number; }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const prefix = typeof window === 'undefined' ? serverApiPrefix : browserApiPrefix;
  const response = await fetch(`${prefix}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: init?.method && init.method !== 'GET' ? undefined : 'no-store',
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let body;
    try { body = text ? JSON.parse(text) : null; } catch (e) { body = null; }
    throw new Error(body?.detail || body?.message || `API trả về lỗi ${response.status}`);
  }
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export const api = {
  products: () => request<Product[]>('/products'),
  product: (id: string) => request<Product>(`/products/${encodeURIComponent(id)}`),
  login: (email: string, password: string) => request<ApiUser>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<RegisterResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  verifyEmail: (token: string) => request<VerifyResponse>(`/auth/verify?token=${encodeURIComponent(token)}`),
  createOrder: (payload: { customerName: string; customerEmail: string; customerPhone: string; address: string; paymentMethod: string; couponCode?: string; items: OrderItemRequest[] }) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  trackOrder: (orderId: string, phone: string) => request<Order>(`/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`),
  getOrderHistory: (email: string) => request<Order[]>(`/orders/history?email=${encodeURIComponent(email)}`),
  cancelOrder: (orderId: string) => request<void>(`/orders/cancel?orderId=${encodeURIComponent(orderId)}`, { method: 'POST' }),
  
  // Cart APIs
  getCart: (userId: string) => request<Cart>(`/orders/cart?userId=${encodeURIComponent(userId)}`),
  updateCartItem: (userId: string, item: CartItem) => request<Cart>(`/orders/cart/items?userId=${encodeURIComponent(userId)}`, { method: 'POST', body: JSON.stringify(item) }),
  removeCartItem: (userId: string, productId: string, color: string, storage: string) => request<Cart>(`/orders/cart/items/${encodeURIComponent(productId)}?userId=${encodeURIComponent(userId)}&color=${encodeURIComponent(color)}&storage=${encodeURIComponent(storage)}`, { method: 'DELETE' }),
  clearCart: (userId: string) => request<Cart>(`/orders/cart?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' }),
  mergeCarts: (guestId: string, userId: string) => request<Cart>('/orders/cart/merge', { method: 'POST', body: JSON.stringify({ guestId, userId }) }),

  // Content APIs
  getCategories: () => request<Category[]>('/content/categories'),
  getBrands: () => request<Brand[]>('/content/brands'),
  getBanners: () => request<Banner[]>('/content/banners'),
  getFilters: () => request<Filter[]>('/content/filters'),
  getNavigation: () => request<Navigation[]>('/content/navigation'),
  getMegaMenus: () => request<MegaMenu[]>('/content/mega-menus'),
  getFooterLinks: () => request<FooterLink[]>('/content/footer-links'),
  getStores: () => request<Store[]>('/content/stores'),
  getArticles: () => request<Article[]>('/content/articles'),
  getPolicies: () => request<Policy[]>('/content/policies'),
};

export const userApi = {
  getWishlist: (userId: string) => request<Wishlist>(`/users/wishlist?userId=${encodeURIComponent(userId)}`),
  saveWishlist: (wishlist: Wishlist) => request<Wishlist>('/users/wishlist', { method: 'POST', body: JSON.stringify(wishlist) }),
  getAddresses: (userId: string) => request<UserAddress[]>(`/users/addresses?userId=${encodeURIComponent(userId)}`),
  addAddress: (address: UserAddress) => request<UserAddress>('/users/addresses', { method: 'POST', body: JSON.stringify(address) })
};

export const orderApi = {
  validateCoupon: (payload: { code: string; orderAmount: number; productIds?: string[] }) => request<{ success: boolean; data: Coupon }>('/coupons/validate', { method: 'POST', body: JSON.stringify(payload) })
};