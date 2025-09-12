'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  EllipsisVerticalIcon,
  Loader,
  LogOutIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ToggleTheme } from './toggle-theme';

export default function HeaderMenu() {
  const { data: session, status } = useSession();
  const nevContent = (
    <>
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
    </>
  );
  return (
    <>
      <nav className="hidden md:flex items-center gap-2">{nevContent}</nav>
      <nav className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <EllipsisVerticalIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>sidebar</SheetDescription>
            </SheetHeader>
            {nevContent}
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}
