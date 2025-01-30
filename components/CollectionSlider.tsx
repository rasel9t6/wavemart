'use client';
import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CollectionType } from '@/lib/types';
import { motion } from 'framer-motion';

interface CollectionsSliderProps {
  collections: CollectionType[];
}

const CollectionsSlider: React.FC<CollectionsSliderProps> = ({
  collections,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 4;
  const itemWidth = 260; // Adjust based on your card width
  const totalItems = collections.length;

  const nextSlide = useCallback(() => {
    if (startIndex + itemsPerView < totalItems) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  }, [startIndex, totalItems]);

  const previousSlide = useCallback(() => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  }, [startIndex]);

  return (
    <div className="relative w-full overflow-hidden px-3">
      {/* Previous Button */}
      {startIndex > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-0 top-1/2 z-30 -translate-y-1/2 p-2 rounded-full bg-bondi-blue/80 hover:bg-bondi-blue shadow-lg"
          onClick={previousSlide}
          aria-label="Previous collections"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="size-6 text-white" />
        </motion.button>
      )}

      {/* Next Button */}
      {startIndex + itemsPerView < totalItems && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 p-2 rounded-full bg-bondi-blue/80 hover:bg-bondi-blue shadow-lg"
          onClick={nextSlide}
          aria-label="Next collections"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="size-6 text-white" />
        </motion.button>
      )}

      {/* Slider Container */}
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex gap-4 transition-transform duration-300"
          style={{
            transform: `translateX(-${startIndex * itemWidth}px)`,
          }}
        >
          {collections.length === 0 ? (
            <div className="flex flex-1 flex-col items-center text-center">
              <Image
                src="/empty-state-icon.svg"
                alt="No collections found"
                width={200}
                height={200}
                className="mx-auto"
              />
              <p className="mt-4 text-lg font-medium">No collections found</p>
            </div>
          ) : (
            collections.map((collection: CollectionType) => (
              <div
                key={collection._id}
                className="flex-shrink-0"
                style={{ width: itemWidth }}
              >
                <Link
                  href={`/collections/${collection._id}`}
                  className="group flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
                  aria-label={`View collection ${collection.title}`}
                >
                  <Image
                    width={100}
                    height={100}
                    src={collection.image || '/placeholder-image.png'}
                    alt={`Image of ${collection.title}`}
                    className="rounded-md"
                  />
                  <div className="text-center">
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
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionsSlider;
