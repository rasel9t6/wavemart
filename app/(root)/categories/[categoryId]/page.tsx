import React from 'react';
import { getCategoryDetails } from '@/lib/actions';
import { ProductType } from '@/lib/types';
import CategorySlider from '@/components/CategorySlider';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';

export default async function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryDetails = await getCategoryDetails(params.categoryId);

  const { title, description, thumbnail, products, name, subcategories } =
    categoryDetails;

  return (
    <div className="px-2 pt-20 sm:px-5 sm:pt-28">
      <CategoryHero
        title={title}
        description={description}
        thumbnail={thumbnail}
        products={products}
      />

      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-4 sm:py-12">
        {/* Only show CategorySlider if we have subcategories */}
        {subcategories?.length > 0 && (
          <CategorySlider
            items={subcategories}
            parentCategoryId={params.categoryId}
            currentCategoryId={undefined}
          />
        )}

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
}
