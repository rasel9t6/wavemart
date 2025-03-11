import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import React from 'react';
import ToasterProvider from '@/lib/providers/ToasterProvider';
import AuthProvider from '@/lib/providers/AuthProvider';

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
        <AuthProvider>
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
