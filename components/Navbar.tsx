'use client';
import useCart from '@/lib/hooks/useCart';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, ShoppingCart, Menu, CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { FaHeart } from 'react-icons/fa6';
import { HiShoppingBag } from 'react-icons/hi2';
import toast from 'react-hot-toast';

// Navigation links data
const NAV_LINKS = [
  { path: '/wishlist', icon: <FaHeart size={24} />, label: 'Wishlist' },
  { path: '/orders', icon: <HiShoppingBag size={24} />, label: 'Orders' },
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

const NavLinks = ({ pathname, session }: any) => (
  <nav className="flex items-center justify-center gap-4 text-base-bold text-white max-lg:hidden">
    {NAV_LINKS.map(({ path, icon }) => (
      <Link
        key={path}
        href={session ? path : '/auth/signin'}
        className={`transition-all duration-300 hover:text-bondi-blue-400 ${
          pathname === path && 'text-white'
        }`}
      >
        {icon}
      </Link>
    ))}
  </nav>
);

const CartButton = ({ cartItemsCount }: any) => (
  <Link
    title="Cart"
    href="/cart"
    className="relative flex items-center  rounded-full  text-white  transition-all duration-300  max-sm:hidden"
  >
    <ShoppingCart className="size-6" />
    {cartItemsCount > 0 && (
      <span className="absolute -right-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full bg-blaze-orange-500 text-center text-xs font-bold">
        {cartItemsCount}
      </span>
    )}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart();
  const { data: session } = useSession();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [authDropdown, setAuthDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    const searchQuery = new URLSearchParams({ q: query }).toString();
    router.push(`/search?${searchQuery}`);
  };

  const handleCredentialLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        setAuthDropdown(false);
        setShowLoginForm(false);
        toast.success('Logged in successfully!');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong!');
      }

      toast.success('Registration successful! Please log in.');
      setShowRegisterForm(false);
      setShowLoginForm(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong!',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-bondi-blue-500 px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="Logo"
          className="rounded-full"
        />
        <span className="text-heading4-medium text-white max-sm:hidden">
          Wavemart
        </span>
      </Link>

      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

      <div className="relative flex items-center justify-center gap-3">
        <CartButton cartItemsCount={cart.cartItems.length} />
        <NavLinks pathname={pathname} session={session} />
        <Menu
          className="hidden cursor-pointer text-white sm:block lg:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />

        {dropdownMenu && (
          <div className="absolute right-5 top-12 flex w-28 flex-col gap-4 rounded-lg border bg-white p-3 text-base-bold text-bondi-blue-500 md:w-fit lg:hidden">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <Link
                key={path}
                href={session ? path : '/auth/signin'}
                className="flex items-center gap-1 hover:text-bondi-blue"
              >
                {icon}
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border px-2 py-1 text-bondi-blue transition-all duration-300 hover:bg-bondi-blue hover:text-white sm:flex-row"
            >
              <ShoppingCart />
              <p className="text-nowrap text-base-bold">
                Cart ({cart.cartItems.length})
              </p>
            </Link>
          </div>
        )}

        {session ? (
          <div className="flex items-center gap-2">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                width={32}
                height={32}
                alt={session.user.name || 'User'}
                className="rounded-full"
              />
            ) : (
              <CircleUserRound className="text-white" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-white hover:text-bondi-blue-400"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setAuthDropdown(!authDropdown)}
              className="flex items-center gap-2 text-white hover:text-bondi-blue-400"
            >
              <CircleUserRound />
              <span className="max-sm:hidden">Sign In</span>
            </button>

            {authDropdown && (
              <div className="absolute right-0 top-10 flex w-80 flex-col gap-2 rounded-lg border bg-white p-4 shadow-lg">
                {!showLoginForm && !showRegisterForm ? (
                  <>
                    <button
                      onClick={() => {
                        signIn('google', { callbackUrl: '/' });
                        setAuthDropdown(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:shadow-md"
                    >
                      <Image
                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                        width={20}
                        height={20}
                        alt="Google"
                      />
                      Sign in with Google
                    </button>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLoginForm(true)}
                      className="rounded-lg bg-bondi-blue-500 px-4 py-2 text-white transition-colors hover:bg-bondi-blue-600"
                    >
                      Sign in with Email
                    </button>
                    <button
                      onClick={() => setShowRegisterForm(true)}
                      className="rounded-lg border border-bondi-blue-500 px-4 py-2 text-bondi-blue-500 transition-colors hover:bg-bondi-blue-50"
                    >
                      Create Account
                    </button>
                  </>
                ) : showLoginForm ? (
                  <form
                    onSubmit={handleCredentialLogin}
                    className="flex flex-col gap-3"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Sign In
                    </h2>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-bondi-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-bondi-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-lg bg-bondi-blue-500 px-4 py-2 text-white transition-colors hover:bg-bondi-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLoginForm(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Back to options
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-3"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      Create Account
                    </h2>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-bondi-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-bondi-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        minLength={6}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-bondi-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-lg bg-bondi-blue-500 px-4 py-2 text-white transition-colors hover:bg-bondi-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegisterForm(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Back to options
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
