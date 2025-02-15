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
};

export type CollectionType = {
  _id: string;
  title: string;
  name:string;
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
