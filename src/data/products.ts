export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface StorageVariant {
  name: string;
  priceOffset: number;
}

export interface ProductSpec {
  screen: string;
  os: string;
  camera: string;
  frontCamera: string;
  cpu: string;
  ram: string;
  storage: string;
  battery: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'phone' | 'tablet' | 'accessory';
  basePrice: number;
  originalPrice: number;
  discount: number;
  image: string;
  images: string[];
  colors: ColorVariant[];
  storages: StorageVariant[];
  specs: ProductSpec;
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isFeatured?: boolean;
  isFlashSale?: boolean;
  badge?: string;
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'phone',
    basePrice: 29990000,
    originalPrice: 34990000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1695048133140-fdc009f3b63b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1695048065095-2cc1b91de999?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Titan Tự Nhiên', hex: '#8a7f76', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop' },
      { name: 'Titan Xanh', hex: '#2f3c4d', image: 'https://images.unsplash.com/photo-1695048065095-2cc1b91de999?q=80&w=600&auto=format&fit=crop' },
      { name: 'Titan Đen', hex: '#232426', image: 'https://images.unsplash.com/photo-1695048133140-fdc009f3b63b?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '256GB', priceOffset: 0 },
      { name: '512GB', priceOffset: 5000000 },
      { name: '1TB', priceOffset: 10000000 }
    ],
    specs: {
      screen: '6.7 inches, Super Retina XDR OLED, 120Hz',
      os: 'iOS 17',
      camera: 'Chính 48 MP & Phụ 12 MP, 12 MP',
      frontCamera: '12 MP',
      cpu: 'Apple A17 Pro 6 nhân',
      ram: '8 GB',
      storage: '256 GB / 512 GB / 1 TB',
      battery: '4441 mAh, Sạc nhanh 20W'
    },
    description: 'iPhone 15 Pro Max có thiết kế titan cấp vũ trụ nhẹ và bền chắc, nút Tác Vụ mới, camera 48MP thu phóng quang học 5x siêu đỉnh cùng chip A17 Pro mạnh mẽ vượt trội đưa trải nghiệm chơi game và đa nhiệm lên tầm cao mới.',
    rating: 4.8,
    reviewsCount: 142,
    reviews: [
      { id: 'r1', user: 'Nguyễn Văn Nam', rating: 5, comment: 'Máy siêu nhẹ, màu titan tự nhiên rất đẹp, pin trâu hơn hẳn con 13 pro cũ.', date: '2026-05-10' },
      { id: 'r2', user: 'Trần Thị Mai', rating: 4, comment: 'Camera chụp zoom 5x nét căng, tuy nhiên máy hơi nóng khi sạc nhanh.', date: '2026-05-14' }
    ],
    isFeatured: true,
    isFlashSale: true,
    badge: 'Trả góp 0%',
    stock: 25
  },
  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'phone',
    basePrice: 26990000,
    originalPrice: 33990000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xám Titan', hex: '#777777', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' },
      { name: 'Tím Titan', hex: '#433d4f', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop' },
      { name: 'Vàng Titan', hex: '#d4af37', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '256GB', priceOffset: 0 },
      { name: '512GB', priceOffset: 4000000 },
      { name: '1TB', priceOffset: 8000000 }
    ],
    specs: {
      screen: '6.8 inches, Dynamic AMOLED 2X, QHD+, 120Hz',
      os: 'Android 14',
      camera: 'Chính 200 MP & Phụ 50 MP, 12 MP, 10 MP',
      frontCamera: '12 MP',
      cpu: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      storage: '256 GB / 512 GB / 1 TB',
      battery: '5000 mAh, Sạc nhanh 45W'
    },
    description: 'Galaxy S24 Ultra mở ra kỷ nguyên điện thoại AI hoàn toàn mới với Galaxy AI tích hợp sẵn: Khoanh vùng search đa năng, Phiên dịch trực tiếp cuộc gọi, Trợ lý note và camera mắt thần bóng đêm zoom quang học 5x cực đỉnh.',
    rating: 4.9,
    reviewsCount: 98,
    reviews: [
      { id: 's1', user: 'Lê Hoàng Long', rating: 5, comment: 'Galaxy AI quá tiện lợi, bút S-Pen viết vẽ vẽ sướng. Màn hình phẳng dán cường lực dễ hơn bản cũ.', date: '2026-05-18' },
      { id: 's2', user: 'Phạm Minh Tuấn', rating: 5, comment: 'Camera 200MP zoom xa siêu chất, máy đầm tay, viền titan sang trọng.', date: '2026-05-20' }
    ],
    isFeatured: true,
    isFlashSale: true,
    badge: 'Độc quyền AI',
    stock: 18
  },
  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'phone',
    basePrice: 28990000,
    originalPrice: 32990000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Đen Tuyển', hex: '#111111', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop' },
      { name: 'Trắng Sữa', hex: '#f0f0f0', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '512GB', priceOffset: 0 }
    ],
    specs: {
      screen: '6.73 inches, LTPO AMOLED, WQHD+, 120Hz',
      os: 'Xiaomi HyperOS (Android 14)',
      camera: '4 camera 50 MP ống kính Leica cao cấp',
      frontCamera: '32 MP',
      cpu: 'Snapdragon 8 Gen 3 8 nhân',
      ram: '16 GB',
      storage: '512 GB',
      battery: '5000 mAh, Sạc nhanh 90W'
    },
    description: 'Xiaomi 14 Ultra đồng kiến tạo cùng hãng ống kính Leica lừng danh toàn cầu, sở hữu cảm biến lớn 1 inch cùng khẩu độ mở rộng vô cấp, mang lại chất ảnh nghệ thuật chuyên nghiệp như máy ảnh cơ thực thụ.',
    rating: 4.7,
    reviewsCount: 35,
    reviews: [
      { id: 'x1', user: 'Vũ Quốc Khánh', rating: 5, comment: 'Chất lượng camera Leica chụp màu Vintage đỉnh chóp. Hiệu năng vô đối chơi game mượt.', date: '2026-04-29' }
    ],
    isFeatured: true,
    isFlashSale: false,
    badge: 'Ống kính Leica',
    stock: 12
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15 128GB',
    brand: 'Apple',
    category: 'phone',
    basePrice: 19490000,
    originalPrice: 22990000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xanh Dương', hex: '#c5e2ec', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop' },
      { name: 'Hồng Phấn', hex: '#fad4d8', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop' },
      { name: 'Đen Nhám', hex: '#222222', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '128GB', priceOffset: 0 },
      { name: '256GB', priceOffset: 3000000 }
    ],
    specs: {
      screen: '6.1 inches, Super Retina XDR OLED',
      os: 'iOS 17',
      camera: 'Chính 48 MP & Phụ 12 MP',
      frontCamera: '12 MP',
      cpu: 'Apple A16 Bionic 6 nhân',
      ram: '6 GB',
      storage: '128 GB / 256 GB',
      battery: '3349 mAh, Sạc nhanh 20W'
    },
    description: 'iPhone 15 mang đến cải tiến đảo động Dynamic Island thông minh, camera chính 48MP vượt trội cùng cổng sạc USB-C phổ biến, kết hợp mặt lưng kính pha màu rực rỡ và khung viền nhôm bo tròn êm tay.',
    rating: 4.6,
    reviewsCount: 74,
    reviews: [
      { id: 'i15-1', user: 'Đỗ Hà Linh', rating: 5, comment: 'Màu hồng phấn dễ thương xỉu, chụp ảnh mịn màng, máy cầm gọn tay lắm.', date: '2026-05-02' }
    ],
    isFeatured: false,
    isFlashSale: true,
    badge: 'Bán Chạy',
    stock: 40
  },
  {
    id: 'samsung-galaxy-a55',
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    category: 'phone',
    basePrice: 9490000,
    originalPrice: 10990000,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xanh Navy', hex: '#1b2c45', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' },
      { name: 'Xanh Iceblue', hex: '#e2f4ff', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '128GB', priceOffset: 0 },
      { name: '256GB', priceOffset: 1200000 }
    ],
    specs: {
      screen: '6.6 inches, Super AMOLED, Full HD+, 120Hz',
      os: 'Android 14',
      camera: 'Chính 50 MP & Phụ 12 MP, 5 MP',
      frontCamera: '32 MP',
      cpu: 'Exynos 1480 8 nhân',
      ram: '8 GB',
      storage: '128 GB / 256 GB',
      battery: '5000 mAh, Sạc nhanh 25W'
    },
    description: 'Galaxy A55 5G gây ấn tượng mạnh mẽ nhờ khung viền kim loại sang trọng, kính cường lực Gorilla Glass Victus+ siêu bền, chống nước kháng bụi IP67 vượt trội trong phân khúc tầm trung.',
    rating: 4.5,
    reviewsCount: 112,
    reviews: [],
    isFeatured: false,
    isFlashSale: true,
    badge: 'Giá Rẻ',
    stock: 50
  },
  {
    id: 'ipad-pro-m4',
    name: 'iPad Pro M4 11-inch (2024)',
    brand: 'Apple',
    category: 'tablet',
    basePrice: 28990000,
    originalPrice: 29990000,
    discount: 3,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Bạc', hex: '#e3e4e6', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop' },
      { name: 'Đen Không Gian', hex: '#2c2d30', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '256GB', priceOffset: 0 },
      { name: '512GB', priceOffset: 5500000 }
    ],
    specs: {
      screen: '11 inches, Ultra Retina Tandem OLED, 120Hz',
      os: 'iPadOS 17',
      camera: 'Chính 12 MP & Cảm biến LiDAR',
      frontCamera: '12 MP góc siêu rộng',
      cpu: 'Apple M4 9 nhân',
      ram: '8 GB',
      storage: '256 GB / 512 GB',
      battery: '8160 mAh, Sạc nhanh 30W'
    },
    description: 'iPad Pro M4 mỏng nhẹ kinh ngạc sở hữu màn hình đột phá Tandem OLED rực rỡ sắc nét cùng siêu chip M4 kiến trúc AI thế hệ mới, hỗ trợ xuất sắc công việc đồ họa nặng và sáng tạo nội dung chuyên nghiệp.',
    rating: 4.9,
    reviewsCount: 22,
    reviews: [
      { id: 'ip-1', user: 'Lê Anh Đức', rating: 5, comment: 'Màn hình OLED kép hiển thị sâu đen tuyệt đối, chip M4 dựng video 4K siêu nhanh mượt.', date: '2026-06-01' }
    ],
    isFeatured: true,
    isFlashSale: false,
    badge: 'Mỏng Nhất',
    stock: 15
  },
  {
    id: 'samsung-galaxy-tab-s9-fe',
    name: 'Samsung Galaxy Tab S9 FE Wi-Fi',
    brand: 'Samsung',
    category: 'tablet',
    basePrice: 8490000,
    originalPrice: 9990000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xám Tinh Tế', hex: '#636569', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop' },
      { name: 'Xanh Nhiệt Huyết', hex: '#c5dcd8', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: '128GB', priceOffset: 0 }
    ],
    specs: {
      screen: '10.9 inches, IPS LCD, 90Hz',
      os: 'Android 13',
      camera: 'Chính 8 MP',
      frontCamera: '12 MP góc siêu rộng',
      cpu: 'Exynos 1380 8 nhân',
      ram: '6 GB',
      storage: '128 GB',
      battery: '8000 mAh, Sạc nhanh 45W'
    },
    description: 'Samsung Galaxy Tab S9 FE đi kèm bút S-Pen quyền năng kháng nước IP68 trong hộp, màn hình 90Hz mượt mà và dung lượng pin khủng 8000mAh giúp học tập, làm việc hiệu quả mọi lúc mọi nơi.',
    rating: 4.6,
    reviewsCount: 45,
    reviews: [],
    isFeatured: false,
    isFlashSale: false,
    badge: 'Tặng Kèm S-Pen',
    stock: 30
  },
  {
    id: 'tai-nghe-apple-airpods-pro-2',
    name: 'Apple AirPods Pro 2 USB-C',
    brand: 'Apple',
    category: 'accessory',
    basePrice: 5790000,
    originalPrice: 6190000,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Trắng', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop' }
    ],
    storages: [
      { name: 'Tiêu Chuẩn', priceOffset: 0 }
    ],
    specs: {
      screen: 'Không có màn hình',
      os: 'Hỗ trợ iOS/Android',
      camera: 'Không hỗ trợ',
      frontCamera: 'Không hỗ trợ',
      cpu: 'Chip Apple H2 cực mạnh',
      ram: 'Không có',
      storage: 'Không có',
      battery: 'Lên đến 6 giờ nghe (30 giờ kèm hộp sạc)'
    },
    description: 'Tai nghe AirPods Pro thế hệ thứ 2 mang đến khả năng chống ồn chủ động tốt gấp 2 lần bản cũ, chế độ Xuyên Âm thích ứng thông minh và âm thanh cá nhân hóa theo cấu trúc tai người dùng.',
    rating: 4.8,
    reviewsCount: 88,
    reviews: [],
    isFeatured: false,
    isFlashSale: false,
    badge: 'Chống ồn ANC',
    stock: 100
  }
];

export const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Oppo'];
export const CATEGORIES = [
  { id: 'phone', name: 'Điện thoại', count: 5 },
  { id: 'tablet', name: 'Máy tính bảng', count: 2 },
  { id: 'accessory', name: 'Phụ kiện', count: 1 }
];
