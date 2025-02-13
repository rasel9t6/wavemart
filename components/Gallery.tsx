'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery({ productMedia }: { productMedia: string[] }) {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % productMedia.length;
    setCurrentIndex(newIndex);
    setMainImage(productMedia[newIndex]);
  };

  const handlePrev = () => {
    const newIndex =
      (currentIndex - 1 + productMedia.length) % productMedia.length;
    setCurrentIndex(newIndex);
    setMainImage(productMedia[newIndex]);
  };

  return (
    <div className="flex size-full flex-1  flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 lg:size-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative size-full"
          >
            <Image
              src={mainImage}
              fill
              alt="product"
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {productMedia.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {productMedia.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMainImage(image);
              setCurrentIndex(index);
            }}
            className="relative min-w-[100px]"
          >
            <div className="relative aspect-square w-24 overflow-hidden rounded-lg lg:w-28">
              <Image
                src={image}
                fill
                alt={`Product thumbnail ${index + 1}`}
                className="object-cover"
                sizes="(max-width: 768px) 96px, 112px"
              />
            </div>
            {mainImage === image && (
              <motion.div
                layoutId="selectedBorder"
                className="absolute inset-0 rounded-lg border-2 border-black"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
