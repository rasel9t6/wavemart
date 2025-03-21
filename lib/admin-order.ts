const NEXT_PUBLIC_ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function createOrderInAdminSystem(orderData: any) {
  console.log('Creating order in admin system', orderData);
  try {
    const response = await fetch(`${NEXT_PUBLIC_ADMIN_API_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        `Admin API returned ${response.status}: ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    console.log(`Created new order for user: ${orderData.userId}`);
    return data.order;
  } catch (apiError) {
    console.error(
      '[admin_order_create]',
      apiError instanceof Error ? apiError.message : String(apiError),
    );
    return null;
  }
}
