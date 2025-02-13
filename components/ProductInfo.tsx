'use client';
import useCart from '@/lib/hooks/useCart';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import HeartFavorite from './HeartFavorite';
import { ProductType } from '@/lib/types';

type OrderItem = {
  color: string;
  size: string;
  quantity: number;
};

export default function ProductInfo({
  productInfo,
}: {
  productInfo: ProductType;
}) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const cart = useCart();

  // Minimum total order quantity across all combinations
  const MIN_TOTAL_QUANTITY = 5;

  // Calculate total quantity across all combinations
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const addNewOrderItem = () => {
    if (productInfo.colors.length === 0 || productInfo.sizes.length === 0)
      return;

    setOrderItems([
      ...orderItems,
      {
        color: productInfo.colors[0],
        size: productInfo.sizes[0],
        quantity: 1,
      },
    ]);
  };

  const updateOrderItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number,
  ) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOrderItems(updatedItems);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const addToCart = () => {
    orderItems.forEach((item) => {
      cart.addItem({
        item: productInfo,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });
    });

    // Clear order items after adding to cart
    setOrderItems([]);
  };

  return (
    <div className="flex max-w-full flex-1 flex-col gap-6 p-6">
      {/* Title & Wishlist */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 transition-colors hover:text-gray-700">
          {productInfo.title}
        </h1>
        <HeartFavorite product={productInfo} />
      </div>

      {/* Category */}
      <div className="flex items-center gap-3">
        <p className="text-base font-medium text-gray-500">Category:</p>
        <p className="text-lg font-semibold text-gray-900">
          {productInfo.category}
        </p>
      </div>

      {/* Price */}
      <p className="animate-fade-in text-2xl font-extrabold text-blaze-orange">
        ৳ {productInfo.price.bdt}
      </p>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium text-gray-500">Description:</p>
        <p className="text-sm leading-relaxed text-gray-700">
          {productInfo.description}
        </p>
      </div>

      {/* Minimum Order Quantity Notice */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">
          Minimum total order: {MIN_TOTAL_QUANTITY} pieces (across all
          combinations)
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Current total: {totalQuantity} pieces
          {totalQuantity < MIN_TOTAL_QUANTITY &&
            ` (${MIN_TOTAL_QUANTITY - totalQuantity} more needed)`}
        </p>
      </div>

      {/* Order Items */}
      <div className="flex flex-col gap-4">
        {orderItems.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Item #{index + 1}</h3>
              <button
                onClick={() => removeOrderItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="size-5" />
              </button>
            </div>

            {/* Color Selection */}
            <div className="mb-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-500">Color:</p>
              <div className="flex flex-wrap gap-2">
                {productInfo.colors.map((color) => (
                  <button
                    key={color}
                    className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all duration-200 ${
                      item.color === color
                        ? 'border-black shadow-lg'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => updateOrderItem(index, 'color', color)}
                  >
                    <div
                      className="size-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-500">Size:</p>
              <div className="flex flex-wrap gap-2">
                {productInfo.sizes.map((size) => (
                  <button
                    key={size}
                    className={`rounded-lg border px-3 py-1.5 transition-all duration-200 ${
                      item.size === size
                        ? 'bg-black text-white shadow-md'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => updateOrderItem(index, 'size', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-500">Quantity:</p>
              <div className="flex items-center gap-4">
                <MinusCircle
                  className="size-5 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-bondi-blue"
                  onClick={() =>
                    item.quantity > 1 &&
                    updateOrderItem(index, 'quantity', item.quantity - 1)
                  }
                />
                <p className="w-10 text-center text-base font-bold text-gray-900">
                  {item.quantity}
                </p>
                <PlusCircle
                  className="size-5 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-bondi-blue"
                  onClick={() =>
                    updateOrderItem(index, 'quantity', item.quantity + 1)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Item Button */}
        <button
          onClick={addNewOrderItem}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + Add Another Color/Size Combination
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 pt-4">
        <button
          className="w-full rounded-lg bg-blaze-orange py-4 text-lg font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blaze-orange-600 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => addToCart()}
          disabled={
            orderItems.length === 0 || totalQuantity < MIN_TOTAL_QUANTITY
          }
        >
          Add To Cart
        </button>
        <button
          className="w-full rounded-lg bg-bondi-blue-600 py-4 text-lg font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-bondi-blue hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => addToCart()}
          disabled={
            orderItems.length === 0 || totalQuantity < MIN_TOTAL_QUANTITY
          }
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
