import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Dashboard',
};

function DashboardHome() {
  return <h1 className="text-xl font-bold">Dashboard Home</h1>;
}

export { metadata };
export default DashboardHome;
