'use client';
import React, { useState } from 'react';

import { CollectionType } from '@/lib/types';
import Link from 'next/link';

interface CollectionsSliderProps {
  collections: CollectionType[];
}

const CollectionsSlider: React.FC<CollectionsSliderProps> = ({
  collections,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemWidth = 270;

  const nextSlide = () => {
    if (startIndex + 3 < collections.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative overflow-hidden p-4">
      <div className="mx-auto max-w-6xl">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${startIndex * itemWidth}px)` }}
        >
          {collections.map((collection, index) => (
            <Link
              href={`/collections/${collection._id}`}
              key={index}
              className="relative shrink-0 cursor-pointer rounded-2xl bg-white shadow-md transition-all hover:scale-[1.015] hover:shadow-xl"
              style={{
                width: '220px',
                height: '220px',
                marginRight: '20px',
                backgroundImage: `url("${collection.image}")`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
              }}
            >
              <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-b from-black/90 via-black/60 to-black/0 p-6 text-white transition-[backdrop-filter] hover:backdrop-blur-sm">
                <span className="text-xs font-semibold uppercase text-bondi-blue-300">
                  New
                </span>
                <p className="my-2 text-3xl font-bold">{collection.title}</p>
                <p className="text-xs">
                  {collection.products.length === 0
                    ? 'No Products available'
                    : collection.products.length === 1
                      ? '1 Product'
                      : `${collection.products.length} Products`}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {startIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-bondi-blue/30 p-3 pl-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {startIndex + 3 < collections.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-bondi-blue/30 p-3 pr-2 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CollectionsSlider;
