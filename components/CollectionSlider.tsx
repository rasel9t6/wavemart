'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CollectionType } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface CollectionsSliderProps {
  collections: CollectionType[];
}

const CollectionsSlider: React.FC<CollectionsSliderProps> = ({
  collections,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = 160; // Increased width to prevent overflow

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
          className={`flex gap-3 ${showNavigation ? 'transition-transform duration-300' : ''}`}
          style={
            showNavigation
              ? { transform: `translateX(-${startIndex * (itemWidth + 12)}px)` }
              : undefined
          }
        >
          {collections.map((collection, index) => (
            <Link
              href={`/collections/${collection.slug}`}
              key={index}
              className="group shrink-0 rounded-xl border border-custom-gray/20 p-3 transition-all duration-300"
              style={{ width: `${itemWidth}px` }}
            >
              <div className="flex items-start gap-2">
                {/* Icon Section */}
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {collection.icon ? (
                    <div className="relative size-full transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={collection.icon}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="size-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900 transition-colors group-hover:text-bondi-blue">
                    {collection.name}
                  </h3>

                  <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <Package className="size-3 shrink-0" />
                    <span className="truncate">
                      {collection?.products?.length === 0 ||
                      !collection?.products
                        ? 'No products'
                        : collection?.products?.length === 1
                          ? '1 Product'
                          : `${collection?.products?.length} Products`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              disabled={startIndex === 0}
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-lg bg-white/90 p-1.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:opacity-50"
            >
              <svg
                className="size-4"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={startIndex + itemsPerView >= collections.length}
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-lg bg-white/90 p-1.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:opacity-50"
            >
              <svg
                className="size-4"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionsSlider;
