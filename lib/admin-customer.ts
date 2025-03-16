const NEXT_PUBLIC_ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
export async function createCustomerInAdminSystem(userData: any) {
  console.log('Submitting customer data to admin system', userData);
  try {
    // Check if customer already exists in admin system
    let customerExists = false;
    try {
      const checkResponse = await fetch(
        `${NEXT_PUBLIC_ADMIN_API_URL}/customers?email=${encodeURIComponent(userData.email)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${ADMIN_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.exists) {
          console.log(`Customer already exists for user: ${userData.email}`);
          customerExists = true;
        }
      }
    } catch (_checkError) {
      console.log(
        `${_checkError ? 'Customer check failed' : ' proceeding with creation'}`,
      );
    }

    // Don't create if customer already exists
    if (customerExists) {
      return true;
    }

    // Create customer in admin system with a placeholder phone number
    const customerData = {
      userId: userData.id,
      name: userData.name || 'New Customer',
      email: userData.email,
      phone: userData.phone || '0000000000', // Placeholder for required field
      status: 'active',
      customerType: 'regular',
    };

    console.log('Sending customer data:', JSON.stringify(customerData));

    const response = await fetch(`${NEXT_PUBLIC_ADMIN_API_URL}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        `Admin API returned ${response.status}: ${JSON.stringify(errorData)}`,
      );
    }

    console.log(`Created new customer for user: ${userData.email}`);
    return true;
  } catch (apiError) {
    console.error(
      '[admin_customer_create]',
      apiError instanceof Error ? apiError.message : String(apiError),
    );
    return false;
  }
}
