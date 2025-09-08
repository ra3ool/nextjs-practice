import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function AuthPage({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center p-8">{children}</div>;
}
