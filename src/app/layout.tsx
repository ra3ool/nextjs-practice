import { SiteHeader } from '@/components/site-header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Steps',
  description: 'Learning Next.js step by step',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
