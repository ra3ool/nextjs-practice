import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  'use client';

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Streaming Getting User</h1>
      <Suspense fallback={<p>Loading user...</p>}>
        <UserInfo />
      </Suspense>
    </div>
  );
}

async function UserInfo() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/2', {
    cache: 'no-store',
  });
  const user = await res.json();
  return <p>User: {user.name}</p>;
}
