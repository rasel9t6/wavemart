'use server';
import { revalidatePath } from 'next/cache';
import User from './models/User';
import { connectToDB } from './mongoDB';
import OrderReference from './models/Order';

// 🔹 Fetch All Categories
export const getCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
};

// 🔹 Fetch Category Details
export const getCategoryDetails = async (categoryId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories/${categoryId}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
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
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/categories/${categorySlug}/${subcategorySlug}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
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
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// 🔹 Fetch Product Details
export const getProductDetails = async (productId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/products/${productId}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
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
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/search/${query}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
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

// 🔹 Fetch Related Products
export const getRelatedProducts = async (productId: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';

    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_ADMIN_API_URL is not found');
    }
    console.log(
      `Fetching related products from: ${apiUrl}/products/${productId}/related`,
    );

    const response = await fetch(`${apiUrl}/products/${productId}/related`, {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { tags: [`product-${productId}`] },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch related products: ${response.status}`);
    }

    const data = await response.json();

    if (typeof window === 'undefined') {
      revalidatePath(`/products/${productId}/related`);
      revalidatePath(`/products/${productId}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
};

export const createOrder = async (orderData: any) => {
  try {
    if (!process.env.ADMIN_API_KEY) {
      throw new Error('ADMIN_API_KEY is missing.');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/orders`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(orderData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order API Error:', errorText);
      throw new Error(`Failed to create order: ${response.status}`);
    }

    const result = await response.json();
    console.log('New Order Created:', result);

    const newOrder = result.order;
    if (!newOrder || !newOrder._id) {
      throw new Error('Order creation failed. No _id returned.');
    }

    await connectToDB();

    const orderReference = new OrderReference({
      orderId: newOrder._id,
    });

    const savedOrderRef = await orderReference.save();
    console.log('Order reference created:', savedOrderRef._id);

    const user = await User.findOne({ userId: orderData.userId });
    if (!user) {
      console.error(`No user found with userId: ${orderData.userId}`);
      throw new Error(`No user found with userId: ${orderData.userId}`);
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: orderData.userId },
      { $push: { orders: savedOrderRef._id } },
      { new: true },
    );

    console.log('Updated user orders count:', updatedUser.orders.length);

    return {
      success: true,
      order: newOrder,
      orderReference: savedOrderRef,
    };
  } catch (error: any) {
    console.error('Error creating order:', error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Fetch Exchange Rate (for CNY to other currencies)
export const getExchangeRate = async () => {
  try {
    const response = await fetch(
      `https://EXCHANGE_RATE_API_URL/EXCHANGE_RATE_API_KEY/latest/CNY`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
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
