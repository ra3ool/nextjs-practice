import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'About',
};

function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">About Us</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This app is built with Next.js. 🚀
      </p>
    </div>
  );
}

export { metadata };
export default AboutPage;
