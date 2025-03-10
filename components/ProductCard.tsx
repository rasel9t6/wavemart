import Image from 'next/image';
import Link from 'next/link';
import HeartFavorite from './HeartFavorite';
import { ProductType } from '@/lib/types';

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: any;
}
export default function ProductCard({
  product,
  updateSignedInUser,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* 🖼 Product Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <Image
          src={product?.media[0] ?? '/not-found.gif'}
          alt={product.title}
          fill
          className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 📌 Product Info */}
      <div className="flex flex-col">
        <p className="truncate text-lg font-semibold text-gray-800">
          {product.title}
        </p>
        <p className="text-sm text-gray-500">{product.category.name}</p>
      </div>

      {/* 💰 Price & Wishlist */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-blaze-orange">
          ৳{product.price.bdt}
        </p>
        {updateSignedInUser && (
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        )}
      </div>
    </Link>
  );
}
