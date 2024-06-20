import { Heart } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }: { product: ProductType }) {
  return (
    <>
      <Image
        src={product.media[0]}
        alt={product.title}
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
      />
      <div>
        <p className="text-base-bold">{product.title}</p>
        <p className="text-small-medium text-gray-2">{product.category}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-body-bold">${product.price}</p>
        <button>
          <Heart />
        </button>
      </div>
    </>
  );
}
