import Image from 'next/image';

import HeartFavorite from './HeartFavorite';
import Link from 'next/link';
import { ProductType, UserType } from '@/lib/types';
interface ProductCardProps {
  product: ProductType;
  // eslint-disable-next-line no-unused-vars
  updateSignedInUser?: (updatedUser: UserType) => void;
}

export default async function ProductCard({
  product,
  updateSignedInUser,
}: ProductCardProps) {
  return (
    <>
      <Link
        href={`/products/${product._id}`}
        className="group flex flex-col gap-2 rounded-xl border border-custom-gray/20 p-3 transition-all duration-300"
      >
        <div className="relative h-32 w-full overflow-hidden rounded-md border">
          <Image
            src={product.media[0]}
            alt="product"
            width={128}
            height={100}
            className="rounded-lg  object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <p className="text-base-bold">{product.title}</p>
          <p className="text-small-medium text-custom-gray">
            {product.category}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-body-bold text-blaze-orange">
            ৳{product.price.bdt}
          </p>
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        </div>
      </Link>
    </>
  );
}
