export const AUTH_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 72,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\s.'-]+$/u;

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return 'Vui lòng nhập địa chỉ email.';
  if (email.length > AUTH_LIMITS.emailMax) return `Email không được vượt quá ${AUTH_LIMITS.emailMax} ký tự.`;
  if (!emailPattern.test(email)) return 'Địa chỉ email không đúng định dạng.';
}

export function validateName(value: string): string | undefined {
  const name = value.trim().replace(/\s+/g, ' ');
  if (!name) return 'Vui lòng nhập họ và tên.';
  if (name.length < AUTH_LIMITS.nameMin || name.length > AUTH_LIMITS.nameMax) return `Họ tên phải từ ${AUTH_LIMITS.nameMin} đến ${AUTH_LIMITS.nameMax} ký tự.`;
  if (!namePattern.test(name)) return 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu nháy hoặc dấu gạch ngang.';
}

export function validatePassword(value: string, requireStrength = true): string | undefined {
  if (!value) return 'Vui lòng nhập mật khẩu.';
  if (value.length < AUTH_LIMITS.passwordMin || value.length > AUTH_LIMITS.passwordMax) return `Mật khẩu phải từ ${AUTH_LIMITS.passwordMin} đến ${AUTH_LIMITS.passwordMax} ký tự.`;
  if (requireStrength && !/[a-z]/.test(value)) return 'Mật khẩu phải có ít nhất một chữ thường.';
  if (requireStrength && !/[A-Z]/.test(value)) return 'Mật khẩu phải có ít nhất một chữ hoa.';
  if (requireStrength && !/\d/.test(value)) return 'Mật khẩu phải có ít nhất một chữ số.';
  if (requireStrength && !/[^A-Za-z0-9]/.test(value)) return 'Mật khẩu phải có ít nhất một ký tự đặc biệt.';
}