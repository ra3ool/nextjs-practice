import { HeaderMenu } from '@/components/header/header-menu';
import { routes } from '@/constants/routes.constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function SiteHeader({ className }: { className: string }) {
  return (
    <header className={cn('border-b select-none bg-background', className)}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href={routes.root} className="font-semibold tracking-tight">
          Store Project
        </Link>

        <HeaderMenu />
      </div>
    </header>
  );
}

export { SiteHeader };
