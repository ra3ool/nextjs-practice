import { routes } from '@/constants/routes.constants';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[200px_1fr] h-full">
      <aside className="border-r p-4 space-y-2">
        <p className="font-semibold">Dashboard</p>
        <nav className="space-y-1 text-sm">
          <Link href={routes.dashboard.root} className="block hover:underline">
            Home
          </Link>
          <Link
            href={routes.dashboard.profile}
            className="block hover:underline"
          >
            Profile
          </Link>
          <Link
            href={routes.dashboard.addresses}
            className="block hover:underline"
          >
            Addresses
          </Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
