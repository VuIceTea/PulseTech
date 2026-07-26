'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, MailCheck, ShieldAlert, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AUTH_LIMITS, validateEmail, validateName, validatePassword } from '@/lib/auth-validation';

type RegisterErrors = { name?: string; email?: string; password?: string; confirmPassword?: string; form?: string };

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [registeredEmail, setRegisteredEmail] = useState('');

  useEffect(() => { if (user) router.replace('/'); }, [router, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: RegisterErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: !confirmPassword ? 'Vui lòng xác nhận mật khẩu.' : password !== confirmPassword ? 'Xác nhận mật khẩu không trùng khớp.' : undefined,
    };
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ');
    const normalizedEmail = email.trim().toLowerCase();
    setErrors({});
    setLoading(true);
    const result = await register(normalizedName, normalizedEmail, password);
    setLoading(false);
    if (!result.success) {
      let errorMsg = result.message ?? 'Đăng ký thất bại.';
      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes('already exists') || lowerMsg.includes('in use') || lowerMsg.includes('duplicate') || lowerMsg.includes('409') || lowerMsg.includes('400')) {
        errorMsg = 'Địa chỉ email này đã được sử dụng. Vui lòng chọn email khác.';
      } else {
        errorMsg = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      }
      return toast.error(errorMsg);
    }
    setRegisteredEmail(normalizedEmail);
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8f9fa] px-4 py-16">
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl">
        {registeredEmail ? (
          <div className="py-6 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"><MailCheck size={32} /></div><h1 className="text-2xl font-extrabold text-brand-black">Kiểm tra email của bạn</h1><p className="mt-3 text-sm leading-6 text-gray-600">Liên kết xác thực đã được gửi tới <strong>{registeredEmail}</strong>. Hãy mở email và bấm liên kết để kích hoạt tài khoản.</p><Link href="/login" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase text-white hover:bg-primary-dark transition-colors">Đến trang đăng nhập</Link></div>
        ) : (
          <>
            <div className="mb-7 text-center">
              <Link href="/" className="inline-block rounded-xl bg-[#d70018f2] px-4 py-2 font-display text-xl font-extrabold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105">
                Pulse<span className="text-brand-black">Tech</span>
              </Link>
              <h1 className="mt-5 text-2xl font-extrabold text-brand-black">Đăng ký thành viên</h1>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field name="reg_name_nofill" label="Họ và tên" icon={<User size={16} />} type="text" autoComplete="new-password" value={name} maxLength={AUTH_LIMITS.nameMax} error={errors.name} onChange={(value) => { setName(value); setErrors((current) => ({ ...current, name: undefined, form: undefined })); }} placeholder="Nguyễn Văn A" />
              <Field name="reg_email_nofill" label="Địa chỉ email" icon={<Mail size={16} />} type="email" autoComplete="new-password" value={email} maxLength={AUTH_LIMITS.emailMax} error={errors.email} onChange={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined, form: undefined })); }} placeholder="example@gmail.com" />
              <Field name="reg_pwd_nofill" label="Mật khẩu" icon={<Lock size={16} />} type="password" autoComplete="new-password" value={password} maxLength={AUTH_LIMITS.passwordMax} error={errors.password} onChange={(value) => { setPassword(value); setErrors((current) => ({ ...current, password: undefined, confirmPassword: undefined, form: undefined })); }} placeholder="8–72 ký tự, gồm hoa, thường, số, ký tự đặc biệt" />
              <Field name="reg_pwd_confirm_nofill" label="Xác nhận mật khẩu" icon={<Lock size={16} />} type="password" autoComplete="new-password" value={confirmPassword} maxLength={AUTH_LIMITS.passwordMax} error={errors.confirmPassword} onChange={(value) => { setConfirmPassword(value); setErrors((current) => ({ ...current, confirmPassword: undefined, form: undefined })); }} placeholder="Nhập lại mật khẩu" />
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 transition-colors"><UserPlus size={17} />{loading ? 'Đang đăng kí...' : 'Tạo tài khoản'}</button>
            </form>
            <p className="mt-6 text-center text-xs font-semibold text-gray-600">Đã có tài khoản? <Link href="/login" className="font-bold text-primary hover:underline">Đăng nhập ngay</Link></p>
          </>
        )}
      </motion.section>
    </main>
  );
}

function Field({ name, label, icon, type: initialType, autoComplete, value, maxLength, error, onChange, placeholder }: { name: string; label: string; icon: React.ReactNode; type: string; autoComplete: string; value: string; maxLength: number; error?: string; onChange: (value: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  const isPassword = initialType === 'password';
  return (
    <label className="block text-xs font-bold text-gray-700">{label}<span className="relative mt-1 block"><input required type={isPassword && show ? 'text' : initialType} name={name} autoComplete={autoComplete} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-10 text-xs text-brand-black outline-none transition-colors ${error ? 'border-primary' : 'border-gray-200 focus:border-primary focus:bg-white'}`} placeholder={placeholder} /><span className="absolute left-3.5 top-2.5 text-gray-400">{icon}</span>{isPassword && (<button type="button" tabIndex={-1} onClick={() => setShow(!show)} className="absolute right-3.5 top-2.5 text-gray-400 hover:text-brand-black">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>)}</span>{error && <span className="mt-1.5 block text-[11px] text-primary">{error}</span>}</label>
  );
}