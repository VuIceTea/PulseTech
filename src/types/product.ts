export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  images?: string[];
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
  accessoryType?: string;
  headphoneType?: string;
  audioFeature?: string;
  connectionType?: string;
  cableLength?: string;
  chargingPower?: string;
  chargingPorts?: string;
  caseMaterial?: string;
  caseFeature?: string;
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
  category: 'phone' | 'tablet' | 'accessory' | 'laptop' | 'audio';
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