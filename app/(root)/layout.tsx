import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import React from 'react';
import LeftSidebarPage from './@leftSidebar/page';
import FooterPage from './@footer/page';

export const metadata: Metadata = {
  title: 'Home | BD Shipmart',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative bg-neutral-100 text-neutral-900">
        <div className="flex">
          <LeftSidebarPage />
          <section className="flex min-h-screen flex-1 flex-col overflow-hidden max-md:pb-14 sm:pt-14 md:pt-16">
            <div className="mx-auto w-full">{children}</div>
          </section>
        </div>
      </main>
      <FooterPage />
    </>
  );
}
