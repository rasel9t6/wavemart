import React from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { getCollectionDetails } from '@/lib/actions';
import { ProductType } from '@/lib/types';

export default async function CollectionDetailsPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const collectionDetails = await getCollectionDetails(params.collectionId);
  const { title, description, thumbnail, products } = collectionDetails;
  console.log(products);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={thumbnail}
          fill
          alt={title}
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{title}</h1>
            <p className="max-w-2xl text-lg opacity-90">{description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Collection Stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Price Range</p>
            <p className="text-3xl font-bold text-gray-900">
              ৳{Math.min(...products.map((p: any) => p.price))} - ৳
              {Math.max(...products.map((p: any) => p.price))}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Products in Collection
          </h2>
          <div className="flex flex-wrap gap-5">
            {products.map((product: ProductType) => (
              <div
                key={product._id}
                className="transition duration-300 hover:scale-105"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
