'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import React, { useState, useEffect, useCallback } from 'react';
import { ProductType, UserType } from '@/lib/types';

interface HeartFavoriteProps {
  product: ProductType;
  // eslint-disable-next-line no-unused-vars
  updateSignedInUser?: (user: UserType) => void;
}

export default function HeartFavorite({
  product,
  updateSignedInUser,
}: HeartFavoriteProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const user = await res.json();
      setIsLiked(user.wishlist.includes(product._id));
      setLoading(false);
    } catch (err) {
      console.log('[users_GET]', err);
      setLoading(false);
    }
  }, [product._id]);

  useEffect(() => {
    if (session) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [session, getUser]);

  const toggleWishlist = async () => {
    if (!session) {
      return router.push('/auth/signin');
    }

    try {
      const res = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle wishlist');
      }

      const updatedUser = await res.json();
      setIsLiked(!isLiked);

      if (updateSignedInUser) {
        updateSignedInUser(updatedUser);
      }
    } catch (err) {
      console.log('[wishlist_POST]', err);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleWishlist}
      className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 transition-colors duration-300 hover:bg-gray-100"
    >
      {isLiked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
    </button>
  );
}
