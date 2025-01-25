import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home | Wavemart',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-neutral-100 text-neutral-900">
      <Navbar />
      {children}
    </main>
  );
}
