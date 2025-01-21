import { getCollections } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';

export default async function Collections() {
  const collections = await getCollections();
  return (
    <div className="mx-auto px-5 py-8">
      <h1 className="text pb-10 pt-4 text-center text-heading1-bold font-bold text-midnight">
        Collections
      </h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-5">
        {!collections || collections.length === 0 ? (
          <div className="col-span-full text-center">
            <Image
              src="/empty-state-icon.svg"
              alt="No collections found"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-lg mt-4 font-medium">No collections found</p>
          </div>
        ) : (
          collections.map((collection: CollectionType) => (
            <Link
              href={`/collections/${collection._id}`}
              key={collection._id}
              className="group flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl lg:flex-row"
              aria-label={`View collection ${collection.title}`}
            >
              <Image
                width={100}
                height={100}
                src={
                  `${collection.image}` ||
                  'https://img.icons8.com/3d-fluency/750/jewelry.png'
                }
                alt={`Image of ${collection.title}`}
                className="rounded-md"
              />
              <div className="text-center lg:text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  {collection.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {collection.products.length
                    ? `${collection.products.length} Products`
                    : 'No product'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
