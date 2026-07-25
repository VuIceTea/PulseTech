'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực địa chỉ email...');
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Liên kết xác thực thiếu token.');
      return;
    }
    api.verifyEmail(token)
      .then((response) => { setStatus('success'); setMessage(response.message); })
      .catch(() => { setStatus('error'); setMessage('Liên kết xác thực không hợp lệ, đã được sử dụng hoặc đã hết hiệu lực.'); });
  }, [token]);

  useEffect(() => {
    if (status !== 'success') return;
    const redirect = window.setTimeout(() => router.replace('/login'), 3000);
    const countdown = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => { window.clearTimeout(redirect); window.clearInterval(countdown); };
  }, [router, status]);

  const Icon = status === 'loading' ? LoaderCircle : status === 'success' ? CheckCircle2 : XCircle;
  const color = status === 'success' ? 'bg-green-50 text-green-600' : status === 'error' ? 'bg-red-50 text-red-600' : 'bg-red-50 text-primary';

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8f9fa] px-4 py-20">
      <section className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${color}`}><Icon size={40} className={status === 'loading' ? 'animate-spin' : ''} /></div>
        <h1 className="text-2xl font-extrabold text-brand-black">{status === 'success' ? 'Xác thực thành công' : status === 'error' ? 'Liên kết hết hiệu lực' : 'Đang xác thực'}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>
        {status === 'success' && <p className="mt-3 text-xs font-semibold text-gray-500">Chuyển đến trang đăng nhập sau {seconds} giây...</p>}
        {status === 'error' && <Link href="/register" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase text-white">Đăng ký lại</Link>}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="flex flex-1 items-center justify-center py-20"><LoaderCircle className="animate-spin text-primary" /></main>}><VerifyEmailContent /></Suspense>;
}