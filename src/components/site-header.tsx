'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function SiteHeader({ className }: { className: string }) {
  const { data: session, status } = useSession();

  return (
    <header className={cn('border-b', className)}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Next Panel
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            About
          </Link>

          {status === 'loading' ? (
            <Button size="sm" disabled>
              Loading...
            </Button>
          ) : session ? (
            <Button
              size="sm"
              variant="outline"
              className="bg-red-200"
              onClick={() => signOut({ callbackUrl: '/auth' })}
            >
              Logout
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
