type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: Array<string>;
  category: string;
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
  clerkId: string;
  wishlist: Array<string>;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
};

export type OrderType = {
  shippingAddress: Record<string, unknown>;
  _id: string;
  customerClerkId: string;
  products: Array<OrderItemType>;
  shippingRate: string;
  totalAmount: number;
};
