import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/lib/types';

export default async function SearchPage({
  params,
}: {
  params: { query: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/search/${params.query}`,
  );
  const searchedProducts = await res.json();
  const decodedQuery = decodeURIComponent(params.query);
  return (
    <div className="px-10 py-5">
      <p className="my-10 text-heading3-bold">
        Search results for {decodedQuery}
      </p>
      {!searchedProducts ||
        (searchedProducts.length === 0 && (
          <p className="my-5 text-body-bold">No search result found</p>
        ))}
      <div className="flex flex-wrap justify-between gap-16">
        {searchedProducts?.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
