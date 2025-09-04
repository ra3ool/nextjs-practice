import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Welcome 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          I building a real-world Next.js app and learn a lot along this way
        </p>
        <div className="flex justify-center gap-3">
          <Button>Primary Action</Button>
          <Button variant="outline" asChild>
            <Link href="/playground">Try a component</Link>
          </Button>
        </div>
      </section>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>What’s next</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Routing: create /about and /dashboard pages</li>
            <li>SSR / SSG / ISR and data fetching</li>
            <li>Auth & DB (Auth.js + Prisma + MySQL)</li>
          </ol>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href="/about">Go to About</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
