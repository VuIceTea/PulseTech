import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";

const paymentMethods = [
  { name: "Visa", src: "/icons/visa.svg" },
  { name: "Mastercard", src: "/icons/mastercard.svg" },
  { name: "VNPay", src: "/icons/v-vnpay.svg" },
  { name: "COD", label: "COD" }, // không có logo thì giữ chữ
  { name: "MoMo", src: "/icons/momo.svg" },
  { name: "JCB", src: "/icons/jcb.svg" },
  { name: "ShopeePay", src: "/icons/shopeepay.svg" },
  { name: "Apple Pay", src: "/icons/applepay.svg" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-gray-400 text-sm border-t border-brand-dark mt-auto">
      {/* Top Banner section */}
      <div className="border-b border-brand-dark/80 bg-brand-dark/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  Sản phẩm chính hãng
                </h4>
                <p className="text-xs text-gray-500">
                  Bảo hành 12 tháng chính hãng quốc tế
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  Hotline hỗ trợ miễn phí
                </h4>
                <p className="text-xs text-gray-500">
                  Gọi 1800.2097 để được tư vấn (7:30 - 22:00)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  Giao hàng siêu tốc
                </h4>
                <p className="text-xs text-gray-500">
                  Miễn phí giao hàng toàn quốc từ 500k
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="font-display font-bold text-white text-base mb-4 tracking-wider uppercase">
              TỔNG ĐÀI HỖ TRỢ
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between">
                <span>Gọi mua hàng:</span>
                <a
                  href="tel:18002097"
                  className="text-primary font-bold hover:underline"
                >
                  1800.2097
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Khiếu nại:</span>
                <a
                  href="tel:18002098"
                  className="text-primary font-bold hover:underline"
                >
                  1800.2098
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Bảo hành:</span>
                <a
                  href="tel:18002099"
                  className="text-primary font-bold hover:underline"
                >
                  1800.2099
                </a>
              </li>
              <li className="pt-2 text-gray-500">
                Giờ phục vụ: 7:30 - 22:00 (Hàng ngày)
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-display font-bold text-white text-base mb-4 tracking-wider uppercase">
              CHÍNH SÁCH MUA HÀNG
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3" /> Quy định bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3" /> Giao hàng & thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3" /> Đổi trả sản phẩm lỗi
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3" /> Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-display font-bold text-white text-base mb-4 tracking-wider uppercase">
              PHƯƠNG THỨC THANH TOÁN
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="bg-white border border-brand-dark rounded-xl h-10 flex items-center justify-center p-2"
                >
                  {method.src ? (
                    <Image
                      src={method.src}
                      alt={method.name}
                      width={50}
                      height={22}
                      className="max-h-6 w-auto object-contain"
                    />
                  ) : (
                    <span className="font-bold text-xs text-gray-700">
                      {method.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500 block">
              Thanh toán an toàn, bảo mật thông tin 100%.
            </span>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-display font-bold text-white text-base mb-4 tracking-wider uppercase">
              KẾT NỐI VỚI PULSETECH
            </h3>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="#"
                className="h-10 w-10 bg-brand-dark hover:bg-[#4267b2] hover:text-white rounded-xl flex items-center justify-center transition"
                title="Facebook"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="#"
                className="h-10 w-10 bg-brand-dark hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition"
                title="YouTube"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="text-xs text-gray-500 border-t border-brand-dark pt-4">
              <span className="block font-bold text-gray-400">
                © 2026 PulseTech
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
