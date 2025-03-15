import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OrderItemType, ProductType } from '@/lib/types';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

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
  onClose,
  orderItems,
  totalQuantity,
  selectedPrice,
  totalDiscount,
  productInfo,
}: OrderModalProps) {
  // Initial form state matching the Order schema
  const [formData, setFormData] = useState({
    // Customer Info
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
    // Shipping Address
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
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

  // Handle basic customer info changes
  const handleCustomerInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      customerInfo: {
        ...formData.customerInfo,
        [field]: value,
      },
    });
  };

  // Handle shipping address changes
  const handleShippingAddressChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress,
        [field]: value,
      },
    });
  };

  // Handle direct field changes
  const handleDirectChange = (field: string, value: string) => {
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
  const { data: session } = useSession();

  const handleOrder = async () => {
    try {
      // Check if user is authenticated
      if (!session || !session.user) {
        alert('Please sign in to place an order');
        return;
      }

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

      console.log('Order Data:', orderData);

      // Send the order to the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: 'POST',
          headers: new Headers({
            'x-api-key': process.env.ADMIN_API_KEY || '',
            Accept: 'application/json',
          }),
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      console.log('Order Placed Successfully:', result);
      toast.success('Your order has been placed successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message);
    }
  };

  // Define if shipping address is required based on delivery type
  const requireShippingAddress = formData.deliveryType === 'door-to-door';

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
              <li key={index} className="flex justify-between border-b py-2">
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
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={formData.customerInfo.name}
              onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
              placeholder="Full Name *"
              className="w-full rounded-md border p-2"
              required
            />
            <input
              type="email"
              value={formData.customerInfo.email}
              onChange={(e) =>
                handleCustomerInfoChange('email', e.target.value)
              }
              placeholder="Email Address *"
              className="w-full rounded-md border p-2"
              required
            />
            <input
              type="tel"
              value={formData.customerInfo.phone}
              onChange={(e) =>
                handleCustomerInfoChange('phone', e.target.value)
              }
              placeholder="Phone Number *"
              className="w-full rounded-md border p-2"
              required
            />
          </div>
        </div>

        {/* Shipping Address - Only show if door-to-door */}
        {requireShippingAddress && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="mt-2 grid grid-cols-1 gap-4">
              <input
                type="text"
                value={formData.shippingAddress.street}
                onChange={(e) =>
                  handleShippingAddressChange('street', e.target.value)
                }
                placeholder="Street Address *"
                className="w-full rounded-md border p-2"
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) =>
                    handleShippingAddressChange('city', e.target.value)
                  }
                  placeholder="City *"
                  className="w-full rounded-md border p-2"
                  required
                />
                <input
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) =>
                    handleShippingAddressChange('state', e.target.value)
                  }
                  placeholder="State/Province *"
                  className="w-full rounded-md border p-2"
                  required
                />
                <input
                  type="text"
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) =>
                    handleShippingAddressChange('postalCode', e.target.value)
                  }
                  placeholder="Postal Code *"
                  className="w-full rounded-md border p-2"
                  required
                />
                <input
                  type="text"
                  value={formData.shippingAddress.country}
                  onChange={(e) =>
                    handleShippingAddressChange('country', e.target.value)
                  }
                  placeholder="Country *"
                  className="w-full rounded-md border p-2"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Options */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Shipping Method */}
          <div>
            <label className="block font-semibold">Shipping Method:</label>
            <select
              value={formData.shippingMethod}
              onChange={(e) =>
                handleDirectChange('shippingMethod', e.target.value)
              }
              className="mt-1 w-full rounded-md border p-2"
            >
              <option value="air">By Air (৳1500)</option>
              <option value="sea">By Sea (৳1000)</option>
            </select>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="block font-semibold">Delivery Type:</label>
            <select
              value={formData.deliveryType}
              onChange={(e) =>
                handleDirectChange('deliveryType', e.target.value)
              }
              className="mt-1 w-full rounded-md border p-2"
            >
              <option value="door-to-door">Door to Door</option>
              <option value="warehouse">Pick Up from Warehouse</option>
            </select>
          </div>
        </div>

        {/* Warehouse Location Note */}
        {formData.deliveryType === 'warehouse' && (
          <p className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
            📍 <strong>Warehouse Location:</strong> Road 01/B, House 08,
            Nikunja-2, Khilkhet, Dhaka, Bangladesh
          </p>
        )}

        {/* Payment Method */}
        <div className="mt-6">
          <label className="block font-semibold">Payment Method:</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) =>
              handleDirectChange('paymentMethod', e.target.value)
            }
            className="mt-1 w-full rounded-md border p-2"
          >
            <option value="bkash">bKash</option>
            <option value="nogod">Nagad</option>
            <option value="rocket">Rocket</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Cost:</span>
              <span>৳ {shippingCost}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>- ৳ {totalDiscount}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>৳ {totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg bg-gray-300 px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
            onClick={handleOrder}
          >
            Confirm Order
          </button>
        </div>
      </motion.div>
    </div>
  );
}
