import LeftSidebar from '@/components/LeftSidebar';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home | BD Shipmart',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative bg-neutral-100 text-neutral-900">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col pt-20 max-md:pb-14 sm:px-5 sm:pt-28 md:pt-36">
          <div className="mx-auto w-full">{children}</div>
        </section>
      </div>
    </main>
  );
}
