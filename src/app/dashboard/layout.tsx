import { routes } from '@/constants/routes.constants';
import { canAccess } from '@/lib/acl';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user.type';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

const navigationItems = [
  {
    label: 'Home',
    href: routes.dashboard.root,
  },
  {
    label: 'Profile',
    href: routes.dashboard.profile,
  },
  {
    label: 'Addresses',
    href: routes.dashboard.addresses,
  },
  {
    label: 'Users',
    href: routes.dashboard.users.root,
  },
  {
    label: 'Mock users',
    href: routes.dashboard.users.mock,
  },
];

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  const filteredNavItems = navigationItems.filter((item) =>
    canAccess(item.href, userRole as UserRole),
  );

  return (
    <div className="grid grid-cols-[200px_1fr] h-full">
      <aside className="border-r p-4 space-y-2">
        <nav className="space-y-1 text-sm sticky top-20">
          <h3 className="font-semibold text-xl">Dashboard</h3>
          {/* TODO make nav hidden in small screen */}
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="p-6 overflow-auto">{children}</div>
    </div>
  );
}

export default DashboardLayout;
