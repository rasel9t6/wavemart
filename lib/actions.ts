'use server';
import { revalidatePath } from 'next/cache';

// 🔹 Fetch All Categories
export const getCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// 🔹 Fetch Category Details
export const getCategoryDetails = async (categoryId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch category details');
    }

    revalidatePath(`/categories/${categoryId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    return null;
  }
};

// 🔹 Fetch Subcategory Details
export async function getSubcategoryDetails(
  categorySlug: string,
  subcategorySlug: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${categorySlug}/${subcategorySlug}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subcategory details');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching subcategory ${subcategorySlug}:`, error);
    return null;
  }
}

// 🔹 Fetch All Products
export const getProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || []; // Ensures we return an array to avoid crashes
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// 🔹 Fetch Product Details
export const getProductDetails = async (productId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};

// 🔹 Fetch Searched Products
export const getSearchedProducts = async (query: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search/${query}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch searched products');
    }

    revalidatePath(`/search/${query}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching search results for ${query}:`, error);
    return [];
  }
};

// 🔹 Fetch Orders for a Customer (Store Project)
export const getOrders = async (customerId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch customer orders');
    }

    revalidatePath(`/orders/customers/${customerId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    return [];
  }
};

// 🔹 Fetch All Orders (Admin Project)
export const getAllOrders = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

// 🔹 Fetch Related Products
export const getRelatedProducts = async (productId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }

    revalidatePath(`/products/${productId}/related`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
};

// 🔹 Fetch Exchange Rate (for CNY to other currencies)
export const getExchangeRate = async () => {
  try {
    const response = await fetch(
      `https://EXCHANGE_RATE_API_URL/EXCHANGE_RATE_API_KEY/latest/CNY`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
};
