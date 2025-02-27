'use client';
import useCart from '@/lib/hooks/useCart';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import HeartFavorite from './HeartFavorite';
import { ProductType } from '@/lib/types';
import Image from 'next/image';

type OrderItem = {
  color: string;
  size: string;
  quantity: number;
};

export default function ProductInfo({ productInfo }: { productInfo: ProductType }) {
  const cart = useCart();

  // ✅ Extract minimum order quantity
  const minOrderQty = productInfo.minimumOrderQuantity || 1;

  // ✅ Initialize order items with color variants
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    productInfo.colors.map((color) => ({
      color,
      size: productInfo.sizes[0] || 'Default',
      quantity: minOrderQty,
    }))
  );

  // ✅ Calculate total quantity
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ First range price (default product price)
  const firstRangePrice = productInfo.price.bdt; 

  // ✅ Get price based on total quantity
  const getPriceForQuantity = (quantity: number) => {
    const ranges = productInfo.quantityPricing?.ranges || [];
    let selectedPrice = firstRangePrice;

    for (const range of ranges) {
      if (quantity >= range.minQuantity && (!range.maxQuantity || quantity <= range.maxQuantity)) {
        selectedPrice = range.price.bdt;
      }
    }

    return selectedPrice;
  };

  // ✅ Get the updated price per unit based on quantity
  const selectedPrice = getPriceForQuantity(totalQuantity);

  // ✅ Discount Calculation (Simple & Exact)
  const discount = firstRangePrice - selectedPrice;

  // ✅ Show discount only when applicable
  const isDiscountApplied = discount > 0;

  // ✅ Update quantity safely
  const updateQuantity = (index: number, change: number) => {
    setOrderItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: Math.max(updatedItems[index].quantity + change, minOrderQty),
      };
      return updatedItems;
    });
  };

  // ✅ Add all selected items to the cart
  const addToCart = () => {
    orderItems.forEach((item) => {
      if (item.quantity > 0) {
        cart.addItem({
          item: productInfo,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        });
      }
    });

    setOrderItems(orderItems.map((item) => ({ ...item, quantity: minOrderQty })));
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
      {/* Product Title & Wishlist */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{productInfo.title}</h1>
        <HeartFavorite product={productInfo} />
      </div>

      {/* Category */}
      <div className="text-gray-600">
        <strong>Category:</strong> {productInfo.category}
      </div>

      {/* Price Updates Based on Quantity Range */}
      <p className="text-2xl font-extrabold text-blaze-orange">
        ৳ {selectedPrice} <span className="text-sm text-gray-500">per unit</span>
      </p>

      {/* ✅ Show Discount Info */}
      {isDiscountApplied && (
        <p className="text-green-600 text-lg font-semibold">
          You are saving ৳ {discount} per unit!
        </p>
      )}

      {/* Quantity Pricing Table */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-lg font-semibold text-gray-800">Quantity Pricing (BDT):</p>
        <ul className="mt-2 text-gray-700">
          {productInfo.quantityPricing?.ranges?.map((range, index) => (
            <li key={index} className="flex justify-between text-sm border-b py-2">
              <span>
                {range.minQuantity} - {range.maxQuantity || '∞'} units
              </span>
              <span className="font-bold text-blue-600">৳ {range.price.bdt} per unit</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <p className="text-gray-700">{productInfo.description}</p>

      {/* Product Variants Table */}
      <div className="overflow-x-auto">
        <table className="w-full rounded-lg border">
          <thead className="bg-gray-100 text-sm uppercase text-gray-700">
            <tr>
              <th className="p-3 text-left">Color</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={item.color} className="border-t">
                {/* Color Image */}
                <td className="flex items-center gap-2 p-3">
                  <Image
                    src={item.color}
                    alt="Color Variant"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                </td>

                {/* Price Updates with Quantity */}
                <td className="p-3 text-gray-800">৳ {selectedPrice}</td>

                {/* Stock - (Assumed stock is dynamically managed) */}
                <td className="p-3 text-gray-600">Available</td>

                {/* Quantity Selector */}
                <td className="flex items-center justify-center gap-4 p-3">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                  >
                    <MinusCircle size={20} className="text-gray-700" />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                  >
                    <PlusCircle size={20} className="text-gray-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 pt-4 md:flex-row">
        <button
          className="w-full rounded-lg bg-blaze-orange py-3 text-lg font-bold text-white transition hover:bg-blaze-orange-600 md:w-1/2"
          onClick={addToCart}
          disabled={totalQuantity < minOrderQty}
        >
          Add To Cart
        </button>
        <button
          className="w-full rounded-lg bg-bondi-blue-600 py-3 text-lg font-bold text-white transition hover:bg-bondi-blue-700 md:w-1/2"
          onClick={addToCart}
          disabled={totalQuantity < minOrderQty}
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
