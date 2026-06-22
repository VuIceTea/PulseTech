'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ColorVariant, StorageVariant } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Check, 
  Award,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  // State managers
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState<StorageVariant>(product.storages[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  // Update selected color image sync
  const handleColorSelect = (color: ColorVariant) => {
    setSelectedColor(color);
    // Find index of color image in gallery if it exists
    const imgIndex = product.images.findIndex(img => img === color.image);
    if (imgIndex !== -1) {
      setActiveImageIndex(imgIndex);
    }
  };

  // Pricing calculations
  const discountedBasePrice = Math.round(product.basePrice * (1 - product.discount / 100));
  const currentPrice = discountedBasePrice + selectedStorage.priceOffset;
  const originalPrice = product.originalPrice + selectedStorage.priceOffset;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Add handlers
  const handleAddToCart = (redirect = false) => {
    addToCart(product, selectedColor.name, selectedStorage.name, quantity);
    if (redirect) {
      router.push('/cart');
    }
  };

  return (
    <div className="bg-[#f8f9fa] pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-3 mb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs font-semibold text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-primary transition">Sản phẩm</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-400 capitalize hover:text-primary transition">
            {product.category === 'phone' ? 'Điện thoại' : product.category === 'tablet' ? 'Máy tính bảng' : 'Phụ kiện'}
          </span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-black truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Product Meta Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-3xl text-brand-black tracking-tight flex items-center gap-3">
              {product.name}
              {product.isFeatured && (
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider h-fit">
                  Nổi bật
                </span>
              )}
            </h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 fill-current ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-brand-black">{product.rating}</span>
              </div>
              <span>•</span>
              <span className="hover:text-primary cursor-pointer">{product.reviewsCount} Đánh giá</span>
              <span>•</span>
              <span>Hãng: <strong className="text-brand-black">{product.brand}</strong></span>
            </div>
          </div>

          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-2xl text-xs font-bold transition shadow-sm bg-white ${
              liked ? 'text-primary border-primary/30 bg-red-50' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current text-primary animate-pulse' : ''}`} /> 
            {liked ? 'Đã thích' : 'Yêu thích'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Galleries Carousel (6 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-center relative aspect-square overflow-hidden group">
              {/* Product Main Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={product.images[activeImageIndex] || product.image}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="object-contain max-h-[420px] w-full"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-white border overflow-hidden flex items-center justify-center p-1.5 shrink-0 transition ${
                      activeImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`thumbnail-${idx}`} className="object-contain w-full h-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust details box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm text-xs font-semibold text-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-primary rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-black">Bảo hành 12 tháng</h4>
                  <p className="text-[10px] text-gray-500">Chính hãng tại trung tâm bảo hành ủy quyền.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-primary rounded-xl">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-black">1 đổi 1 trong 30 ngày</h4>
                  <p className="text-[10px] text-gray-500">Nếu có lỗi phần cứng nhà sản xuất.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-primary rounded-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-black">Giao hàng miễn phí</h4>
                  <p className="text-[10px] text-gray-500">Thanh toán an toàn bảo mật, COD toàn quốc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Configurations & Add actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Base pricing Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              
              {/* Dynamic Prices */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-primary font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-gray-400 text-sm line-through font-bold">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              
              {product.discount > 0 && (
                <div className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl w-fit mb-4">
                  Tiết kiệm {formatPrice(originalPrice - currentPrice)} ({product.discount}%)
                </div>
              )}

              {/* Color Options */}
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 block mb-2">MÀU SẮC: {selectedColor.name}</span>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color)}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition border shadow-sm ${
                        selectedColor.name === color.name 
                          ? 'border-brand-black ring-2 ring-brand-black/15 scale-105' 
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <Check className="h-4 w-4 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Variants Options */}
              {product.storages.length > 1 && (
                <div className="mb-4 pt-2 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-500 block mb-2">PHIÊN BẢN BỘ NHỚ</span>
                  <div className="grid grid-cols-3 gap-2">
                    {product.storages.map((storage) => (
                      <button
                        key={storage.name}
                        onClick={() => setSelectedStorage(storage)}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold text-center transition flex flex-col gap-0.5 shadow-inner ${
                          selectedStorage.name === storage.name
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{storage.name}</span>
                        <span className="text-[9px] font-medium opacity-80">
                          {storage.priceOffset === 0 ? 'Giá gốc' : `+${(storage.priceOffset / 1000000).toFixed(1)}M`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Select */}
              <div className="mb-6 pt-2 border-t border-gray-50 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-500">SỐ LƯỢNG MUA</span>
                <div className="flex items-center border border-gray-250 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 font-bold text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-brand-black text-center min-w-[40px] bg-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2 font-bold text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buy Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition"
                >
                  Mua Ngay (Giao tận nơi hoặc nhận tại cửa hàng)
                </button>
                <button
                  onClick={() => handleAddToCart(false)}
                  className="w-full bg-brand-black hover:bg-gray-900 text-white py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4.5 w-4.5" /> Thêm Vào Giỏ Hàng
                </button>
              </div>

            </div>

            {/* Promotional Offer Box (CellphoneS style) */}
            <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-br-2xl uppercase tracking-wider flex items-center gap-1">
                <Award className="h-3.5 w-3.5 fill-current" /> Khuyến Mãi Hot
              </div>
              <ul className="space-y-3.5 text-xs text-gray-600 font-semibold mt-4">
                <li className="flex items-start gap-2.5">
                  <span className="bg-primary text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Giảm thêm 1% cho thành viên Smember (áp dụng trên giá khuyến mãi).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-primary text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Thu cũ đổi mới - Trợ giá lên đời máy đến 2.000.000đ.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-primary text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Mua kèm củ sạc nhanh Anker 30W giảm thêm 30% giá chỉ còn 250k.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-primary text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Nhập mã VNPAYPT - Giảm ngay 300.000đ khi thanh toán qua VNPay-QR.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: Description and Specs layout (Split screen 7 - 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
          
          {/* Description Block */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-black border-b border-gray-150 pb-3 uppercase tracking-wide">
              Đặc điểm nổi bật của sản phẩm
            </h3>
            <div className="prose text-gray-600 text-sm leading-relaxed space-y-4 font-semibold">
              <p>{product.description}</p>
              <p>Mỗi thiết bị do PulseTech cung cấp đều được kiểm định chất lượng nghiêm ngặt, đảm bảo nguyên seal chính hãng 100%, bảo hành chính thức toàn quốc. Thiết bị được trang bị các tiêu chuẩn kỹ thuật hàng đầu hiện nay về hiển thị màn hình, cấu hình vi xử lý tốc độ cao và dung lượng pin tối ưu đảm bảo hiệu suất sử dụng lâu bền.</p>
              <p>Sự kết hợp giữa chất liệu vỏ ngoài sang trọng và công nghệ camera hiện đại đem lại chất lượng hình ảnh nghệ thuật sống động giúp người dùng bắt trọn những khoảnh khắc quý giá trong đời sống hàng ngày một cách chân thực nhất.</p>
            </div>
          </div>

          {/* Specifications Table Block */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="font-display font-extrabold text-base text-brand-black border-b border-gray-150 pb-3 mb-4 uppercase tracking-wide">
              Thông số kỹ thuật chi tiết
            </h3>
            <div className="flex flex-col text-xs font-semibold">
              {[
                { name: 'Màn hình', value: product.specs.screen },
                { name: 'Hệ điều hành', value: product.specs.os },
                { name: 'Camera sau', value: product.specs.camera },
                { name: 'Camera trước', value: product.specs.frontCamera },
                { name: 'Vi xử lý (CPU)', value: product.specs.cpu },
                { name: 'Dung lượng RAM', value: product.specs.ram },
                { name: 'Bộ nhớ trong', value: selectedStorage.name },
                { name: 'Dung lượng Pin', value: product.specs.battery }
              ].map((spec, index) => (
                <div 
                  key={spec.name} 
                  className={`grid grid-cols-3 py-3 px-4 rounded-xl ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="text-gray-400 font-bold col-span-1">{spec.name}</span>
                  <span className="text-brand-black col-span-2">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Specs modal toggle */}
            <button 
              onClick={() => setShowFullSpecs(!showFullSpecs)}
              className="mt-5 text-center text-primary text-xs font-bold hover:underline transition uppercase tracking-wide flex items-center justify-center gap-1 py-1"
            >
              {showFullSpecs ? 'Thu gọn thông số' : 'Xem cấu hình đầy đủ'}
            </button>

            {showFullSpecs && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-500 space-y-2 leading-relaxed"
              >
                <p>• Hỗ trợ kết nối mạng: 5G siêu tốc, LTE, HSPA+, GSM.</p>
                <p>• Cổng kết nối sạc: Cổng Type-C (chuẩn USB 3.0 truyền dữ liệu nhanh).</p>
                <p>• Kết nối không dây: Wi-Fi 6E dual-band, Bluetooth 5.3, chip NFC hỗ trợ ví điện tử.</p>
                <p>• Trọng lượng máy: 221 gram (siêu nhẹ nhờ hợp kim chất lượng cấp vũ trụ).</p>
                <p>• Thiết kế kháng nước kháng bụi chuẩn IP68 chống chịu va đập bền vững.</p>
              </motion.div>
            )}
          </div>

        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm mt-12">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-black border-b border-gray-150 pb-3 mb-6 uppercase tracking-wide">
            Đánh giá khách hàng ({product.reviewsCount})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-gray-100 pb-8 mb-8">
            {/* Star Stats summary */}
            <div className="md:col-span-4 text-center md:border-r border-gray-150 md:pr-8">
              <span className="font-display font-extrabold text-5xl text-brand-black tracking-tight">{product.rating}</span>
              <span className="text-gray-400 text-lg font-bold">/5</span>
              <div className="flex text-yellow-400 justify-center my-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 fill-current ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 font-semibold">100% đánh giá từ khách hàng đã mua sản phẩm tại PulseTech</p>
            </div>

            {/* Distribution bars */}
            <div className="md:col-span-8 flex flex-col gap-2 font-semibold text-xs text-gray-500">
              {[
                { stars: 5, pct: '85%' },
                { stars: 4, pct: '10%' },
                { stars: 3, pct: '4%' },
                { stars: 2, pct: '1%' },
                { stars: 1, pct: '0%' }
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3">
                  <span className="w-12 text-right">{bar.stars} sao</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: bar.pct }} />
                  </div>
                  <span className="w-8 text-left">{bar.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0 font-semibold">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-brand-black">{rev.user}</h4>
                      <div className="flex text-yellow-400 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 fill-current ${
                              i < rev.rating ? 'text-yellow-400' : 'text-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100/50">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
