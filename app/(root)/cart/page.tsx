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
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem: any, index: number) => (
              <div
                key={index}
                className="hover:bg-gray-1 flex w-full items-center justify-between px-4 py-3 max-sm:flex-col max-sm:items-start max-sm:gap-3"
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
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-1 flex w-1/3 flex-col gap-8 rounded-lg px-4 py-5 max-lg:w-full">
        <p className="text-heading4-bold pb-4">
          Summary{' '}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? 'items' : 'item'
          })`}</span>
        </p>
        <div className="text-body-semibold flex justify-between">
          <span>Total Amount</span>
          <span>$ {totalRounded}</span>
        </div>
        <button
          className="text-body-bold w-full rounded-lg border bg-white py-3 hover:bg-black hover:text-white"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
