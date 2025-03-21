'use client';
import ProductCard from '@/components/ProductCard';
import { getProductDetails } from '@/lib/actions';
import { ProductType, UserType } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { Loader } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function WishListPage() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  const getUser = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setSignedInUser(data);
      setLoading(false);
    } catch (err) {
      console.log('[users_GET', err);
    }
  };

  useEffect(() => {
    if (session?.user) {
      getUser();
    }
  }, [session]);

  const getWishlistProducts = useCallback(async () => {
    setLoading(true);

    if (!signedInUser) return;

    const wishlistProducts = await Promise.all(
      signedInUser.wishlist.map(async (productId) => {
        const res = await getProductDetails(productId);
        return res;
      }),
    );

    setWishlist(wishlistProducts);
    setLoading(false);
  }, [signedInUser]);

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts();
    }
  }, [signedInUser, getWishlistProducts]);

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="my-10 text-heading3-bold">Your Wishlist</p>
      {wishlist.length === 0 && <p>No items in your wishlist</p>}

      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        ))}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
