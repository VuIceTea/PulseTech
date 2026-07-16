'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, Smartphone, Tablet, Headphones, Watch, Laptop, Volume2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  promoText: string;
  image: string;
  bgColor: string;
  link: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'IPHONE 15 PRO MAX',
    subtitle: 'Titan cực đỉnh - Hiệu năng vượt trội',
    promoText: 'Trợ giá lên đời đến 2 triệu • Trả góp 0%',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    bgColor: 'from-zinc-900 to-zinc-800',
    link: '/products/iphone-15-pro-max'
  },
  {
    id: 2,
    title: 'GALAXY S24 ULTRA',
    subtitle: 'Quyền năng Galaxy AI trong tay bạn',
    promoText: 'Giảm ngay 7 triệu • Tặng củ sạc nhanh 45W',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    bgColor: 'from-blue-950 to-indigo-950',
    link: '/products/samsung-galaxy-s24-ultra'
  },
  {
    id: 3,
    title: 'IPAD PRO M4 (2024)',
    subtitle: 'Đột phá siêu mỏng • Tandem OLED đỉnh cao',
    promoText: 'Ưu đãi học sinh sinh viên giảm thêm 500k',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    bgColor: 'from-slate-900 to-slate-800',
    link: '/products/ipad-pro-m4'
  }
];

interface SubCategoryLink {
  name: string;
  link: string;
}

interface MegaMenuColumn {
  title: string;
  links: SubCategoryLink[];
}

interface SidebarCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  link: string;
  megaMenu: MegaMenuColumn[];
}

export const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
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

  const SIDEBAR_CATEGORIES: SidebarCategory[] = [
    {
      id: 1,
      name: 'Điện thoại di động',
      icon: <Smartphone className="h-4 w-4" />,
      link: '/products?category=phone',
      megaMenu: [
        {
          title: 'Hãng sản xuất',
          links: [
            { name: 'iPhone (Apple)', link: '/products?brand=Apple' },
            { name: 'Samsung Galaxy', link: '/products?brand=Samsung' },
            { name: 'Xiaomi Redmi', link: '/products?brand=Xiaomi' },
            { name: 'Oppo Reno', link: '/products?brand=Oppo' },
            { name: 'Realme Series', link: '/products' },
            { name: 'Vivo Series', link: '/products' }
          ]
        },
        {
          title: 'Phân khúc giá',
          links: [
            { name: 'Dưới 5 triệu', link: '/products?category=phone' },
            { name: 'Từ 5 đến 10 triệu', link: '/products?category=phone' },
            { name: 'Từ 10 đến 20 triệu', link: '/products?category=phone' },
            { name: 'Trên 20 triệu', link: '/products?category=phone' }
          ]
        },
        {
          title: 'Dòng máy HOT nhất',
          links: [
            { name: 'iPhone 15 Pro Max', link: '/products/iphone-15-pro-max' },
            { name: 'Galaxy S24 Ultra', link: '/products/samsung-galaxy-s24-ultra' },
            { name: 'Xiaomi 14 Ultra', link: '/products/xiaomi-14-ultra' },
            { name: 'Điện thoại gập AI', link: '/products?brand=Samsung' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Máy tính bảng (Tablet)',
      icon: <Tablet className="h-4 w-4" />,
      link: '/products?category=tablet',
      megaMenu: [
        {
          title: 'Hãng máy tính bảng',
          links: [
            { name: 'Apple iPad', link: '/products?category=tablet&brand=Apple' },
            { name: 'Samsung Galaxy Tab', link: '/products?category=tablet&brand=Samsung' },
            { name: 'Xiaomi Pad', link: '/products?category=tablet' }
          ]
        },
        {
          title: 'Sản phẩm HOT',
          links: [
            { name: 'iPad Pro M4', link: '/products/ipad-pro-m4' },
            { name: 'Galaxy Tab S9 FE', link: '/products/samsung-galaxy-tab-s9-fe' },
            { name: 'iPad Air M2', link: '/products?category=tablet' }
          ]
        },
        {
          title: 'Phụ kiện đi kèm',
          links: [
            { name: 'Apple Pencil Pro', link: '/products' },
            { name: 'Bao da bàn phím', link: '/products' },
            { name: 'Kính cường lực', link: '/products' }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Phụ kiện công nghệ',
      icon: <Headphones className="h-4 w-4" />,
      link: '/products?category=accessory',
      megaMenu: [
        {
          title: 'Cáp sạc & Thiết bị sạc',
          links: [
            { name: 'Sạc nhanh Anker', link: '/products?category=accessory' },
            { name: 'Cáp sạc Type-C', link: '/products?category=accessory' },
            { name: 'Sạc dự phòng 20000mAh', link: '/products?category=accessory' }
          ]
        },
        {
          title: 'Bảo vệ máy',
          links: [
            { name: 'Ốp lưng UAG cao cấp', link: '/products' },
            { name: 'Cường lực MIPOW', link: '/products' },
            { name: 'Dán camera chống xước', link: '/products' }
          ]
        },
        {
          title: 'Thiết bị khác',
          links: [
            { name: 'Thẻ nhớ tốc độ cao', link: '/products' },
            { name: 'Đế sạc không dây', link: '/products' },
            { name: 'Gậy chụp ảnh tripod', link: '/products' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Smartwatch (Đồng hồ)',
      icon: <Watch className="h-4 w-4" />,
      link: '/products',
      megaMenu: [
        {
          title: 'Thương hiệu đồng hồ',
          links: [
            { name: 'Apple Watch', link: '/products' },
            { name: 'Samsung Galaxy Watch', link: '/products' },
            { name: 'Đồng hồ Garmin', link: '/products' },
            { name: 'Đồng hồ Xiaomi', link: '/products' }
          ]
        },
        {
          title: 'Dòng sản phẩm bán chạy',
          links: [
            { name: 'Apple Watch Ultra 2', link: '/products' },
            { name: 'Galaxy Watch 6 Classic', link: '/products' },
            { name: 'Garmin Venu 3', link: '/products' }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Laptop & Màn hình',
      icon: <Laptop className="h-4 w-4" />,
      link: '/products',
      megaMenu: [
        {
          title: 'Thương hiệu Laptop',
          links: [
            { name: 'MacBook (Apple)', link: '/products' },
            { name: 'ASUS ROG (Gaming)', link: '/products' },
            { name: 'Dell XPS (Văn phòng)', link: '/products' },
            { name: 'Lenovo ThinkPad', link: '/products' }
          ]
        },
        {
          title: 'Màn hình máy tính',
          links: [
            { name: 'Màn hình ASUS ProArt', link: '/products' },
            { name: 'Màn hình LG UltraFine', link: '/products' },
            { name: 'Màn hình cong Samsung', link: '/products' }
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'Thiết bị âm thanh',
      icon: <Volume2 className="h-4 w-4" />,
      link: '/products?category=accessory',
      megaMenu: [
        {
          title: 'Tai nghe Bluetooth',
          links: [
            { name: 'AirPods Pro 2', link: '/products/tai-nghe-apple-airpods-pro-2' },
            { name: 'Sony WF-1000XM5', link: '/products?category=accessory' },
            { name: 'Tai nghe chụp tai Sony WH', link: '/products?category=accessory' }
          ]
        },
        {
          title: 'Loa không dây di động',
          links: [
            { name: 'Loa Marshall Emberton', link: '/products' },
            { name: 'Loa JBL Charge 5', link: '/products' },
            { name: 'Loa Harman Kardon', link: '/products' }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'Thu cũ đổi mới',
      icon: <RefreshCw className="h-4 w-4" />,
      link: '/trade-in',
      megaMenu: [
        {
          title: 'Quy trình thu cũ',
          links: [
            { name: 'Định giá online 3 phút', link: '/products' },
            { name: 'Trợ giá lên đời máy mới', link: '/products' },
            { name: 'Bảo mật dữ liệu cũ', link: '/products' }
          ]
        },
        {
          title: 'Mức trợ giá HOT',
          links: [
            { name: 'Trợ giá iPhone đến 2 triệu', link: '/products' },
            { name: 'Trợ giá Samsung Galaxy', link: '/products' }
          ]
        }
      ]
    }
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
      <div
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-4"
        onMouseLeave={() => setHoveredCategory(null)}
      >

        {/* LEFT: Left Sidebar (3 Cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-gray-100 rounded-3xl p-3.5 shadow-sm h-[380px] justify-between relative z-20">
          <div className="flex flex-col gap-1 w-full">
            {SIDEBAR_CATEGORIES.map((cat) => (
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
              className={`absolute inset-0 bg-linear-to-r ${SLIDES[current].bgColor} flex flex-col sm:flex-row justify-between p-6 sm:p-10 text-white h-full`}
            >
              {/* Content left */}
              <div className="flex flex-col justify-center space-y-2 sm:space-y-4 max-w-[280px] sm:max-w-md z-10">
                <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold tracking-wider px-3 py-1 rounded-full w-fit uppercase flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-spin" /> Hot Deal Tuần Này
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-3xl leading-tight">
                  {SLIDES[current].title}
                </h2>
                <p className="text-gray-300 text-[10px] sm:text-sm font-medium">
                  {SLIDES[current].subtitle}
                </p>
                <div className="text-[10px] sm:text-xs text-yellow-400 font-semibold bg-white/5 border border-white/10 px-3 py-2 rounded-xl w-fit">
                  {SLIDES[current].promoText}
                </div>
                <Link
                  href={SLIDES[current].link}
                  className="bg-primary hover:bg-primary-hover text-white text-[10px] sm:text-xs font-bold px-5 py-2.5 rounded-2xl w-fit transition shadow-md hover:scale-105 active:scale-95 animate-pulse"
                >
                  Mua Ngay
                </Link>
              </div>

              {/* Image right */}
              <div className="hidden sm:flex items-center justify-center relative w-1/2 h-full z-10">
                <img
                  src={SLIDES[current].image}
                  alt={SLIDES[current].title}
                  className="object-cover w-full h-4/5 rounded-2xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Visual background glows */}
              <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
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
            {SLIDES.map((_, index) => (
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
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-brand-black border border-brand-dark flex items-center justify-between p-6 text-white group shadow-md cursor-pointer">
            <div className="flex flex-col justify-center space-y-1.5 z-10">
              <span className="text-yellow-400 text-[10px] font-extrabold tracking-widest uppercase">Độc Quyền Leica</span>
              <h3 className="font-display font-bold text-sm leading-tight">Xiaomi 14 Ultra</h3>
              <p className="text-gray-400 text-xs font-semibold">28.990.000₫</p>
              <Link href="/products/xiaomi-14-ultra" className="text-primary hover:text-white font-bold text-xs flex items-center gap-1 pt-1 transition">
                Săn ngay <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop"
              alt="Xiaomi 14 Ultra"
              className="w-[90px] h-[90px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-md"
            />
          </div>

          {/* Banner 2 */}
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-white border border-gray-100 flex items-center justify-between p-6 text-brand-black group shadow-md cursor-pointer">
            <div className="flex flex-col justify-center space-y-1.5 z-10">
              <span className="text-primary text-[10px] font-extrabold tracking-widest uppercase">Ưu Đãi Phụ Kiện</span>
              <h3 className="font-display font-bold text-sm leading-tight">Âm Thanh Cực Chất</h3>
              <p className="text-gray-500 text-xs font-semibold">AirPods Pro 2 giảm 6%</p>
              <Link href="/products/tai-nghe-apple-airpods-pro-2" className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1 pt-1 transition">
                Mua ngay <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=400&auto=format&fit=crop"
              alt="AirPods Pro 2"
              className="w-[90px] h-[90px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-md"
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
              {SIDEBAR_CATEGORIES.find(c => c.id === hoveredCategory)?.megaMenu.map((column, colIdx) => (
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
