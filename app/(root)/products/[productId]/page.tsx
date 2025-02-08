import Gallery from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import ProductInfo from '@/components/ProductInfo';
import { getProductDetails, getRelatedProducts } from '@/lib/actions';
import { ProductType } from '@/lib/types';
import RightSidebarPage from '../../@rightSidebar/page';

export default async function ProductDetailsPage({
  params,
}: {
  params: { productId: string };
}) {
  const productDetails = await getProductDetails(params.productId);
  const relatedProducts = await getRelatedProducts(params.productId);
  return (
    <>
      <div className="relative flex min-h-full justify-between">
        <div className="flex flex-1 flex-col pt-14 ">
          <div className="flex flex-1 items-start justify-between gap-16 px-5 py-10 max-lg:flex-col max-lg:items-center">
            <div className="flex flex-1 gap-16 max-md:flex-col max-md:items-center">
              <Gallery productMedia={productDetails.media} />
              <ProductInfo productInfo={productDetails} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-heading3-bold">Related Products</p>
            <div className="mx-auto my-8 flex flex-wrap items-center justify-center gap-5">
              {relatedProducts?.map((product: ProductType) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Fixed container for RightSidebar */}
        <div className="h-screen max-md:hidden">
          <RightSidebarPage />
        </div>
      </div>
    </>
  );
}
