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
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const prefix = typeof window === 'undefined' ? serverApiPrefix : browserApiPrefix;
  const response = await fetch(`${prefix}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: init?.method && init.method !== 'GET' ? undefined : 'no-store',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || body?.message || `API trả về lỗi ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  products: () => request<Product[]>('/products'),
  product: (id: string) => request<Product>(`/products/${encodeURIComponent(id)}`),
  login: (email: string, password: string) => request<ApiUser>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<RegisterResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  verifyEmail: (token: string) => request<VerifyResponse>(`/auth/verify?token=${encodeURIComponent(token)}`),
  createOrder: (payload: { customerName: string; customerPhone: string; address: string; paymentMethod: string; couponCode?: string; items: OrderItemRequest[] }) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  trackOrder: (orderId: string, phone: string) => request<Order>(`/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`),
};