import { SiteHeader } from '@/components/header/the-header';
import { Toaster } from '@/components/ui/sonner';
import { AppProviders } from '@/contexts/app.context';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <SiteHeader className="site-header sticky top-0 z-10" />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </AppProviders>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
