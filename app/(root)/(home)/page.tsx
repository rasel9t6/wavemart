import Categories from '@/components/Categories';
import ImageSlider from '@/components/ImageSlider';
import ProductList from '@/components/ProductList';

export default function Home() {
  return (
    <>
      <div className="container mx-auto overflow-hidden px-5 pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          {/* Main large slider - Takes ~70% width */}
          <div className="w-full lg:w-[70%]">
            <div className="relative w-full">
              <ImageSlider />
            </div>
          </div>

          {/* Right column with two smaller sliders - Takes ~30% width */}
          <div className="flex w-full flex-col justify-between gap-4 max-md:hidden lg:w-[30%]">
            <div className="relative w-full">
              <ImageSlider hideControls={true} />
            </div>
            <div className="relative w-full">
              <ImageSlider hideControls={true} />
            </div>
          </div>
        </div>
      </div>
      <Categories />
      
      <ProductList />
    </>
  );
}
export const dynamic = 'force-dynamic';
