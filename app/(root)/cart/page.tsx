'use client';
import { useState } from 'react';
import useCart from '@/lib/hooks/useCart';
import {
  MinusCircle,
  PlusCircle,
  Trash,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import OrderModal from '@/components/order/OrderModal';
import { OrderItemType, ProductType } from '@/lib/types';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  const cart = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Calculate subtotal
  const subtotal = cart.cartItems.reduce(
    (acc: number, cartItem: any) =>
      acc + cartItem.item.price.bdt * cartItem.quantity,
    0,
  );
  const subtotalRounded = parseFloat(subtotal.toFixed(2));

  // Calculate total quantity
  const totalQuantity = cart.cartItems.reduce(
    (acc: number, cartItem: any) => acc + cartItem.quantity,
    0,
  );

  // Calculate discount (if applicable)
  const totalDiscount = 0; // You can implement discount logic here

  // Customer info from session
  const customer = {
    id: session?.user?.id,
    email: session?.user?.email,
    name: session?.user?.name,
  };

  // Create a single product info object that meets the ProductType requirements
  const productInfo: ProductType =
    cart.cartItems.length > 0
      ? {
          _id:
            cart.cartItems.length === 1
              ? cart.cartItems[0].item._id
              : 'multiple',
          sku:
            cart.cartItems.length === 1
              ? cart.cartItems[0].item.sku || 'N/A'
              : 'multiple',
          slug:
            cart.cartItems.length === 1
              ? cart.cartItems[0].item.slug || 'N/A'
              : 'multiple',
          title:
            cart.cartItems.length === 1
              ? cart.cartItems[0].item.title
              : 'Multiple Products',
          description: '',
          price: {
            bdt: subtotalRounded / totalQuantity,
            cny: 0,
            usd: 0,
          },
          expense: {
            bdt: 0,
            cny: 0,
            usd: 0,
          },
          media: [],
          category: { name: '' },
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          minimumOrderQuantity: 1,
          inputCurrency: 'CNY',
          quantityPricing: {
            ranges: [],
          },
          currencyRates: {
            usdToBdt: 121.5,
            cnyToBdt: 17.5,
          },
        }
      : {
          _id: 'empty',
          sku: 'N/A',
          slug: 'empty',
          title: 'No Products',
          description: '',
          price: {
            bdt: 0,
            cny: 0,
            usd: 0,
          },
          expense: {
            bdt: 0,
            cny: 0,
            usd: 0,
          },
          media: [],
          category: { name: '' },
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          minimumOrderQuantity: 1,
          inputCurrency: 'CNY',
          quantityPricing: {
            ranges: [],
          },
          currencyRates: {
            usdToBdt: 121.5,
            cnyToBdt: 17.5,
          },
        };

  // Prepare order items with correct type structure
  const orderItems: OrderItemType[] = cart.cartItems.map((cartItem: any) => ({
    _id: cartItem.item._id, // Changed from *id to _id to match OrderItemType
    product: {
      _id: cartItem.item._id, // Changed from *id to _id to match ProductType
      sku: cartItem.item.sku || 'N/A',
      slug: cartItem.item.slug || 'N/A',
      title: cartItem.item.title,
      description: cartItem.item.description || '',
      media: cartItem.item.media || [],
      category: {
        name:
          typeof cartItem.item.category === 'string'
            ? cartItem.item.category
            : cartItem.item.category?.name || '',
        _id:
          typeof cartItem.item.category === 'string'
            ? ''
            : cartItem.item.category?._id,
      },
      collections: [], // Required by ProductType
      tags: cartItem.item.tags || [],
      price: {
        bdt: cartItem.item.price?.bdt || 0,
        cny: cartItem.item.price?.cny || 0,
        usd: cartItem.item.price?.usd || 0,
      },
      expense: {
        bdt: cartItem.item.expense?.bdt || 0,
        cny: cartItem.item.expense?.cny || 0,
        usd: cartItem.item.expense?.usd || 0,
      },
      sizes: cartItem.item.sizes || [],
      colors: cartItem.item.colors || [],
      createdAt: cartItem.item.createdAt || new Date().toISOString(),
      updatedAt: cartItem.item.updatedAt || new Date().toISOString(),
      minimumOrderQuantity: cartItem.item.minimumOrderQuantity || 1,
      inputCurrency: cartItem.item.inputCurrency || 'CNY',
      quantityPricing: cartItem.item.quantityPricing || {
        ranges: [],
      },
      currencyRates: cartItem.item.currencyRates || {
        usdToBdt: 121.5,
        cnyToBdt: 17.5,
      },
      // Removed discount as it's not in ProductType
    },
    color: cartItem.color,
    size: cartItem.size,
    quantity: cartItem.quantity,
    price: cartItem.item.price.bdt,
    totalPrice: cartItem.item.price.bdt * cartItem.quantity,
  }));

  // Handle checkout directly to payment gateway
  const handleDirectCheckout = async () => {
    if (!session?.user) {
      return router.push('/auth/signin');
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems: cart.cartItems, customer }),
        },
      );
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout Error:', err);
    }
  };

  // Handle checkout with custom order form
  const handleCustomCheckout = () => {
    if (!session?.user) {
      return router.push('/auth/signin');
    }
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart Items Section */}
          <div className="w-full lg:w-2/3">
            <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
              <h2 className="flex items-center gap-2 border-b border-gray-200 pb-4 text-xl font-semibold">
                <ShoppingBag className="size-5" />
                Your Items ({cart.cartItems.length})
              </h2>

              {cart.cartItems.length === 0 ? (
                <div className="space-y-4 py-10 text-center">
                  <p className="text-lg text-gray-500">Your cart is empty.</p>
                  <Link
                    className="mt-4 inline-block rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600"
                    href="/"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {cart.cartItems.map((cartItem: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 transition hover:border-blue-200 md:flex-row md:items-center"
                    >
                      {/* Product Info */}
                      <div className="mb-4 flex flex-col gap-4 md:mb-0 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">
                            {cartItem.item.title}
                          </div>
                          {cartItem.color && (
                            <span className="flex items-center">
                              <Image
                                src={cartItem.color}
                                alt="Color Variant"
                                width={30}
                                height={30}
                                className="rounded-lg"
                              />
                            </span>
                          )}
                          {cartItem.size && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-500">
                              Size: {cartItem.size}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-blue-600">
                          ৳ {cartItem.item.price.bdt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:gap-8">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            className="text-gray-400 transition hover:text-blue-500"
                            onClick={() =>
                              cart.decreaseQuantity(cartItem.item._id)
                            }
                            disabled={cartItem.quantity <= 1}
                          >
                            <MinusCircle className="size-5" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {cartItem.quantity}
                          </span>
                          <button
                            className="text-gray-400 transition hover:text-blue-500"
                            onClick={() =>
                              cart.increaseQuantity(cartItem.item._id)
                            }
                          >
                            <PlusCircle className="size-5" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="font-medium">
                          ৳{' '}
                          {(
                            cartItem.item.price.bdt * cartItem.quantity
                          ).toFixed(2)}
                        </div>

                        {/* Remove Button */}
                        <button
                          className="text-red-500 transition hover:text-red-600"
                          onClick={() => cart.removeItem(cartItem.item._id)}
                        >
                          <Trash className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="border-b border-gray-200 pb-4 text-lg font-semibold">
                Order Summary
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalQuantity} items)
                  </span>
                  <span>৳ {subtotalRounded}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ৳ {totalDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-100 pt-2 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ৳ {(subtotalRounded - totalDiscount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                  onClick={handleCustomCheckout}
                  disabled={cart.cartItems.length === 0}
                >
                  <Truck className="size-5" />
                  Custom Order
                </button>

                <button
                  className="w-full rounded-lg bg-gray-800 py-3 font-medium text-white transition hover:bg-gray-900"
                  onClick={handleDirectCheckout}
                  disabled={cart.cartItems.length === 0}
                >
                  Direct Checkout
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Truck className="size-4" />
                  <span>Shipping options available at checkout</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          orderItems={orderItems}
          totalQuantity={totalQuantity}
          selectedPrice={subtotalRounded / totalQuantity}
          totalDiscount={totalDiscount}
          productInfo={productInfo}
        />
      )}
    </div>
  );
}
