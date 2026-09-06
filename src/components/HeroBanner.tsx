'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles, Smartphone, Tablet, Headphones, Watch, Laptop, Volume2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { api, Banner } from '@/lib/api';

interface SubCategoryLink {
  name: string;
  link: string;
}

interface MegaMenuColumn {
  title: string;
  links: SubCategoryLink[];
}

interface SidebarCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  link: string;
  megaMenu: MegaMenuColumn[];
}

const IconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="h-4 w-4" />,
  Tablet: <Tablet className="h-4 w-4" />,
  Headphones: <Headphones className="h-4 w-4" />,
  Watch: <Watch className="h-4 w-4" />,
  Laptop: <Laptop className="h-4 w-4" />,
  Volume2: <Volume2 className="h-4 w-4" />,
  RefreshCw: <RefreshCw className="h-4 w-4" />
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "ban-1",
    imageUrl: "/hot-sale/iphone-15-pro-max.png",
    title: "IPHONE 15 PRO MAX",
    subtitle: "Titan cực đỉnh - Hiệu năng vượt trội",
    promoText: "Trợ giá lên đời đến 2 triệu • Trả góp 0%",
    bgColor: "from-zinc-900 to-zinc-800",
    link: "/products/iphone-15-pro-max",
    position: "main",
    order: 1
  },
  {
    id: "ban-2",
    imageUrl: "/hot-sale/samsung-galaxy-s24-ultra.png",
    title: "GALAXY S24 ULTRA",
    subtitle: "Quyền năng Galaxy AI trong tay bạn",
    promoText: "Giảm ngay 7 triệu • Tặng củ sạc nhanh 45W",
    bgColor: "from-blue-950 to-indigo-950",
    link: "/products/samsung-galaxy-s24-ultra",
    position: "main",
    order: 2
  },
  {
    id: "ban-3",
    imageUrl: "/tablet.png",
    title: "IPAD PRO M4 (2024)",
    subtitle: "Đột phá siêu mỏng • Tandem OLED đỉnh cao",
    promoText: "Ưu đãi học sinh sinh viên giảm thêm 500k",
    bgColor: "from-slate-900 to-slate-800",
    link: "/products/ipad-pro-m4",
    position: "main",
    order: 3
  }
];

export const HeroBanner: React.FC = () => {
  const router = useRouter();
  const { products } = useProducts();
  const [slides, setSlides] = useState<Banner[]>(DEFAULT_BANNERS);
  const [sidebarCategories, setSidebarCategories] = useState<SidebarCategory[]>([]);

  useEffect(() => {
    api.getBanners().then(data => {
      if (data && data.length > 0) {
        const mainBanners = data
          .filter(b => b.position === 'main')
          .sort((a, b) => a.order - b.order)
          .map(b => {
            if (b.imageUrl && b.imageUrl.includes('unsplash')) {
              if (b.title.toUpperCase().includes('IPHONE')) return { ...b, imageUrl: '/hot-sale/iphone-15-pro-max.png' };
              if (b.title.toUpperCase().includes('GALAXY')) return { ...b, imageUrl: '/hot-sale/samsung-galaxy-s24-ultra.png' };
              if (b.title.toUpperCase().includes('IPAD') || b.title.toUpperCase().includes('TABLET')) return { ...b, imageUrl: '/tablet.png' };
            }
            return b;
          });
        if (mainBanners.length > 0) {
          setSlides(mainBanners);
        }
      }
    }).catch(() => {});
    api.getMegaMenus().then(data => {
      if (data && data.length > 0) {
        setSidebarCategories(data.map(m => ({
          id: m.id,
          name: m.name,
          icon: IconMap[m.icon] || <Sparkles className="h-4 w-4" />,
          link: m.link,
          megaMenu: m.sections.map(s => ({
            title: s.title,
            links: s.links
          }))
        })));
      }
    }).catch(() => {});
  }, []);
  
  const xiaomi = products.find(p => p.id === 'xiaomi-14-ultra');
  const xiaomiSalePrice = xiaomi ? xiaomi.basePrice : 28990000;
  const xiaomiOriginalPrice = xiaomi ? xiaomi.originalPrice : 32990000;
  
  const airpods = products.find(p => p.id === 'tai-nghe-apple-airpods-pro-2');
  const airpodsDiscount = airpods?.discount || 6;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length > 0) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, slides.length]);

  const handleNext = () => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  };



  return (
    <section className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-4"
        onMouseLeave={() => setHoveredCategory(null)}
      >

        {/* LEFT: Left Sidebar (3 Cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-gray-100 rounded-3xl p-3.5 shadow-sm h-[380px] justify-between relative z-20">
          <div className="flex flex-col gap-1 w-full">
            {sidebarCategories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.link}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition w-full ${hoveredCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`${hoveredCategory === cat.id ? 'text-white' : 'text-gray-400'}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-80" />
              </Link>
            ))}
          </div>
        </div>

        {/* CENTER: Main Slider (6 Cols) */}
        <div className="lg:col-span-6 relative h-[260px] sm:h-[380px] rounded-3xl overflow-hidden shadow-lg bg-zinc-900 group z-10">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={() => slides.length > 0 && router.push(slides[current].link)}
              className={`absolute inset-0 bg-linear-to-r cursor-pointer ${slides.length > 0 && slides[current].bgColor ? slides[current].bgColor : 'from-zinc-900 to-zinc-800'} flex flex-col sm:flex-row justify-between p-6 sm:p-10 text-white h-full`}
            >
              {slides.length > 0 && (
                <>
                  {/* Content left */}
                  <div className="flex flex-col justify-center space-y-2 sm:space-y-4 w-[65%] sm:max-w-md z-10 relative">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold tracking-wider px-3 py-1 rounded-full w-fit uppercase flex items-center gap-1">
                      <img src="https://img.icons8.com/fluency/48/fire-element.png" alt="Hot Deal" className="h-4 w-4 object-contain" /> Hot Deal Tuần Này
                    </span>
                    <h2 className="font-display font-extrabold text-lg xs:text-xl sm:text-3xl leading-tight drop-shadow-md">
                      {slides[current].title}
                    </h2>
                    {slides[current].subtitle && (
                      <p className="text-gray-300 text-[10px] sm:text-sm font-medium drop-shadow-md line-clamp-2">
                        {slides[current].subtitle}
                      </p>
                    )}
                    {slides[current].promoText && (
                      <div className="text-[9px] sm:text-xs text-yellow-400 font-semibold bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl w-fit backdrop-blur-sm">
                        {slides[current].promoText}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(slides[current].link);
                      }}
                      className="bg-primary hover:bg-primary-hover text-white text-[10px] sm:text-xs font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl w-fit transition shadow-md mt-1"
                    >
                      Mua Ngay
                    </button>
                  </div>

                  {/* Image right */}
                  <div className="absolute right-[-20px] bottom-0 sm:relative sm:right-0 flex items-center justify-center w-1/2 h-[90%] sm:h-full z-0 sm:z-10 opacity-60 sm:opacity-100 pointer-events-none sm:pointer-events-auto">
                    {slides[current].imageUrl && (
                      <img
                        src={slides[current].imageUrl}
                        alt={slides[current].title}
                        className="object-contain w-full h-[95%] drop-shadow-2xl hover:scale-105 transition-transform duration-500 origin-bottom-right sm:origin-center"
                      />
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/60 p-2.5 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 z-20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/60 p-2.5 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 z-20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-6 flex gap-1.5 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === current ? 'w-6 bg-primary' : 'w-2 bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Side Banners (3 Cols) */}
        <div className="hidden lg:flex flex-col gap-4 lg:col-span-3 z-10">
          {/* Banner 1 */}
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-brand-black flex items-center justify-between p-6 text-white group shadow-md cursor-pointer">
            <div className="flex flex-col justify-center space-y-1.5 z-10">
              <span className="text-yellow-400 text-[10px] font-extrabold tracking-widest uppercase">Độc Quyền Leica</span>
              <h3 className="font-display font-bold text-sm leading-tight">Xiaomi 14 Ultra</h3>
              <div className="flex items-center gap-1.5">
                <p className="text-white text-xs font-bold">{xiaomiSalePrice.toLocaleString("vi-VN")}₫</p>
                {(!xiaomi || xiaomi.discount > 0) && (
                  <p className="text-gray-500 text-[10px] line-through">{xiaomiOriginalPrice.toLocaleString("vi-VN")}₫</p>
                )}
              </div>
              <Link href="/products/xiaomi-14-ultra" className="text-primary hover:text-white font-bold text-xs flex items-center gap-1 pt-1 transition">
                Săn ngay <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <img
              src="/hot-sale/xiaomi-14-ultra.png"
              alt="Xiaomi 14 Ultra"
              className="w-[90px] h-[90px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>

          {/* Banner 2 */}
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-white flex items-center justify-between p-6 text-brand-black group shadow-md cursor-pointer">
            <div className="flex flex-col justify-center space-y-1.5 z-10">
              <span className="text-primary text-[10px] font-extrabold tracking-widest uppercase">Ưu Đãi Phụ Kiện</span>
              <h3 className="font-display font-bold text-sm leading-tight">Âm Thanh Cực Chất</h3>
              <p className="text-gray-500 text-xs font-semibold">AirPods Pro 2 giảm {airpodsDiscount}%</p>
              <Link href="/products/tai-nghe-apple-airpods-pro-2" className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1 pt-1 transition">
                Mua ngay <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <img
              src="/accessories/airpod-pro-gen2.png"
              alt="AirPods Pro 2"
              className="w-[90px] h-[90px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>
        </div>

        {/* MEGA MENU: Popover Panel */}
        <AnimatePresence>
          {hoveredCategory !== null && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
              className="absolute top-0 left-[25%] right-0 bottom-0 bg-white rounded-3xl shadow-2xl z-30 p-8 flex gap-8 overflow-y-auto"
            >
              {/* Load columns dynamically based on hover state */}
              {sidebarCategories.find(c => c.id === hoveredCategory)?.megaMenu.map((column, colIdx) => (
                <div key={colIdx} className="flex-1 space-y-4 min-w-[150px]">
                  <h4 className="font-display font-extrabold text-sm text-brand-black border-b border-gray-100 pb-2 uppercase tracking-wider">
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.link}
                          onClick={() => setHoveredCategory(null)}
                          className="text-xs text-gray-500 hover:text-primary font-semibold transition block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Mega menu promotional visual block */}
              <div className="hidden xl:flex w-[220px] bg-red-50 rounded-2xl p-4 flex-col justify-between shrink-0 border border-red-100/50">
                <div className="space-y-1">
                  <span className="bg-primary text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide w-fit block">
                    Độc Quyền
                  </span>
                  <h5 className="font-display font-extrabold text-xs text-brand-black pt-1">
                    Đổi Máy Mới Nhận Trợ Giá 2 Triệu
                  </h5>
                  <p className="text-[9px] text-gray-500 leading-normal">
                    Áp dụng cho mọi sản phẩm cũ tại PulseTech. Định giá máy cũ 5 phút.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setHoveredCategory(null)}
                  className="bg-brand-black hover:bg-primary text-white text-[10px] font-bold py-2 px-3 rounded-xl text-center transition"
                >
                  Đăng Ký Thu Cũ
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
