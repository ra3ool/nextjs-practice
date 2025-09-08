import { authOptions } from '@/app/api/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard Home</h1>
      <p>Welcome back, {session?.user?.name}!</p>
      <p>Email: {session?.user?.email}</p>
    </div>
  );
}
