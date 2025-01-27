'use client';

import useCart from '@/lib/hooks/useCart';
import Link from 'next/link';
import { useEffect } from 'react';

const SuccessfulPayment = () => {
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, [cart]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5">
      <p className="text-heading4-bold text-bondi-blue">Successful Payment</p>
      <p>Thank you for your purchase</p>
      <Link
        href="/"
        className="border p-4 text-base-bold hover:bg-black hover:text-white"
      >
        CONTINUE TO SHOPPING
      </Link>
    </div>
  );
};

export default SuccessfulPayment;
