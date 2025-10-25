import { routes } from '@/constants/routes.constants';
import Link from 'next/link';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] h-full">
      <aside className="border-r p-4 space-y-2">
        <nav className="space-y-1 text-sm sticky top-20">
          <h3 className="font-semibold text-xl">Dashboard</h3>
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
          <Link
            href={routes.dashboard.users.root}
            className="block hover:underline"
          >
            Users
          </Link>
          {/* TODO make dropdown for this nested routes */}
          <Link
            href={routes.dashboard.users.mock}
            className="block hover:underline"
          >
            Mock users
          </Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;
