import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OrderItemType, ProductType } from '@/lib/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { updateUserProfileData } from '@/lib/userUtils';
import CustomerInfoForm from './CustomerInfoForm';
import DeliveryOptions from './DeliveryOptions';
import OrderSummary from './OrderSummary';
import PaymentMethodSelector from './PaymentMethodSelector';
import ShippingAddressForm from './ShippingAddressForm';

// Define proper types for address fields
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

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItemType[];
  totalQuantity: number;
  selectedPrice: number;
  totalDiscount: number;
  productInfo: ProductType;
};

export default function OrderModal({
  isOpen,
  onClose,
  orderItems,
  totalQuantity,
  selectedPrice,
  totalDiscount,
  productInfo,
}: OrderModalProps) {
  const { data: session } = useSession();

  // Initial form state matching the Order schema with proper types
  const [formData, setFormData] = useState({
    // Customer Info
    customerInfo: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: session?.user?.phone || '',
      address: {
        street: session?.user?.address?.street || '',
        city: session?.user?.address?.city || '',
        state: session?.user?.address?.state || '',
        postalCode: session?.user?.address?.postalCode || '',
        country: session?.user?.address?.country || '',
      },
    } as CustomerInfoType,
    // Shipping Address
    shippingAddress: {
      street: session?.user?.address?.street || '',
      city: session?.user?.address?.city || '',
      state: session?.user?.address?.state || '',
      postalCode: session?.user?.address?.postalCode || '',
      country: session?.user?.address?.country || '',
    } as AddressType,
    // Order details
    shippingMethod: 'air' as 'air' | 'sea',
    deliveryType: 'door-to-door' as 'door-to-door' | 'warehouse',
    paymentMethod: 'bkash' as
      | 'bkash'
      | 'nogod'
      | 'rocket'
      | 'card'
      | 'bank-transfer'
      | 'cash',
  });

  // Re-sync form data when session changes
  useEffect(() => {
    if (session?.user) {
      setFormData((prevData) => ({
        ...prevData,
        customerInfo: {
          name: session.user.name || prevData.customerInfo.name,
          email: session.user.email || prevData.customerInfo.email,
          phone: session.user.phone || prevData.customerInfo.phone,
          address: {
            street:
              session.user.address?.street ||
              prevData.customerInfo.address.street,
            city:
              session.user.address?.city || prevData.customerInfo.address.city,
            state:
              session.user.address?.state ||
              prevData.customerInfo.address.state,
            postalCode:
              session.user.address?.postalCode ||
              prevData.customerInfo.address.postalCode,
            country:
              session.user.address?.country ||
              prevData.customerInfo.address.country,
          },
        },
        shippingAddress: {
          street:
            session.user.address?.street || prevData.shippingAddress.street,
          city: session.user.address?.city || prevData.shippingAddress.city,
          state: session.user.address?.state || prevData.shippingAddress.state,
          postalCode:
            session.user.address?.postalCode ||
            prevData.shippingAddress.postalCode,
          country:
            session.user.address?.country || prevData.shippingAddress.country,
        },
      }));
    }
  }, [session]);

  // Handle form data changes
  const handleFormDataChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Calculate Order Totals according to the schema
  const shippingCost = formData.shippingMethod === 'air' ? 1500 : 1000;
  const subtotal = totalQuantity * selectedPrice;
  const totalAmount = subtotal + shippingCost - totalDiscount;

  // Handle Order Submission
  const handleOrder = async () => {
    try {
      // Check if user is authenticated
      if (!session || !session.user) {
        toast.error('Please sign in to place an order');
        return;
      }

      // Validate required fields
      if (
        !formData.customerInfo.name ||
        !formData.customerInfo.email ||
        !formData.customerInfo.phone
      ) {
        toast.error('Please fill in all required customer information');
        return;
      }

      // Validate shipping address if door-to-door delivery
      if (formData.deliveryType === 'door-to-door') {
        const { street, city, state, postalCode, country } =
          formData.shippingAddress;
        if (!street || !city || !state || !postalCode || !country) {
          toast.error('Please fill in all required shipping address fields');
          return;
        }
      }

      // Update user profile with new information (if available)
      await updateUserProfileData(session, formData.customerInfo);

      // Create order object based on schema
      const orderData = {
        userId: session.user.id, // Get userId from the session
        customerInfo: formData.customerInfo,
        products: orderItems.map((item) => ({
          product: item._id,
          title: item.product.title,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.totalPrice,
        })),
        shippingAddress: formData.shippingAddress,
        shippingMethod: formData.shippingMethod,
        deliveryType: formData.deliveryType,
        paymentMethod: formData.paymentMethod,
        subtotal,
        shippingRate: shippingCost,
        totalDiscount,
        totalAmount,
      };

      // Send the order to the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || '',
          },
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      toast.success('Your order has been placed successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(
        error.message || 'An error occurred while placing your order',
      );
    }
  };

  // Define if shipping address is required based on delivery type
  const requireShippingAddress = formData.deliveryType === 'door-to-door';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold">Complete Your Order</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="mt-4 space-y-2">
          <p>
            <strong>Product:</strong> {productInfo.title}
          </p>
          <p>
            <strong>Total Quantity:</strong> {totalQuantity} units
          </p>
          <p>
            <strong>Price Per Unit:</strong> ৳ {selectedPrice}
          </p>
          {totalDiscount > 0 && (
            <p className="text-green-600">
              <strong>Total Discount:</strong> ৳ {totalDiscount}
            </p>
          )}
        </div>

        {/* Order Items */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Ordered Items</h3>
          <ul className="mt-2 rounded-lg border p-3">
            {orderItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between border-b py-2 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {item.product.title}{' '}
                  {item.color && (
                    <span className="flex items-center gap-2">
                      <Image
                        src={item.color}
                        alt="Color Variant"
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                    </span>
                  )}
                  {item.size && `(${item.size})`}
                </div>
                <span>
                  {item.quantity} × ৳{item.price} = ৳{item.totalPrice}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Info Form */}
        <CustomerInfoForm
          customerInfo={formData.customerInfo}
          onChange={(field: any, value: any) => {
            const updatedCustomerInfo = {
              ...formData.customerInfo,
              [field]: value,
            };
            handleFormDataChange('customerInfo', updatedCustomerInfo);
          }}
          onAddressChange={(field: any, value: any) => {
            const updatedAddress = {
              ...formData.customerInfo.address,
              [field]: value,
            };
            const updatedCustomerInfo = {
              ...formData.customerInfo,
              address: updatedAddress,
            };
            handleFormDataChange('customerInfo', updatedCustomerInfo);
          }}
          session={session}
        />

        {/* Shipping Address - Only show if door-to-door */}
        {requireShippingAddress && (
          <ShippingAddressForm
            shippingAddress={formData.shippingAddress}
            onChange={(field: any, value: any) => {
              const updatedShippingAddress = {
                ...formData.shippingAddress,
                [field]: value,
              };
              handleFormDataChange('shippingAddress', updatedShippingAddress);
            }}
          />
        )}

        {/* Delivery Options */}
        <DeliveryOptions
          deliveryType={formData.deliveryType}
          shippingMethod={formData.shippingMethod}
          onChange={handleFormDataChange}
        />

        {/* Payment Method */}
        <PaymentMethodSelector
          paymentMethod={formData.paymentMethod}
          onChange={(value: any) => handleFormDataChange('paymentMethod', value)}
        />

        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          shippingCost={shippingCost}
          totalDiscount={totalDiscount}
          totalAmount={totalAmount}
        />

        {/* Order Button */}
        <div className="mt-6 flex justify-end border-t pt-4">
          <button
            onClick={handleOrder}
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}
