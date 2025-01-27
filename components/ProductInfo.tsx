'use client';
import useCart from '@/lib/hooks/useCart';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import HeartFavorite from './HeartFavorite';
import { ProductType } from '@/lib/types';

export default function ProductInfo({
  productInfo,
}: {
  productInfo: ProductType;
}) {
  const [selectedColor, setSelectedColor] = useState<string>(
    productInfo.colors[0],
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    productInfo.sizes[0],
  );
  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();
  return (
    <div className="flex max-w-[400px] flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-heading3-bold">{productInfo.title}</p>
        <HeartFavorite product={productInfo} />
      </div>

      <div className="flex gap-2">
        <p className="text-base-medium text-custom-gray">Category:</p>
        <p className="text-base-bold">{productInfo.category}</p>
      </div>

      <p className="text-heading3-bold">$ {productInfo.price}</p>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-custom-gray">Description:</p>
        <p className="text-small-medium">{productInfo.description}</p>
      </div>

      {productInfo.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-custom-gray">Colors:</p>
          <div className="flex gap-2">
            {productInfo.colors.map((color, index) => (
              <p
                key={index}
                className={`cursor-pointer rounded-lg border border-black px-2 py-1 ${
                  selectedColor === color && 'bg-black text-white'
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </p>
            ))}
          </div>
        </div>
      )}

      {productInfo.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-custom-gray">Sizes:</p>
          <div className="flex gap-2">
            {productInfo.sizes.map((size, index) => (
              <p
                key={index}
                className={`cursor-pointer rounded-lg border border-black px-2 py-1 ${
                  selectedSize === size && 'bg-black text-white'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-custom-gray">Quantity:</p>
        <div className="flex items-center gap-4">
          <MinusCircle
            className="cursor-pointer hover:text-bondi-blue"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className="cursor-pointer hover:text-bondi-blue"
            onClick={() => setQuantity(quantity + 1)}
          />
        </div>
      </div>

      <button
        className="rounded-lg py-3 text-base-bold outline hover:bg-black hover:text-white"
        onClick={() => {
          cart.addItem({
            item: productInfo,
            quantity,
            color: selectedColor,
            size: selectedSize,
          });
        }}
      >
        Add To Cart
      </button>
    </div>
  );
}
