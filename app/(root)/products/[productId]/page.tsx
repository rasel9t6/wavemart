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
    <>
      <div className="container mx-auto px-4 pb-8 pt-24 md:pt-28">
        <div className="flex w-full gap-8 max-lg:flex-col max-lg:items-center">
          <Gallery productMedia={productDetails.media} />
          <ProductInfo productInfo={productDetails} />
        </div>
      </div>

      <div className="mt-16 flex w-full flex-col items-center">
        <p className="text-heading3-bold text-gray-900">Related Products</p>
        <div className="my-8 flex w-full flex-wrap items-center justify-center gap-5">
          {relatedProducts?.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
