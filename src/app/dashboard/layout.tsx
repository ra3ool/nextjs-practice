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
          <Link href="/dashboard" className="block hover:underline">
            Home
          </Link>
          <Link href="/dashboard/profile" className="block hover:underline">
            Profile
          </Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
