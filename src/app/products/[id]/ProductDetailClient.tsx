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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  if (isPageLoading) {
    return (
      <div className="bg-[#f8f9fa] pb-16 animate-pulse">
        {/* Breadcrumbs Skeleton */}
        <div className="bg-white border-b border-gray-100 py-3 mb-6">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex items-center gap-2">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <div className="h-3 bg-gray-200 rounded w-16" />
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-7 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Gallery Skeleton (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[350px] md:h-[400px] lg:h-[480px] w-full bg-gray-50 flex items-center justify-center relative overflow-hidden" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-white border border-gray-100 rounded-2xl shrink-0" />
                ))}
              </div>
            </div>

            {/* Right: Info Skeleton (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-150 rounded w-2/3" />
                <div className="space-y-2 mt-4">
                  <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                    <div className="w-12 h-12 rounded-xl bg-gray-200" />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded-xl w-24" />
                    <div className="h-10 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <div className="h-12 bg-gray-200 rounded-2xl flex-1" />
                  <div className="h-12 bg-gray-200 rounded-2xl flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-3 mb-6">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-xs font-semibold text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-primary transition">Sản phẩm</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/products?category=${product.category}`} className="text-gray-400 capitalize hover:text-primary transition">
            {product.category === 'phone' ? 'Điện thoại' : product.category === 'tablet' ? 'Máy tính bảng' : 'Phụ kiện'}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-black truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
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
          
          {/* LEFT: Galleries Carousel (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-center relative h-[350px] md:h-[400px] lg:h-[480px] overflow-hidden group">
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
                  className="object-contain h-full w-full max-w-[90%]"
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

          {/* RIGHT: Configurations & Add actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
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
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color)}
                      className={`relative flex items-center gap-2 py-1.5 px-3 rounded-xl transition border bg-white ${
                        selectedColor.name === color.name 
                          ? 'border-primary ring-1 ring-primary' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {selectedColor.name === color.name && (
                        <div className="absolute top-0 right-0 bg-primary text-white rounded-bl-lg rounded-tr-xl p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <img src={color.image || product.image} alt={color.name} className="w-8 h-8 object-contain shrink-0" />
                      <div className="flex flex-col text-left mr-2">
                        <span className="text-xs font-bold text-brand-black">{color.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{formatPrice(currentPrice)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Variants Options */}
              {product.storages.length > 1 && (
                <div className="mb-4 pt-2 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-500 block mb-2">PHIÊN BẢN BỘ NHỚ</span>
                  <div className="flex flex-wrap gap-2">
                    {product.storages.map((storage) => (
                      <button
                        key={storage.name}
                        onClick={() => setSelectedStorage(storage)}
                        className={`py-2 px-5 rounded-xl text-xs font-bold text-center transition flex flex-col items-center justify-center gap-0.5 shadow-sm ${
                          selectedStorage.name === storage.name
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{storage.name}</span>
                        <span className="text-[10px] font-medium opacity-90">
                          {formatPrice(discountedBasePrice + storage.priceOffset)}
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
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleAddToCart(true)}
                  className="px-6 min-w-[240px] bg-primary hover:bg-primary-hover text-white py-3 rounded-2xl font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition flex flex-col items-center justify-center"
                >
                  <span className="text-sm">Mua Ngay</span>
                  <span className="text-[9px] font-normal normal-case opacity-90">(Giao tận nơi hoặc nhận tại cửa hàng)</span>
                </button>
                <button
                  onClick={() => handleAddToCart(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-brand-black py-3 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4.5 w-4.5" /> Thêm Vào Giỏ
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
                  <span>Giảm thêm 1% cho thành viên PulseMember (áp dụng trên giá khuyến mãi).</span>
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
            <div className={`relative overflow-hidden transition-all duration-700 ${showFullDescription ? 'max-h-[5000px]' : 'max-h-[600px]'}`}>
              <div className="prose text-gray-600 text-sm leading-relaxed space-y-6 font-medium pb-8">
              <p className="text-base text-gray-700 font-semibold">{product.description}</p>
              
              <div className="w-full rounded-2xl overflow-hidden my-6 border border-gray-100 bg-white flex items-center justify-center p-4 shadow-sm">
                <img src={product.images[0] || product.image} alt={product.name} className="w-2/3 md:w-1/2 h-auto object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500" />
              </div>

              {['phone', 'tablet', 'laptop'].includes(product.category) ? (
                <>
                  <h4 className="text-brand-black text-lg font-bold mt-8 mb-3">Thiết kế sang trọng, thời thượng và đẳng cấp</h4>
                  <p>Sự kết hợp hoàn hảo giữa vật liệu cao cấp và sự tinh tế trong ngôn ngữ thiết kế đã kiến tạo nên một diện mạo đầy sức hút. Mọi góc cạnh, đường viền của <strong>{product.name}</strong> đều được vát cong và xử lý tỉ mỉ bởi công nghệ cắt khắc tiên tiến nhất, không chỉ mang lại vẻ đẹp bóng bẩy, sang trọng mà còn tạo cảm giác cầm nắm đầm tay, vô cùng thoải mái khi sử dụng liên tục trong nhiều giờ. Phần mặt lưng được phủ một lớp hoàn thiện cao cấp giúp chống bám mồ hôi và dấu vân tay, duy trì vẻ ngoài sạch sẽ, mới mẻ. Sự đa dạng về tùy chọn màu sắc cũng giúp người dùng tự do thể hiện cá tính riêng, biến chiếc máy không chỉ là một công cụ liên lạc mà còn là một món đồ trang sức công nghệ dẫn đầu xu hướng.</p>

                  {product.images.length > 1 && (
                    <div className="w-full rounded-2xl overflow-hidden my-6 shadow-sm border border-gray-100">
                      <img src={product.images[1]} alt="Thiết kế và trải nghiệm" className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}

                  <h4 className="text-brand-black text-lg font-bold mt-8 mb-3">Hiệu năng mạnh mẽ, thách thức mọi giới hạn</h4>
                  <p>Nằm sâu bên trong bộ khung tuyệt đẹp là một nguồn sức mạnh khổng lồ được cung cấp bởi vi xử lý <strong>{product.specs.cpu || 'thế hệ mới nhất'}</strong>. Với tiến trình sản xuất hiện đại và kiến trúc lõi được tối ưu hoá, thiết bị không chỉ xử lý mượt mà mọi thao tác vuốt chạm thông thường mà còn dễ dàng "cân" mọi tựa game đồ họa 3D nặng nhất hiện nay. Mức dung lượng RAM <strong>{product.specs.ram || 'lớn'}</strong> cho phép bạn thoải mái mở hàng chục ứng dụng chạy ngầm cùng lúc mà không hề xảy ra hiện tượng giật lag hay phải chờ tải lại. Bên cạnh đó, hệ thống tản nhiệt tiên tiến giúp máy luôn hoạt động ở nhiệt độ lý tưởng. Dung lượng pin ấn tượng <strong>{product.specs.battery || 'bền bỉ'}</strong> kết hợp cùng công nghệ quản lý điện năng bằng trí tuệ nhân tạo (AI) sẽ đồng hành cùng bạn suốt cả một ngày dài năng động mà không phải lo lắng về việc gián đoạn trải nghiệm.</p>

                  {product.images.length > 2 && (
                    <div className="w-full rounded-2xl overflow-hidden my-6 shadow-sm border border-gray-100 bg-white flex items-center justify-center">
                      <img src={product.images[2]} alt="Công nghệ màn hình và camera" className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}

                  <h4 className="text-brand-black text-lg font-bold mt-8 mb-3">Nâng tầm trải nghiệm thị giác và nhiếp ảnh chuyên nghiệp</h4>
                  <p>Điểm nhấn không thể bỏ qua chính là không gian hiển thị đỉnh cao thông qua màn hình <strong>{product.specs.screen || 'siêu sắc nét'}</strong>. Tấm nền cao cấp mang lại dải màu sắc rực rỡ, độ tương phản tuyệt đối và độ sáng vượt trội, cho phép bạn thưởng thức các bộ phim điện ảnh hay thiết kế đồ họa một cách chuẩn xác ngay cả dưới ánh nắng gắt. Hơn thế nữa, hệ thống camera <strong>{product.specs.camera || 'chuyên nghiệp'}</strong> được tích hợp hàng loạt cảm biến kích thước lớn, kết hợp thuật toán xử lý ảnh tiên tiến giúp tối ưu hóa ánh sáng và chi tiết trong từng khung hình. Dù bạn chụp ảnh phong cảnh, chụp chân dung xóa phông nghệ thuật hay quay video chống rung trong môi trường thiếu sáng, <strong>{product.name}</strong> đều tự tin mang lại những tác phẩm nghệ thuật sống động và chân thực đến từng điểm ảnh.</p>
                </>
              ) : (
                <>
                  <h4 className="text-brand-black text-lg font-bold mt-8 mb-3">Chất lượng hoàn thiện cao cấp và bền bỉ vượt thời gian</h4>
                  <p>Dòng sản phẩm <strong>{product.name}</strong> luôn được giới mộ điệu đánh giá cao nhờ quy trình sản xuất đáp ứng những tiêu chuẩn khắt khe nhất của ngành công nghiệp phụ kiện. Toàn bộ bề mặt ngoài và các cấu kiện bên trong đều được chế tác từ những vật liệu cao cấp siêu bền, mang lại khả năng chống chịu xuất sắc trước các tác động vật lý, sự thay đổi nhiệt độ và sự mài mòn theo thời gian. Mọi chi tiết gia công từ phím bấm, khớp nối cho đến lớp phủ tĩnh điện đều được xử lý vô cùng tinh xảo, tuyệt đối không có bất kì chi tiết thừa nào. Sự chăm chút này không chỉ giúp thiết bị luôn duy trì vẻ đẹp thẩm mỹ đẳng cấp mà còn mang lại cảm giác an tâm tuyệt đối cho người dùng trong mọi điều kiện môi trường khắc nghiệt nhất.</p>

                  {product.images.length > 1 && (
                    <div className="w-full rounded-2xl overflow-hidden my-6 shadow-sm border border-gray-100 bg-white p-4 flex items-center justify-center">
                      <img src={product.images[1]} alt="Thiết kế phụ kiện" className="w-2/3 h-auto object-contain hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}

                  <h4 className="text-brand-black text-lg font-bold mt-8 mb-3">Tương thích hoàn hảo cùng công nghệ đột phá</h4>
                  <p>
                    Vượt xa khỏi giới hạn của một món phụ kiện thông thường, sản phẩm được nghiên cứu kĩ lưỡng để trở thành một mảnh ghép hoàn hảo, nâng tầm hệ sinh thái công nghệ của bạn. Sự tối ưu hóa về mặt phần cứng lẫn chip xử lý bên trong giúp nó kết nối tức thì và duy trì độ ổn định tuyệt đối với hầu hết các thiết bị thông minh hiện nay.
                    {product.specs.chargingPower && ` Đáng chú ý nhất, công nghệ truyền tải năng lượng với công suất chạm ngưỡng ${product.specs.chargingPower} không chỉ rút ngắn tối đa thời gian sạc đầy mà còn sở hữu cơ chế bảo vệ dòng điện tự động, giúp thiết bị chủ luôn mát mẻ và kéo dài tuổi thọ pin một cách hiệu quả.`}
                    {product.specs.audioFeature && ` Hệ thống vi mạch phân giải và công nghệ ${product.specs.audioFeature} kết hợp cùng cấu trúc buồng âm cao cấp sẽ tái tạo dải âm trầm sâu lắng và dải âm cao trong trẻo, mang bạn đắm chìm vào không gian âm nhạc sống động tựa như một buổi hòa nhạc thực thụ.`}
                    {product.specs.caseFeature && ` Bên cạnh đó, lớp vật liệu đàn hồi chuyên dụng ${product.specs.caseFeature} áp dụng công nghệ phân tán lực thông minh sẽ hấp thụ phần lớn lực va đập khi vô tình làm rơi, tạo nên một "tấm khiên" vững chãi bảo vệ thiết bị yêu quý của bạn khỏi mọi rủi ro nứt vỡ.`}
                  </p>
                  <p className="mt-4">Mọi sản phẩm do PulseTech cung cấp đều là hàng chính hãng 100%, vượt qua hàng loạt khâu kiểm định chất lượng nghiêm ngặt trước khi đến tay người tiêu dùng. Sự kết hợp giữa sự tiện dụng, thiết kế sang trọng và những công nghệ đột phá bên trong chắc chắn sẽ biến <strong>{product.name}</strong> trở thành trợ thủ đắc lực nhất của bạn.</p>
                </>
              )}
              </div>
              {/* Gradient Overlay */}
              <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none transition-opacity duration-300 ${showFullDescription ? 'opacity-0' : 'opacity-100'}`}></div>
            </div>

            {/* View More Button */}
            <div className="flex justify-center mt-2">
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="px-6 py-2.5 border border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-colors"
              >
                {showFullDescription ? 'Thu gọn bài viết' : 'Xem thêm bài viết'}
              </button>
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
