import { cn } from '@/lib/utils';
import Link from 'next/link';
import { HeaderMenu } from './header-menu';

function SiteHeader({ className }: { className: string }) {
  return (
    <header className={cn('border-b select-none bg-background', className)}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Store Project
        </Link>

        <HeaderMenu />
      </div>
    </header>
  );
}

export { SiteHeader };
