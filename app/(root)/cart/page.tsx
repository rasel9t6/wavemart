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
    (acc: any, cartItem: any) => acc + cartItem.item.price * cartItem.quantity,
    0,
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        router.push('sign-in');
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
          method: 'POST',
          body: JSON.stringify({ cartItems: cart.cartItems, customer }),
        });
        const data = await res.json();
        window.location.href = data.url;
        console.log(data);
      }
    } catch (err) {
      console.log('[checkout_POST]', err);
    }
  };
  return (
    <div className="flex gap-20 px-10 py-16 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="border-b border-custom-gray/20 pb-6 text-heading3-bold">
          Shopping Cart
        </p>

        {cart.cartItems.length === 0 ? (
          <p className="py-3 text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem: any, index: number) => (
              <div
                key={index}
                className="flex w-full items-center justify-between px-4 py-3 hover:bg-custom-gray/20 max-sm:flex-col max-sm:items-start max-sm:gap-3"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="size-32 rounded-lg object-cover"
                    alt="product"
                  />
                  <div className="ml-4 flex flex-col gap-3">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">${cartItem.item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MinusCircle
                    className="cursor-pointer hover:text-bondi-blue"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="cursor-pointer hover:text-bondi-blue"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                <Trash
                  className="cursor-pointer hover:text-bondi-blue"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex w-1/3 flex-col gap-8 rounded-lg bg-custom-gray/20 px-4 py-5 max-lg:w-full">
        <p className="pb-4 text-heading4-bold">
          Summary{' '}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? 'items' : 'item'
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span className="text-bondi-blue">৳ {totalRounded}</span>
        </div>
        <button
          className="w-full rounded-lg border bg-bondi-blue-500 py-3 text-body-bold text-white transition-colors duration-300 hover:bg-bondi-blue-400 hover:text-bondi-blue-900"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
