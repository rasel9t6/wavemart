'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageSliderProps {
  images?: string[];
  autoPlayInterval?: number;
  initialPlayState?: boolean;
}

interface SlideVariants {
  [key: string]:
    | any
    | ((direction: number) => {
        x: number;
        opacity: number;
        zIndex?: number;
      });
  enter: (direction: number) => {
    x: number;
    opacity: number;
  };
  center: {
    zIndex: number;
    x: number;
    opacity: number;
  };
  exit: (direction: number) => {
    zIndex: number;
    x: number;
    opacity: number;
  };
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images = [
    '/banner.png',
    '/banner-1.png',
    '/banner-2.png',
    '/banner-3.png',
    '/banner-4.png',
    '/banner-5.png',
  ],
  autoPlayInterval = 5000,
  initialPlayState = true,
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
    [currentIndex, images.length],
  );

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        paginate(1);
      }, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, paginate]);

  const slideVariants: SlideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number): number => {
    return Math.abs(offset) * velocity;
  };

  const togglePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      const swipe = swipePower(info.offset.x, info.velocity.x);

      if (swipe < -swipeConfidenceThreshold) {
        paginate(1);
      } else if (swipe > swipeConfidenceThreshold) {
        paginate(-1);
      }
    },
    [paginate],
  );

  return (
    <div className="relative mx-auto  w-2/3 overflow-hidden rounded-lg bg-gray-100">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
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
          className="absolute size-full object-cover cursor-grab"
          alt={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0  bottom-4 z-10 flex items-center justify-center gap-4">
        <button
          className="rounded-full transition-all duration-300 bg-bondi-blue/80 p-2 shadow-lg hover:bg-bondi-blue"
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4 lg:size-6 text-white" />
        </button>

        <button
          className="rounded-full bg-bondi-blue/80 p-2 shadow-lg hover:bg-bondi-blue"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <Pause className="size-4 lg:size-6 text-white" />
          ) : (
            <Play className="size-4 lg:size-6 text-white" />
          )}
        </button>

        <button
          className="rounded-full bg-bondi-blue/80 p-2 shadow-lg hover:bg-bondi-blue"
          onClick={() => paginate(1)}
          aria-label="Next slide"
        >
          <ChevronRight className="size-4 lg:size-6 text-white" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`size-2 rounded-full ${
              currentIndex === index ? 'bg-bondi-blue-300' : 'bg-bondi-blue/50'
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
