import { getProducts } from '@/lib/actions';
import ProductCard from './ProductCard';
import { ProductType } from '@/lib/types';

export default async function ProductList() {
  const products = await getProducts();
  return (
    <div className="flex flex-col items-center gap-10 px-5 py-8">
      <p className="text-heading1-bold text-bondi-blue">Products</p>
      {!products || products.length === 0 ? (
        <p className="text-body-bold">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-5">
          {products.map((product: ProductType) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      )}
    </div>
  );
}
