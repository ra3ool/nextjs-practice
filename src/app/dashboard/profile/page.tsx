import { authOptions } from '@/lib/auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

const metadata: Metadata = {
  title: 'Profile',
};

async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-xl font-bold">Profile Page</h1>
      <p>Welcome back, {session!.user?.name}!</p>
      <p>Email: {session!.user?.email}</p>
    </div>
  );
}

export { metadata };
export default ProfilePage;
