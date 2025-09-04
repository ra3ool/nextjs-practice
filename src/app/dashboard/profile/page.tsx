import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return <h1 className="text-xl font-bold">Profile Page</h1>;
}
