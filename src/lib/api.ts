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
};