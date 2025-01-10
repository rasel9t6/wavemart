import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Wavemart | Authentication',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  );
}
