import Collections from '@/components/Collections';
import ProductList from '@/components/ProductList';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className="flex gap-5">
        <Image
          src="/banner.png"
          width={2000}
          height={1000}
          alt="banner"
          className="col-span-2 sm:w-2/3"
        />
        <div className="flex flex-1 flex-col items-center justify-between gap-5 max-sm:hidden">
          <div className="size-full rounded-lg bg-bondi-blue-50/30 p-3">
            <p className="flex flex-col items-center text-center">
              <span>গ্লোবাল লজিস্টিক্স, প্রোডাক্ট সোর্সিং এবং অনলাইন শপিং</span>
              <span className="font-bold text-bondi-blue">সকল সেবা একসাথে</span>
            </p>
          </div>
          <div className="size-full rounded-lg bg-bondi-blue-50/30 p-3">
            <p className="flex flex-col items-center text-center">
              <span>
                ঢাকা ওয়্যারহাউজ অথবা সরাসরি আপনার ঠিকানায় হোম ডেলিভারি সেবা,
              </span>

              <span className="text-xl font-bold text-bondi-blue">
                দেশব্যাপি হোম ডেলিভারি
              </span>
            </p>
          </div>
        </div>
      </div>

      <Collections />
      <ProductList />
    </>
  );
}
export const dynamic = 'force-dynamic';
