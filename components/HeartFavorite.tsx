'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import React, { useState, useEffect, useCallback } from 'react';
import { ProductType, UserType } from '@/lib/types';

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

export default function HeartFavorite({
  product,
  updateSignedInUser,
}: HeartFavoriteProps) {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data: UserType = await res.json();

      if (data?.wishlist && Array.isArray(data.wishlist)) {
        setIsLiked(data.wishlist.includes(product._id));
      }
    } catch (err) {
      console.error('[users_GET]', err);
    } finally {
      setLoading(false);
    }
  }, [product._id]);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user, getUser]);

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        throw new Error('Failed to update wishlist');
      }

      const updatedUser: UserType = await res.json();
      setIsLiked(updatedUser.wishlist.includes(product._id));

      // Call the parent component's update function if provided
      if (updateSignedInUser) {
        updateSignedInUser(updatedUser);
      }
    } catch (err) {
      console.error('[wishlist_POST]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLike} disabled={loading}>
      {isLiked ? (
        <FaHeart
          fill="#00ABB3"
          size={20}
          className={loading ? 'animate-pulse' : ''}
        />
      ) : (
        <FaRegHeart fill="#00ABB3" size={20} />
      )}
    </button>
  );
}
