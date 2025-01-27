import ProductCard from '@/components/ProductCard';
import { getCollectionDetails } from '@/lib/actions';
import { ProductType } from '@/lib/types';
import Image from 'next/image';

export default async function CollectionDetailsPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const collectionDetails = await getCollectionDetails(params.collectionId);

  return (
    <div className="flex flex-col items-center gap-8 px-10 py-5">
      <Image
        src={collectionDetails.image}
        width={851}
        height={315}
        alt="collection"
        className="h-[400px] w-full rounded-xl"
      />
      <p className="text-heading3-bold text-custom-gray">
        {collectionDetails.title}
      </p>
      <p className="max-w-[900px] text-center text-body-medium text-custom-gray">
        {collectionDetails.description}
      </p>
      <div className="flex flex-wrap justify-center gap-16">
        {collectionDetails.products.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
