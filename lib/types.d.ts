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
  media: string[];
  category: {
    name: string;
    _id?: string; // Adding this as it's referenced in the schema
  };
  collections: Array<any>; // Maintaining from your type, though not in schema
  tags: string[];
  price: {
    bdt: number;
    cny: number;
    usd: number;
  };
  expense: {
    bdt: number;
    cny: number;
    usd: number;
  };
  sizes: string[];
  colors: string[];
  createdAt: string;
  updatedAt: string;
  // Added properties from schema
  minimumOrderQuantity: number;
  inputCurrency: 'CNY' | 'USD';
  quantityPricing: {
    ranges: Array<{
      minQuantity: number;
      maxQuantity?: number;
      price: {
        bdt: number;
        cny: number;
        usd: number;
      };
    }>;
  };
  currencyRates: {
    usdToBdt: number;
    cnyToBdt: number;
  };
  categoryDetails?: {
    name: string;
    _id: string;
    // Add other category fields as needed
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
  price: number; // Unit price at order time
  totalPrice: number; // Calculated price per product (quantity * price)
};

export type OrderType = {
  _id: string;
  customerClerkId: string;
  products: OrderItemType[]; // Array of order items
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