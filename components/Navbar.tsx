'use client';
import useCart from '@/lib/hooks/useCart';
import { UserButton, useUser } from '@clerk/nextjs';
import { Search, ShoppingCart, Menu, CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState('');
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-custom-radial px-12 py-4 max-sm:px-6">
      <Link href="/" className="">
        <Image src="/bd-ship-mart-logo.svg" alt="logo" width={80} height={80} />
      </Link>

      <div className="flex gap-4 text-base-bold text-midnight-100 max-lg:hidden">
        <Link
          href="/"
          className={`transition-all duration-300 hover:text-midnight-200 ${pathname === '/' && 'text-white'}`}
        >
          Home
        </Link>
        <Link
          href={user ? '/wishlist' : '/sign-in'}
          className={`transition-all duration-300 hover:text-midnight-200 ${
            pathname === '/wishlist' && 'text-white'
          }`}
        >
          Wishlist
        </Link>
        <Link
          href={user ? '/orders' : '/sign-in'}
          className={`transition-all duration-300 hover:text-midnight-200 ${
            pathname === '/orders' && 'text-white'
          }`}
        >
          Orders
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1">
        <input
          className="px-3 py-1 outline-none max-sm:max-w-[120px]"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={query === ''}
          onClick={() => router.push(`/search/${query}`)}
        >
          <Search className="hover:text-red-1 size-6 text-midnight-500" />
        </button>
      </div>

      <div className="relative flex items-center gap-3">
        <Link
          href="/cart"
          className="flex items-center gap-3 rounded-lg border bg-white px-2 py-1 text-midnight-500 max-md:hidden"
        >
          <ShoppingCart />
          <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
        </Link>

        <Menu
          className="cursor-pointer text-white lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute right-5 top-12 flex flex-col gap-4 rounded-lg border bg-white p-3 text-base-bold text-midnight-500 lg:hidden">
            <Link href="/" className="hover:text-midnight">
              Home
            </Link>
            <Link
              href={user ? '/wishlist' : '/sign-in'}
              className="hover:text-midnight"
            >
              Wishlist
            </Link>
            <Link
              href={user ? '/orders' : '/sign-in'}
              className="hover:text-midnight"
            >
              Orders
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 rounded-lg border px-2 py-1 text-midnight-500 transition-all duration-300 hover:bg-midnight hover:text-white"
            >
              <ShoppingCart />
              <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
            </Link>
          </div>
        )}

        {user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in" className="text-white">
            <CircleUserRound />
          </Link>
        )}
      </div>
    </div>
  );
}
