import { Session } from 'next-auth';

interface AddressType {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CustomerInfoType {
  name: string;
  email: string;
  phone: string;
  address: AddressType;
}

export const updateUserProfileData = async (
  session: Session | null,
  customerInfo: CustomerInfoType,
) => {
  try {
    if (!session || !session.user) return;

    // Only update if phone or address fields are empty in the current user profile
    const shouldUpdatePhone = !session.user.phone && customerInfo.phone;
    const shouldUpdateAddress =
      !session.user.address?.street && customerInfo.address.street;

    // Skip update if no new data
    if (!shouldUpdatePhone && !shouldUpdateAddress) return;

    // Prepare update data
    const updateData: {
      phone?: string;
      address?: AddressType;
    } = {};

    if (shouldUpdatePhone) {
      updateData.phone = customerInfo.phone;
    }

    if (shouldUpdateAddress) {
      updateData.address = customerInfo.address;
    }

    // Only make API call if we have data to update
    if (Object.keys(updateData).length > 0) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const result = await response.json();
        console.warn('Failed to update user profile:', result.error);
      }
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Don't show toast error for this as it's not critical to order process
  }
};
