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

  return (
    <div className="flex size-full flex-col gap-6">
      {collections.map((collection) => {
        const isActive = pathname === `/collections/${collection._id}`;
        return (
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
              src={collection.image}
              alt={collection.title}
              width={20}
              height={20}
            />
            |<h1>{collection.title}</h1>
          </Link>
        );
      })}
    </div>
  );
}
