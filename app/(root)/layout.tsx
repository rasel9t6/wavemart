import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home | Wavemart',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-neutral-light text-neutral-dark">
      <Navbar />
      {children}
      <div className="">
        <button className="hover:bg-primary-light bg-primary text-white">
          Add to Cart
        </button>
        <p className="text-secondary">Order placed successfully!</p>
        <span className="bg-accent text-neutral-dark">50% Off</span>
      </div>
    </main>
  );
}
