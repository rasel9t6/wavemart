'use client';
import React, { useState, useEffect, useRef } from 'react';
import { CategoryType } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface CategorySliderProps {
  items: CategoryType[];
  parentCategoryId?: string; // Optional parent category ID for subcategories
  currentCategoryId?: string; // Current category ID to highlight active item
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  items,
  parentCategoryId,
  currentCategoryId,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = 180;
 
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

  const showNavigation = items.length > itemsPerView;

  const nextSlide = () => {
    if (startIndex + itemsPerView < items.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  // Generate the correct href based on whether it's a category or subcategory
  const getItemHref = (item: CategoryType) => {
    if (parentCategoryId) {
      // For subcategories, include the parent category in the URL
      return `/categories/${parentCategoryId}/${item.slug}`;
    }
    // For main categories
    return `/categories/${item.slug}`;
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
          {items.map((item, index) => {
            const isActive = item._id === currentCategoryId;
            return (
              <Link
                href={getItemHref(item)}
                key={index}
                className={`group shrink-0 rounded-xl border p-3 transition-all duration-300 ${
                  isActive
                    ? 'border-bondi-blue bg-bondi-blue/5'
                    : 'border-custom-gray/20 hover:border-bondi-blue/30'
                }`}
                style={{ width: `${itemWidth}px` }}
              >
                <div className="flex items-start gap-2">
                  {/* Icon Section */}
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {item.icon ? (
                      <div className="relative size-full transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={item.icon}
                          alt={item.name}
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
                    <h3
                      className={`line-clamp-2 text-sm font-medium leading-tight transition-colors ${
                        isActive
                          ? 'text-bondi-blue'
                          : 'text-gray-900 group-hover:text-bondi-blue'
                      }`}
                    >
                      {item.name}
                    </h3>

                    <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                      <Package className="size-3 shrink-0" />
                      <span className="text-nowrap">
                        {item?.products?.length === 0 || !item?.products
                          ? 'No products'
                          : item?.products?.length === 1
                            ? '1 Product'
                            : `${item?.products?.length} Products`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
              disabled={startIndex + itemsPerView >= items.length}
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

export default CategorySlider;
