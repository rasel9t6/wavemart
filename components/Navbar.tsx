'use client';
import useCart from '@/lib/hooks/useCart';
import { UserButton, useUser } from '@clerk/nextjs';
import { Search, ShoppingCart, Menu, CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

// Navigation links data
const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/wishlist', label: 'Wishlist' },
  { path: '/orders', label: 'Orders' },
];

// Separate components for better organization
const SearchBar = ({ query, setQuery, onSearch }: any) => (
  <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1">
    <input
      className="px-3 py-1 outline-none max-sm:max-w-[120px]"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <button disabled={query === ''} onClick={onSearch}>
      <Search className="size-6 cursor-pointer text-bondi-blue-600 transition-colors duration-300 hover:text-bondi-blue-400" />
    </button>
  </div>
);

const NavLinks = ({ pathname, user }: any) => (
  <div className="flex gap-4 text-base-bold text-bondi-blue-100 max-lg:hidden">
    {NAV_LINKS.map(({ path, label }) => (
      <Link
        key={path}
        href={user ? path : '/sign-in'}
        className={`transition-all duration-300 hover:text-bondi-blue-200 ${
          pathname === path && 'text-white'
        }`}
      >
        {label}
      </Link>
    ))}
  </div>
);

const CartButton = ({ cartItemsCount }: any) => (
  <Link
    href="/cart"
    className="flex items-center gap-3 rounded-lg border bg-white px-2 py-1 text-bondi-blue-600 transition-colors duration-300 hover:text-bondi-blue-400 max-sm:hidden"
  >
    <ShoppingCart />
    <p className="text-base-bold">Cart ({cartItemsCount})</p>
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = () => router.push(`/search/${query}`);

  return (
    <div className="fixed z-20 flex w-full items-center justify-between gap-5 bg-custom-radial px-12 py-2 sm:py-4">
      <Link href="/" className="relative">
        <Image
          src="/bd-ship-mart-logo.svg"
          alt="BD shipmart logo"
          width={80}
          height={80}
          sizes="(max-width: 640px) 50px, 80px "
        />
      </Link>

      <NavLinks pathname={pathname} user={user} />
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      <div className="relative flex items-center gap-3">
        <CartButton cartItemsCount={cart.cartItems.length} />

        <Menu
          className="hidden cursor-pointer text-white sm:block lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute right-5 top-12 flex w-28 flex-col gap-4 rounded-lg border bg-white p-3 text-base-bold text-bondi-blue-500 md:w-fit lg:hidden">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                href={user ? path : '/sign-in'}
                className="hover:text-bondi-blue"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border px-2 py-1 text-bondi-blue transition-all duration-300 hover:bg-bondi-blue hover:text-white sm:flex-row"
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
