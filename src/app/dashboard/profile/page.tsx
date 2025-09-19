import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You must be logged in to see this page.</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Profile Page</h1>
      <p>Welcome back, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
