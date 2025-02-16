// app/categories/[categoryId]/[subcategoryId]/page.tsx
import React from 'react';
import { getSubcategoryDetails } from '@/lib/actions';
import { ProductType } from '@/lib/types';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    categoryId: string;
    subcategoryId: string;
  };
}

export default async function SubcategoryDetailsPage({ params }: PageProps) {
  // Add error handling
  if (!params.categoryId || !params.subcategoryId) {
    notFound();
  }

  try {
    const subcategoryDetails = await getSubcategoryDetails(
      params.categoryId,
      params.subcategoryId,
    );

    const { title, description, thumbnail, products, name } =
      subcategoryDetails;

    return (
      <div className="px-2 pt-20 sm:px-5 sm:pt-28">
        <CategoryHero
          title={title}
          description={description}
          thumbnail={thumbnail}
          products={products}
        />

        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-4 sm:py-12">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
              {name} Collection
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products?.map((product: ProductType) => (
                <div
                  key={product._id}
                  className="transition duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SubcategoryDetailsPage:', error);
    notFound();
  }
}
