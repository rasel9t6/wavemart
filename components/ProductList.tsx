import { getProducts } from '@/lib/actions';
import ProductCard from './ProductCard';
import { ProductType } from '@/lib/types';

export default async function ProductList() {
  const products = await getProducts();


  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 py-8">
        <p className="text-heading1-bold text-bondi-blue">Products</p>
        <p className="text-body-bold text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 px-5 py-8">
      <p className="text-heading1-bold text-bondi-blue">Products</p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
        {products.map((product: ProductType) => (
          <div key={product._id} className="min-w-[200px] max-w-[250px] flex-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
