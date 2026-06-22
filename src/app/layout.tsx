import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/context/Providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

// Khởi tạo Geist font, gán vào biến --font-geist-sans
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "PulseTech - Điện thoại di động, máy tính bảng chính hãng giá tốt",
  description:
    "Hệ thống bán lẻ điện thoại di động, máy tính bảng, phụ kiện chính hãng giá rẻ, trả góp 0%, giao hàng nhanh toàn quốc.",
  keywords:
    "điện thoại, máy tính bảng, iphone, samsung, xiaomi, phụ kiện, CellphoneS, Thế giới di động",
  openGraph: {
    title: "PulseTech - Điện thoại di động, máy tính bảng chính hãng",
    description:
      "Hệ thống bán lẻ công nghệ hàng đầu Việt Nam. Trải nghiệm mua sắm premium, tối giản và chuyên nghiệp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("h-full scroll-smooth", geist.variable)}>
      <body className="min-h-full flex flex-col bg-brand-light text-brand-black selection:bg-primary selection:text-white font-sans">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
