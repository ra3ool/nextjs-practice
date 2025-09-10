'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader, LogOutIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ToggleTheme } from './toggle-theme';

export function SiteHeader({ className }: { className: string }) {
  const { data: session, status } = useSession();

  return (
    <header className={cn('border-b', className)}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Next Panel
        </Link>
        <nav className="flex items-center gap-2">
          <ToggleTheme />

          <Button variant="ghost" asChild>
            <Link
              href="/cart"
              className="flex gap-2  text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ShoppingCartIcon />
              Cart
            </Link>
          </Button>

          {status === 'loading' ? (
            <Button disabled>
              <Loader className="animate-spin" />
              Loading
            </Button>
          ) : session ? (
            <Button
              variant="outline"
              className="bg-red-200"
              onClick={() => signOut({ callbackUrl: '/auth' })}
            >
              <LogOutIcon />
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth">
                <UserIcon />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
