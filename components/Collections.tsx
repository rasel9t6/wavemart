/* eslint-disable no-undef */
import { getCollections } from '@/lib/actions';

import Image from 'next/image';
import Link from 'next/link';

export default async function Collections() {
  const collections = await getCollections();
  return (
    <div className="flex flex-col items-center gap-10 px-5 py-8">
      <p className="text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {collections.map((collection: CollectionType) => (
            <Link
              href={`/collections/${collection._id}`}
              key={collection._id}
              className="space-y-2"
            >
              <div className="relative h-[200px] w-[350px]">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="100%"
                  className="cursor-pointer rounded-lg object-cover"
                />
              </div>
              <p className="text-body-bold">{collection.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
