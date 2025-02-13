import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import React from 'react';
import FooterPage from './@footer/page';

export const metadata: Metadata = {
  title: 'Home | BD Shipmart',
  description: 'E-Commerce store',
};
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <FooterPage />
    </>
  );
}
