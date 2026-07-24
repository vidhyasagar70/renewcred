import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StoreProvider } from '@/store/provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'CMS Platform',
    template: '%s | CMS Platform',
  },
  description:
    'A production-ready Content Management System built with Next.js and Node.js.',
  keywords: ['CMS', 'Content Management', 'Next.js'],
  authors: [{ name: 'CMS Team' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white text-neutral-900 antialiased font-sans" suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
