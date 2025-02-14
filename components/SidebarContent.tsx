'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SidebarContent({
  collections,
}: {
  collections: any[];
}) {
  const pathname = usePathname();
  console.log(collections.map((collection) => collection.subcategories));
  return (
    <div className="flex size-full flex-col gap-2">
      {collections.map((collection) => {
        const isActive = pathname === `/collections/${collection._id}`;
        return (
          <>
            <Link
              href={`/collections/${collection._id}`}
              key={collection._id}
              className={`flex items-center gap-2 text-nowrap p-2 text-sm font-medium leading-3 transition-colors duration-300 ${
                isActive
                  ? 'font-bold text-bondi-blue hover:text-bondi-blue-400'
                  : 'hover:text-bondi-blue-400'
              }`}
            >
              <Image
                src={collection.icon}
                alt={collection.title}
                width={20}
                height={20}
              />
              |<h1>{collection.name}</h1>
            </Link>
            {collection.subcategories.map((subcategory: any) => (
              <Link
                href={`/collections/${collection._id}/${subcategory._id}`}
                key={subcategory._id}
                className={`flex items-center gap-2 text-nowrap p-2 text-sm font-medium leading-3 transition-colors duration-300 ${
                  isActive
                    ? 'font-bold text-bondi-blue hover:text-bondi-blue-400'
                    : 'hover:text-bondi-blue-400'
                }`}
              >
                <Image
                  src={subcategory.icon}
                  alt={subcategory.title}
                  width={20}
                  height={20}
                />
                |<h1>{subcategory.name}</h1>
              </Link>
            ))}
          </>
        );
      })}
    </div>
  );
}
