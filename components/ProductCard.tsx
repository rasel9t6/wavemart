'use client';
import Image from 'next/image';

import HeartFavorite from './HeartFavorite';
import Link from 'next/link';
interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}
export default function ProductCard({
  product,
  updateSignedInUser,
}: ProductCardProps) {
  return (
    <>
      <Link
        href={`/products/${product._id}`}
        className="flex flex-col gap-2 rounded-xl border border-custom-gray/20 p-3 transition-all duration-300 "
      >
        <Image
          src={product.media[0]}
          alt="product"
          width={120}
          height={100}
          className="rounded-lg border object-cover"
        />
        <div>
          <p className="text-base-bold">{product.title}</p>
          <p className="text-grey-2 text-small-medium ">{product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-body-bold ">৳{product.price}</p>
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        </div>
      </Link>
    </>
  );
}
