'use client';
import useCart from '@/lib/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { MinusCircle, PlusCircle, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const total = cart.cartItems.reduce(
    (acc: number, cartItem: any) =>
      acc + cartItem.item.price * cartItem.quantity,
    0,
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    name: user?.fullName,
  };

  const handleCheckout = async () => {
    if (!user) {
      return router.push('/sign-in');
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart.cartItems, customer }),
      });
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout Error:', err);
    }
  };

  return (
    <div className="flex flex-col gap-10 p-6 lg:flex-row lg:px-10">
      {/* 🛒 Cart Items Section */}
      <div className="w-full lg:w-2/3">
        <h2 className="border-b border-gray-200 pb-4 text-xl font-semibold">
          Shopping Cart
        </h2>

        {cart.cartItems.length === 0 ? (
          <p className="py-6 text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {cart.cartItems.map((cartItem: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <Image
                    src={cartItem.item.media[0]}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                    alt="product"
                  />
                  <div>
                    <p className="text-lg font-medium">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-sm text-gray-500">
                        Color: {cartItem.color}
                      </p>
                    )}
                    {cartItem.size && (
                      <p className="text-sm text-gray-500">
                        Size: {cartItem.size}
                      </p>
                    )}
                    <p className="text-lg font-semibold text-blue-600">
                      ${cartItem.item.price}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <MinusCircle
                    className="cursor-pointer text-gray-500 transition hover:text-blue-500"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="text-lg font-medium">{cartItem.quantity}</p>
                  <PlusCircle
                    className="cursor-pointer text-gray-500 transition hover:text-blue-500"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                {/* Remove Button */}
                <Trash
                  className="cursor-pointer text-red-500 transition hover:text-red-600"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📋 Summary Section */}
      <div className="w-full rounded-lg bg-gray-100 p-6 shadow-md lg:w-1/3">
        <h3 className="border-b border-gray-300 pb-3 text-lg font-semibold">
          Summary{' '}
          <span className="text-gray-600">
            ({cart.cartItems.length} item{cart.cartItems.length !== 1 && 's'})
          </span>
        </h3>
        <div className="flex justify-between py-4 text-lg font-medium">
          <span>Total Amount</span>
          <span className="text-blue-600">৳ {totalRounded}</span>
        </div>
        <button
          className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
