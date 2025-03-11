import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession['user'];
  }
}

type ProductType = {
  _id: string;
  sku: string;
  slug: string;
  title: string;
  description: string;
  media: Array<string>;
  category: { name: string };
  collections: Array<string>;
  tags: Array<string>;
  price: {
    bdt: number;
  };
  sizes: Array<string>;
  colors: Array<string>;
  createdAt: string;
  updatedAt: string;

  // ✅ Add missing properties to match API response
  minimumOrderQuantity?: number; // Optional property (if it sometimes doesn't exist)
  quantityPricing?: {
    ranges: Array<{
      minQuantity: number;
      maxQuantity?: number; // Some ranges may not have a max limit
      price: {
        bdt: number;
      };
    }>;
  };
};

export type CategoryType = {
  _id: string;
  title: string;
  name: string;
  products: Array<string | ProductType>;
  icon: string;
  thumbnail: string;
  image: string;
  slug: string;
};

export type UserType = {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  wishlist: Array<string>;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OrderItemType = {
  _id: string;
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  price: number; // Added price to track unit price at order time
  totalPrice: number; // Helps calculate order total per product
};

export type OrderType = {
  _id: string;
  customerClerkId: string;
  products: OrderItemType[]; // Array<OrderItemType> is fine, but this is cleaner
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  shippingRate: {
    method: 'air' | 'sea';
    deliveryType: 'door-to-door' | 'warehouse';
    cost: number;
    estimatedDelivery: string; // Example: '3-5 days'
  };
  customer?: {
    name: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  totalAmount: number; // Sum of all product prices + shipping cost
};
