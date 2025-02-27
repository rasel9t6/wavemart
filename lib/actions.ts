'use server';
import { revalidatePath } from 'next/cache';

export const getCategories = async () => {
  const categories = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
  );
  return await categories.json();
};

export const getCategoryDetails = async (categoryId: string) => {
  const category = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
  );
  revalidatePath(`/categories/${categoryId}`);
  return await category.json();
};
export async function getSubcategoryDetails(
  categorySlug: string,
  subcategorySlug: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${categorySlug}/${subcategorySlug}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subcategory details');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching subcategory details:', error);
    throw error;
  }
}
export const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const products = data.products;
  return await products;
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
