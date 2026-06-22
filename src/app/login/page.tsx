'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ShieldAlert, Sparkles, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Đăng nhập thất bại. Email hoặc mật khẩu không đúng.');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#f8f9fa] font-semibold">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        {/* Glow styling */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

        {/* Heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <span className="font-display font-extrabold text-lg tracking-wider uppercase">
              Pulse<span className="text-brand-black">Tech</span>
            </span>
          </Link>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-brand-black">ĐĂNG NHẬP TÀI KHOẢN</h2>
          <p className="text-xs text-gray-500 mt-1.5 font-semibold">Mua sắm thiết bị di động với ưu đãi thành viên</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Địa chỉ Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-primary text-brand-black"
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-500">Mật khẩu</label>
              <a href="#" className="text-[10px] text-primary hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-primary text-brand-black"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-[10px] text-primary font-bold flex items-center gap-1.5 animate-shake">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" /> Đăng Nhập
              </>
            )}
          </button>
        </form>

        {/* Footnote */}
        <p className="text-xs text-gray-500 font-semibold text-center mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
