import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardHome() {
  return <h1 className="text-xl font-bold">Dashboard Home</h1>;
}
