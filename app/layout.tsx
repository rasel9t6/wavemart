import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import ToasterProvider from '@/lib/providers/ToasterProvider';

const inter = Inter({ subsets: ['latin'] });
const notoSansBangla = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-notosansbangla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BD Shipmart & Global Logistics',
  description: 'E-Commerce store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansBangla.variable} ${inter.className}`}>
        <ClerkProvider>
          <ToasterProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
