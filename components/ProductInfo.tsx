'use client';
import useCart from '@/lib/hooks/useCart';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import HeartFavorite from './HeartFavorite';
import { OrderItemType, ProductType } from '@/lib/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import OrderModal from './order/OrderModal';
import toast from 'react-hot-toast'; // Import toast

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
  const cart = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ Extract minimum order quantity
  const minOrderQty = productInfo.minimumOrderQuantity || 1;

  // ✅ Initialize order items with color variants and ZERO quantity
  const [orderItems, setOrderItems] = useState<OrderItem[]>(
    productInfo.colors.map((color) => ({
      color,
      size: productInfo.sizes[0] || 'Default',
      quantity: 0,
    })),
  );

  // ✅ Calculate total quantity
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // ✅ First range price (default product price)
  const firstRangePrice =
    productInfo.quantityPricing?.ranges?.[0]?.price.bdt ||
    productInfo.price.bdt;

  // ✅ Get price based on total quantity
  const getPriceForQuantity = (quantity: number) => {
    const ranges = productInfo.quantityPricing?.ranges || [];

    // Default to base price
    let selectedPrice = firstRangePrice;

    // Loop through ranges to find the matching one
    for (const range of ranges) {
      if (
        quantity >= range.minQuantity &&
        (!range.maxQuantity || quantity <= range.maxQuantity)
      ) {
        selectedPrice = range.price.bdt;
        break; // Stop after finding the first matching range
      }
    }

    return selectedPrice;
  };

  // ✅ Get the updated price per unit based on quantity
  const selectedPrice = getPriceForQuantity(totalQuantity);

  // ✅ Discount Calculation - only if actually discounted
  const discount = firstRangePrice - selectedPrice;
  const totalDiscount = discount * totalQuantity;
  // ✅ Show discount only when there's an actual price difference
  const isDiscountApplied = discount > 0;

  // ✅ Update quantity safely - allow going down to zero
  const updateQuantity = (index: number, change: number) => {
    setOrderItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: Math.max(updatedItems[index].quantity + change, 0),
      };
      return updatedItems;
    });
  };

  // ✅ Handle manual quantity input - allow any positive number
  const handleQuantityInput = (index: number, value: string) => {
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 0) {
      setOrderItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: numValue,
        };
        return updatedItems;
      });
    }
  };

  // ✅ Add all selected items to the cart with minimum quantity validation
  const addToCart = () => {
    if (totalQuantity < minOrderQty) {
      toast.error(`Minimum order quantity is ${minOrderQty} units.`);
      return;
    }

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

    toast.success('Added to cart!');
    setOrderItems(orderItems.map((item) => ({ ...item, quantity: 0 })));
  };

  // ✅ Handle Order Now with minimum quantity validation
  const handleOrderNow = () => {
    if (totalQuantity < minOrderQty) {
      toast.error(`Minimum order quantity is ${minOrderQty} units.`);
      return;
    }

    addToCart(); // ✅ Adds to cart
    setTimeout(() => setIsModalOpen(true), 300); // ✅ Open modal with slight delay
  };

  // ✅ Show warning if total quantity is less than minimum ONLY when attempting to submit
  // ✅ Removed the useEffect warning since we want users to freely input any quantity

  const formattedOrderItems: OrderItemType[] = orderItems.map(
    (item, index) => ({
      _id: `${productInfo._id}-${index}`, // Generating a unique ID
      product: productInfo,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: selectedPrice,
      totalPrice: item.quantity * selectedPrice,
    }),
  );
  return (
    <motion.div
      className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Product Title & Wishlist */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">
          {productInfo.title}
        </h1>
        <HeartFavorite product={productInfo} />
      </motion.div>

      {/* SKU & Category */}
      <motion.div
        className="flex flex-col space-y-2 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <strong>SKU:</strong> {productInfo.sku || 'N/A'}
        </div>
        <div>
          <strong>Category:</strong> {productInfo.category.name}
        </div>
      </motion.div>

      {/* Price Updates Based on Quantity Range */}
      <motion.p
        className="text-2xl font-extrabold text-blaze-orange"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ৳ {selectedPrice}{' '}
        <span className="text-sm text-gray-500">per unit</span>
      </motion.p>

      {/* Minimum Order Notice */}
      <motion.div
        className="rounded-md bg-gray-100 p-3 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <strong>Minimum Order:</strong> {minOrderQty} units
      </motion.div>

      {/* ✅ Show Discount Info - With fixed height container to prevent layout shift */}
      <div className="h-8">
        <AnimatePresence>
          {isDiscountApplied && (
            <motion.p
              className="text-lg font-semibold text-green-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              Total savings: ৳ {totalDiscount} on {totalQuantity} units
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Quantity Pricing Table */}
      <div className="flex space-x-4">
        {productInfo.quantityPricing?.ranges?.map((range, index) => (
          <motion.div
            key={index}
            className="rounded-lg border p-4 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <p className="text-xl font-bold text-gray-900">
              ৳{range.price.bdt}
            </p>
            <p className="text-sm text-gray-600">
              {range.minQuantity}
              {range.maxQuantity ? `-${range.maxQuantity}` : '+'} Pcs
            </p>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <motion.p
        className="text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {productInfo.description}
      </motion.p>

      {/* Product Variants Table */}
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
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
              <motion.tr
                key={item.color}
                className="border-t"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
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

                {/* Quantity Selector with Manual Input */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <motion.button
                      onClick={() => updateQuantity(index, -1)}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                      whileTap={{ scale: 0.9 }}
                      disabled={item.quantity <= 0}
                    >
                      <MinusCircle
                        size={20}
                        className={`${item.quantity <= 0 ? 'text-gray-400' : 'text-gray-700'}`}
                      />
                    </motion.button>

                    {/* Manual input field */}
                    <motion.input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityInput(index, e.target.value)
                      }
                      className="w-16 appearance-none rounded-md border border-gray-300 p-1 text-center text-lg 
             font-semibold [-moz-appearance:textfield] 
             [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none"
                      min={0}
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                      whileFocus={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />

                    <motion.button
                      onClick={() => updateQuantity(index, 1)}
                      className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                      whileTap={{ scale: 0.9 }}
                    >
                      <PlusCircle size={20} className="text-gray-700" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col gap-4 pt-4 md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className={`w-full rounded-lg py-3 text-lg font-bold text-white transition md:w-1/2 ${
            totalQuantity < minOrderQty
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blaze-orange hover:bg-blaze-orange-600'
          }`}
          onClick={addToCart}
          disabled={totalQuantity < minOrderQty}
          whileHover={totalQuantity >= minOrderQty ? { scale: 1.03 } : {}}
          whileTap={totalQuantity >= minOrderQty ? { scale: 0.97 } : {}}
        >
          Add To Cart
        </motion.button>
        <motion.button
          className={`w-full rounded-lg py-3 text-lg font-bold text-white transition md:w-1/2 ${
            totalQuantity < minOrderQty
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-bondi-blue-600 hover:bg-bondi-blue-700'
          }`}
          onClick={handleOrderNow}
          disabled={totalQuantity < minOrderQty}
          whileHover={totalQuantity >= minOrderQty ? { scale: 1.03 } : {}}
          whileTap={totalQuantity >= minOrderQty ? { scale: 0.97 } : {}}
        >
          Order Now
        </motion.button>
      </motion.div>

      {/* Minimum Order Quantity Warning - Visual indicator */}
      {totalQuantity > 0 && totalQuantity < minOrderQty && (
        <motion.div
          className="mt-4 rounded-md bg-red-50 p-3 text-red-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          You must order at least {minOrderQty} units to place an order.
        </motion.div>
      )}

      {/* ✅ Order Modal */}
      {isModalOpen && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderItems={formattedOrderItems}
          totalQuantity={totalQuantity}
          selectedPrice={selectedPrice}
          totalDiscount={totalDiscount}
          productInfo={productInfo}
        />
      )}
    </motion.div>
  );
}
