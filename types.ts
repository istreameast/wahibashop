
export type Language = 'fr' | 'ar';

export interface Variation {
  id: string;
  name: string; // e.g., "50ml", "Gold Box"
  price: number;
  stock: number;
}

export type DescriptionBlockType = 'text' | 'image';

export interface DescriptionBlock {
  id: string;
  type: DescriptionBlockType;
  content: string; // Text content or Image Base64/URL
}

export interface Product {
  id: string;
  slug: string;
  name: {
    fr: string;
    ar: string;
  };
  shortDescription: {
    fr: string;
    ar: string;
  };
  descriptionBlocks: {
    fr: DescriptionBlock[];
    ar: DescriptionBlock[];
  };
  price: number; // Base price
  images: string[]; // 0 is cover
  category: string;
  variations: Variation[];
  isFeatured: boolean;
}

export interface CartItem {
  productId: string;
  variationId: string | null;
  quantity: number;
  priceAtTime: number; // In case price changes
  productName: { fr: string; ar: string };
  variationName?: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
  };
  items: CartItem[];
  total: number;
}

export interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
}

export interface ClientResult {
  id: string;
  image: string;
  handle: string; // e.g. @sarah_beauty
  tag: string; // e.g. #Transformation
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string; // e.g. "Cliente vérifiée"
  avatar: string;
}

export interface HeroImage {
  id: string;
  url: string;
  position: string; // CSS object-position e.g. "50% 50%"
}