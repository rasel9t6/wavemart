import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OrderItemType, ProductType } from '@/lib/types';
import Image from 'next/image';

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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    shippingMethod: 'air',
    deliveryType: 'door-to-door',
  });

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Order Submission
  const handleOrder = () => {
    console.log('Order Placed:', { ...formData, orderItems });
    alert('Your order has been placed successfully!');
    onClose(); // ✅ Close modal after placing the order
  };

  // Calculate Total Price (Products + Shipping)
  const shippingCost = formData.shippingMethod === 'air' ? 1500 : 1000;
  const totalPrice = totalQuantity * selectedPrice + shippingCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
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

        {/* ✅ Show Order Items */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Ordered Items</h3>
          <ul className="mt-2 rounded-lg border p-3">
            {orderItems.map((item) => (
              <li key={item._id} className="flex justify-between border-b py-2">
                <div className="flex items-center gap-2">
                  {item.product.title} -{' '}
                  <span className="flex items-center gap-2 p-3">
                    <Image
                      src={item.color}
                      alt="Color Variant"
                      width={50}
                      height={50}
                      className="rounded-lg"
                    />
                  </span>
                  ({item.size})
                </div>
                <span>
                  {item.quantity} × ৳{item.price} = ৳{item.totalPrice}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping Details Form */}
        <div className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full rounded-md border p-2"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full rounded-md border p-2"
          />

          {/* ✅ Show Shipping Address if "Door to Door" is selected */}
          {formData.deliveryType === 'door-to-door' && (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Shipping Address"
              className="w-full rounded-md border p-2"
            ></textarea>
          )}

          {/* Shipping Method */}
          <div>
            <label className="font-semibold">Shipping Method:</label>
            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            >
              <option value="air">By Air (৳1500)</option>
              <option value="sea">By Sea (৳1000)</option>
            </select>
          </div>

          {/* Delivery Type */}
          <div>
            <label className="font-semibold">Delivery Type:</label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            >
              <option value="door-to-door">Door to Door</option>
              <option value="warehouse">Pick Up from Warehouse</option>
            </select>
          </div>

          {/* ✅ Show Warehouse Location if "Pick Up from Warehouse" is selected */}
          {formData.deliveryType === 'warehouse' && (
            <p className="text-sm text-gray-600">
              📍 Warehouse Location: Road 01/B, House 08, Nikunja-2, Khilkhet,
              Dhaka, Bangladesh
            </p>
          )}
        </div>

        {/* ✅ Total Price */}
        <p className="mt-4 text-right text-lg font-bold">
          Total Amount: ৳{totalPrice}
        </p>

        {/* Order Confirmation Buttons */}
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
