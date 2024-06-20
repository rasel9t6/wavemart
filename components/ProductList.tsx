import { getProducts } from "@/lib/actions";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default async function ProductList() {
  const products = await getProducts();
  return (
    <div className="flex flex-col items-center gap-10 px-5 py-8">
      <p className="text-heading1-bold">Products</p>
      {!products || products.length === 0 ? (
        <p className="text-body-bold">No products found.</p>
      ) : (
        <div className="mx-auto flex flex-wrap gap-16">
          {products.map((product: ProductType) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className={`flex w-[250px] flex-col gap-2 overflow-hidden rounded-lg p-2 duration-500 ease-in-out hover:scale-105 hover:border`}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
