/* eslint-disable no-undef */
import { getCollections } from '@/lib/actions';

import Image from 'next/image';
import Link from 'next/link';

export default async function Collections() {
  const collections = await getCollections();
  return (
    <div className="grid grid-cols-1 gap-8 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 ">
      {!collections || collections.length === 0 ? (
        <p className="col-span-4 text-body-bold">No collections found</p>
      ) : (
        collections.map((collection: CollectionType) => (
          <Link
            href={`/collections/${collection._id}`}
            key={collection._id}
            className="mx-auto space-y-2"
          >
            <Image
              width="375"
              height="375"
              src="https://img.icons8.com/3d-fluency/750/jewelry.png"
              alt="jewelry"
            />
            {/* <div className="relative h-[200px] w-[350px]">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                sizes="100%"
                className="cursor-pointer rounded-lg object-cover"
              />
            </div> */}
            <p className="text-body-bold">{collection.title}</p>
          </Link>
        ))
      )}
    </div>
  );
}
