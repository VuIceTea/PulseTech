'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AUTH_LIMITS, validateEmail, validatePassword } from '@/lib/auth-validation';

type LoginErrors = { email?: string; password?: string; form?: string };

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => { if (user) router.replace('/'); }, [router, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: LoginErrors = {
      email: validateEmail(email),
      password: validatePassword(password, false),
    };
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      let errorMsg = result.message ?? 'Đăng nhập thất bại.';
      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes('bad credentials') || lowerMsg.includes('unauthorized') || lowerMsg.includes('not found') || lowerMsg.includes('incorrect') || lowerMsg.includes('wrong') || lowerMsg.includes('401')) {
        errorMsg = 'Email hoặc mật khẩu không chính xác.';
      } else if (lowerMsg.includes('disabled') || lowerMsg.includes('verify') || lowerMsg.includes('active')) {
        errorMsg = 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn.';
      } else {
        errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      }
      toast.error(errorMsg);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8f9fa] px-4 py-16">
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl">
        <div className="mb-7 text-center">
          <Link href="/" className="inline-block rounded-xl bg-[#d70018f2] px-4 py-2 font-display text-xl font-extrabold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105">
            Pulse<span className="text-brand-black">Tech</span>
          </Link>
          <h1 className="mt-5 text-2xl font-extrabold text-brand-black">Đăng nhập tài khoản</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <label className="block text-xs font-bold text-gray-700">Địa chỉ email<span className="relative mt-1 block"><input required type="email" autoComplete="email" maxLength={AUTH_LIMITS.emailMax} value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined, form: undefined })); }} aria-invalid={!!errors.email} className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-brand-black outline-none transition-colors ${errors.email ? 'border-primary' : 'border-gray-200 focus:border-primary focus:bg-white'}`} placeholder="example@gmail.com" /><Mail className="absolute left-3.5 top-2.5 text-gray-400" size={16} /></span>{errors.email && <span className="mt-1.5 block text-[11px] text-primary">{errors.email}</span>}</label>
          <label className="block text-xs font-bold text-gray-700">Mật khẩu<span className="relative mt-1 block"><input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" minLength={AUTH_LIMITS.passwordMin} maxLength={AUTH_LIMITS.passwordMax} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined, form: undefined })); }} aria-invalid={!!errors.password} className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-10 text-xs text-brand-black outline-none transition-colors ${errors.password ? 'border-primary' : 'border-gray-200 focus:border-primary focus:bg-white'}`} placeholder="Từ 8 đến 72 ký tự" /><Lock className="absolute left-3.5 top-2.5 text-gray-400" size={16} /><button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-2.5 text-gray-400 hover:text-brand-black">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>{errors.password && <span className="mt-1.5 block text-[11px] text-primary">{errors.password}</span>}</label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 transition-colors">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
        <p className="mt-6 text-center text-xs font-semibold text-gray-600">Chưa có tài khoản? <Link href="/register" className="font-bold text-primary hover:underline">Đăng ký ngay</Link></p>
      </motion.section>
    </main>
  );
}