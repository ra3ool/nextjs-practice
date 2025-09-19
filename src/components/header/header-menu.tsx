'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut, useSession } from '@/lib/auth-client';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  LayoutDashboardIcon,
  Loader,
  LogOutIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ToggleTheme } from './toggle-theme';

export default function HeaderMenu() {
  return (
    <>
      <nav className="hidden md:flex items-center gap-2">
        <NavContent />
      </nav>
      <nav className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVerticalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigation options</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 w-full mt-4">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
}

function NavContent() {
  return (
    <>
      <ToggleTheme />

      <Button variant="ghost" asChild>
        <Link
          href="/cart"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ShoppingCartIcon className="h-4 w-4" />
          Cart
        </Link>
      </Button>

      <NavAuthButtons />
    </>
  );
}

function NavAuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button variant="ghost" disabled>
        <Loader className="h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (!session) {
    return (
      <Button asChild>
        <Link href="/auth" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          {session.user?.name || 'Account'}
          <ChevronDownIcon className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboardIcon className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/auth' })}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOutIcon className="h-4 w-4 text-current" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
