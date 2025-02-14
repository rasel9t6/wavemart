'use server';
import { revalidatePath } from 'next/cache';

export const getCollections = async () => {
  const collections = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  );
  revalidatePath('/categories');
  return await collections.json();
};

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${collectionId}`,
  );
  revalidatePath(`/categories/${collectionId}`);
  return await collection.json();
};

export const getProducts = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: 'no-store',
  });
  const data = await products.json();
  return await data;
};

export const getProductDetails = async (productId: string) => {
  const product = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
  );
  return await product.json();
};

export const getSearchedProducts = async (query: string) => {
  const searchedProducts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/search/${query}`,
  );
  revalidatePath(`/search/${query}`);
  return await searchedProducts.json();
};

export const getOrders = async (customerId: string) => {
  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`,
  );
  revalidatePath(`/orders/customers/${customerId}`);
  return await orders.json();
};

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`,
  );
  revalidatePath(`/products/${productId}/related`);
  return await relatedProducts.json();
};
// https://EXCHANGE_RATE_API_URL/EXCHANGE_RATE_API_KEY/latest/CNY
