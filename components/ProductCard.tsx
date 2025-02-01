import Image from 'next/image';

import HeartFavorite from './HeartFavorite';
import Link from 'next/link';
import { ProductType, UserType } from '@/lib/types';
import { getCurrencyRate } from '@/lib/actions';
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
        className="flex flex-col gap-2 rounded-xl border border-custom-gray/20 p-3 transition-all duration-300"
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
          <p className="text-small-medium text-custom-gray">
            {product.category}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-body-bold">
            ৳
            {(product.price * (await getCurrencyRate())).toFixed(2) ||
              product.price * 17.5}
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
