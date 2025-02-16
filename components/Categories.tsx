import { getCategories } from '@/lib/actions';
import CategorySlider from './CategorySlider';

export default async function Categories() {
  const categories = await getCategories();
  return (
    <div className="mx-auto px-5 py-8 ">
      <h1 className="py-4 text-center text-heading1-bold font-bold text-bondi-blue">
        Categories
      </h1>
      <CategorySlider items={categories} />
    </div>
  );
}
