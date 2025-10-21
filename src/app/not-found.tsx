import { Button } from '@/components/ui/button';
import { routes } from '@/constants/routes.constants';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full w-full">
      this page does not exist!
      <Button asChild>
        <Link href={routes.root}>go back to home page</Link>
      </Button>
    </div>
  );
}
