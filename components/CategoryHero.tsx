import React from 'react';
import Image from 'next/image';

interface CategoryHeroProps {
  title: string;
  description: string;
  thumbnail: string;
  products: any[];
}

export default function CategoryHero({
  title,
  description,
  thumbnail,
  products,
}: CategoryHeroProps) {

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full sm:h-[50vh] md:h-[60vh]">
        <Image
          src={thumbnail}
          fill
          alt={title}
          className="rounded-lg object-cover"
          priority
        />
        <div className="absolute inset-0 rounded-lg bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-2 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="line-clamp-3 max-w-2xl text-base opacity-90 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Collection Stats */}
      <div className=" grid grid-cols-1 gap-4  sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {products?.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <p className="text-sm text-gray-500">Price Range</p>
          {products && products.length > 0 ? (
            (() => {
              const validPrices = products
                .map((p: any) => p?.price?.bdt) // ✅ Check if price & price.bdt exist
                .filter((price) => typeof price === 'number'); // ✅ Remove undefined/null values

              return validPrices.length > 0 ? (
                <p className="text-nowrap text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                  ৳{Math.min(...validPrices)} - ৳{Math.max(...validPrices)}
                </p>
              ) : (
                <p className="text-nowrap text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                  No price available
                </p>
              );
            })()
          ) : (
            <p className="text-nowrap text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              No price available
            </p>
          )}
        </div>
      </div>
    </>
  );
}
