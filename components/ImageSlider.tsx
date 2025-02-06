'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageSliderProps {
  images?: string[];
  autoPlayInterval?: number;
  initialPlayState?: boolean;
  hideControls?: boolean; // New prop to hide Chevron buttons
}
const images = [
  '/banner.webp',
  '/banner-1.webp',
  '/banner-2.webp',
  '/banner-3.webp',
  '/banner-4.webp',
  '/banner-5.webp',
];
const ImageSlider: React.FC<ImageSliderProps> = ({
  autoPlayInterval = 5000,
  initialPlayState = true,
  hideControls = false,
}) => {
  const [[currentIndex, direction], setPage] = useState<[number, number]>([
    0, 0,
  ]);
  const [isPlaying, setIsPlaying] = useState<boolean>(initialPlayState);

  const paginate = useCallback(
    (newDirection: number): void => {
      const newIndex =
        (currentIndex + newDirection + images.length) % images.length;
      setPage([newIndex, newDirection]);
    },
    [currentIndex],
  );

  useEffect(() => {
    let interval: any | null = null;
    if (isPlaying) {
      interval = setInterval(() => paginate(1), autoPlayInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, autoPlayInterval, paginate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number): number =>
    Math.abs(offset) * velocity;

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      const swipe = swipePower(info.offset.x, info.velocity.x);
      if (swipe < -swipeConfidenceThreshold) paginate(1);
      else if (swipe > swipeConfidenceThreshold) paginate(-1);
    },
    [paginate],
  );

  return (
    <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30, mass: 1.8 },
            opacity: { duration: 0.5 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 size-full cursor-grab object-cover"
        />
      </AnimatePresence>
      {!hideControls && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-4">
          <button
            className="rounded-full bg-bondi-blue/80 p-2 shadow-lg transition-all duration-300 hover:bg-bondi-blue"
            onClick={() => paginate(-1)}
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4 text-white lg:size-6" />
          </button>
          <button
            className="rounded-full bg-bondi-blue/80 p-2 shadow-lg hover:bg-bondi-blue"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <Pause className="size-4 text-white lg:size-6" />
            ) : (
              <Play className="size-4 text-white lg:size-6" />
            )}
          </button>
          <button
            className="rounded-full bg-bondi-blue/80 p-2 shadow-lg hover:bg-bondi-blue"
            onClick={() => paginate(1)}
            aria-label="Next slide"
          >
            <ChevronRight className="size-4 text-white lg:size-6" />
          </button>
        </div>
      )}
      <div
        className={`absolute left-1/2 z-10 flex -translate-x-1/2 space-x-2 ${
          hideControls ? 'bottom-4' : 'bottom-16'
        }`}
      >
        {images.map((_, index) => (
          <button
            key={index}
            className={`size-2 rounded-full ${
              currentIndex === index ? 'bg-bondi-blue-400' : 'bg-bondi-blue/50'
            }`}
            onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
