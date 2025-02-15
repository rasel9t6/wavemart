import { getCollections } from '@/lib/actions';
import CollectionsSlider from './CollectionSlider';

export default async function Collections() {
  const collections = await getCollections();
  return (
    <div className="mx-auto px-5 py-8 ">
      <h1 className="py-4 text-center text-heading1-bold font-bold text-bondi-blue">
        Categories
      </h1>
      <CollectionsSlider collections={collections} />
    </div>
  );
}
