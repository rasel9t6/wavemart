'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Gallery({ productMedia }: { productMedia: string[] }) {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  return (
    <div className="flex max-w-[500px] flex-col gap-3">
      <Image
        src={mainImage}
        width={500}
        height={500}
        alt="product"
        className="size-96 rounded-lg object-cover shadow-xl"
      />
      <div className="flex gap-2 overflow-auto scrollbar-hide">
        {productMedia.map((image, index) => (
          <Image
            key={index}
            src={image}
            height={200}
            width={200}
            alt="product"
            className={`size-20 cursor-pointer rounded-lg object-cover ${mainImage === image ? 'border-2 border-black' : ''}`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
}
