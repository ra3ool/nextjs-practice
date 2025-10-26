'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { routes } from '@/constants/routes.constants';
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
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ToggleTheme } from './toggle-theme';

function HeaderMenu() {
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
        <Link href={routes.cart.root} className="flex items-center">
          <ShoppingCartIcon className="h-4 w-4" />
          Cart
        </Link>
      </Button>

      <NavAuthButtons />
    </>
  );
}

function NavAuthButtons() {
  const pathName = usePathname();
  const { data: session, status } = useSession();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
        <Link
          href={`${routes.auth.root}?callbackUrl=${pathName}`}
          className="flex items-center gap-2"
        >
          <UserIcon className="h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <>
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
              href={routes.dashboard.root}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400"
            onSelect={(e) => {
              e.preventDefault(); // Prevent dropdown from closing
              setShowLogoutDialog(true);
            }}
          >
            <LogOutIcon className="h-4 w-4 text-current" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You have to login again to access your dashboard
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => signOut()}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { HeaderMenu };
