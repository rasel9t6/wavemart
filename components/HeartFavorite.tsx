'use client';
import { useUser } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useState, useEffect } from 'react';

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

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setIsLiked(data.wishlist.includes(product._id));
      setLoading(false);
    } catch (err) {
      console.log('[users_GET]', err);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push('/sign-in');
      } else {
        const res = await fetch('/api/users/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId: product._id }),
        });
        const updatedUser = await res.json();
        setIsLiked(updatedUser.wishlist.includes(product._id));
        updateSignedInUser && updateSignedInUser(updatedUser);
      }
    } catch (err) {
      console.log('[wishlist_POST]', err);
    }
  };
  return (
    <button onClick={handleLike}>
      {isLiked ? (
        <FaHeart fill="#00ABB3" size={20} />
      ) : (
        <FaRegHeart fill="#00ABB3" size={20} />
      )}
    </button>
  );
}
