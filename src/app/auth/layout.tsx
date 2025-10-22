import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Login',
};

function AuthPage({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center p-8">{children}</div>;
}

export { metadata };
export default AuthPage;
