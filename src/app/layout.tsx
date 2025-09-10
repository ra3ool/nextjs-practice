import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });
const appName = process.env.APP_NAME || '';

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: 'Next.js Panel Practice',
  keywords: ['Next.js', 'React', 'Learning'],
  authors: [{ name: 'Rasool' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SiteHeader className="site-header" />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
