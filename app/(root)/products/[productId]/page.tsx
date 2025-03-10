import Gallery from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import ProductInfo from '@/components/ProductInfo';
import { getProductDetails, getRelatedProducts } from '@/lib/actions';
import { ProductType } from '@/lib/types';

export default async function ProductDetailsPage({
  params,
}: {
  params: { productId: string };
}) {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);

  return (
    <main className="mt-16 pt-4 md:mt-20">
      {/* Product details section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start">
            {/* Gallery component - will take up half width on desktop */}
            <div className="w-full lg:w-1/2">
              <Gallery productMedia={productDetails.media} />
            </div>

            {/* Product info component - will take up half width on desktop */}
            <div className="w-full lg:w-1/2">
              <ProductInfo productInfo={productDetails} />
            </div>
          </div>
        </div>
      </div>

      {/* Related products section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex w-full flex-col items-center">
          <h2 className="mb-8 text-heading3-bold text-gray-900">
            Related Products
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((product: ProductType) => (
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
    </main>
  );
}
