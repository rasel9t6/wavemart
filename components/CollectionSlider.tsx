'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CollectionType } from '@/lib/types';
import Link from 'next/link';

interface CollectionsSliderProps {
  collections: CollectionType[];
}

const CollectionsSlider: React.FC<CollectionsSliderProps> = ({
  collections,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = 170; // Increased width for better presentation
  useEffect(() => {
    const updateItemsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newItemsPerView = Math.floor(containerWidth / itemWidth);
        setItemsPerView(newItemsPerView);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const showNavigation = collections.length > itemsPerView;

  const nextSlide = () => {
    if (startIndex + itemsPerView < collections.length) {
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
      <div ref={containerRef}>
        <div
          className={`flex ${showNavigation ? 'transition-transform duration-300' : ''}`}
          style={
            showNavigation
              ? { transform: `translateX(-${startIndex * itemWidth}px)` }
              : undefined
          }
        >
          {collections.map((collection, index) => (
            <Link
              href={`/collections/${collection._id}`}
              key={index}
              className="group relative shrink-0 rounded-md px-3"
              style={{
                width: `${itemWidth}px`,
              }}
            >
              <div className="overflow-hidden">
                <div
                  className="relative h-[170px] overflow-hidden rounded-md transition-all duration-300 group-hover:scale-105 "
                  style={{
                    backgroundImage: `url("${collection.icon}")`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                  }}
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 transition-all duration-300 group-hover:opacity-90 group-hover:backdrop-blur group-hover:backdrop-brightness-50 group-hover:backdrop-contrast-200" />

                  {/* New badge */}
                  <div className="absolute left-4 top-4">
                    <div className="inline-flex items-center rounded-full border border-transparent bg-bondi-blue-500/50 px-2.5 py-0.5 text-xs font-semibold uppercase text-white backdrop-blur-sm transition-colors focus:outline-none focus:ring-2  focus:ring-bondi-blue  focus:ring-offset-2 group-hover:bg-bondi-blue">
                      New
                    </div>
                  </div>

                  {/* Content container */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="mb-2 text-xl font-bold leading-tight tracking-tight transition-colors duration-200 group-hover:text-bondi-blue-50">
                      {collection.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="inline-flex items-center space-x-1">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        <span>
                          {collection.products.length === 0
                            ? 'No products'
                            : collection.products.length === 1
                              ? '1 Product'
                              : `${collection.products.length} Products`}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          disabled={startIndex === 0}
          onClick={prevSlide}
          className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-xl bg-bondi-blue/30 p-2 pl-1 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pl-3"
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
        {/* {showNavigation && startIndex > 0 && (
        )} */}

        <button
          onClick={nextSlide}
          disabled={startIndex + itemsPerView >= collections.length}
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-xl bg-bondi-blue/30 p-2 pl-1 text-4xl text-white backdrop-blur-sm transition-[padding] hover:pr-3"
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
      </div>
    </div>
  );
};

export default CollectionsSlider;
