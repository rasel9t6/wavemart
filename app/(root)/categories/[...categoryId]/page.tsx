import React from 'react';
import { getCategoryDetails } from '@/lib/actions';
import { ProductType } from '@/lib/types';
import CategorySlider from '@/components/CategorySlider';
import CategoryHero from '@/components/CategoryHero';
import ProductCard from '@/components/ProductCard';

export default async function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string[] };
  }) {
  const categoryIdString = Array.isArray(params.categoryId)
    ? params.categoryId.join('/')
    : params.categoryId;
  const categoryDetails = await getCategoryDetails(categoryIdString);

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

      <div className="mx-auto max-w-7xl px-2 sm:px-4 ">
        {/* Only show CategorySlider if we have subcategories */}
        {subcategories?.length > 0 && (
          <CategorySlider
            items={subcategories}
            parentCategoryId={categoryIdString}
            currentCategoryId={undefined}
          />
        )}

        <div className="container mx-auto px-4 py-10">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-8 text-heading3-bold text-gray-900">
              {name} Collection
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {products && products.length > 0 ? (
                products.map((product: ProductType) => (
                  <div
                    key={product._id}
                    className="min-w-[200px] max-w-[250px] flex-1"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No related products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
