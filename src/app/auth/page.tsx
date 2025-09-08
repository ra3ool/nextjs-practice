'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (res?.ok) {
          toast.success('Welcome back!');
          router.push('/dashboard');
        } else if (res?.error) {
          if (res.error === 'CredentialsSignin') {
            toast.error('Invalid email or password');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
          toast.success('Account created! Logging you in...');
          await signIn('credentials', {
            email,
            password,
            callbackUrl: '/dashboard',
          });
        } else {
          const data = await res.json();
          toast.error(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Error in auth: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </CardTitle>
          <CardDescription>
            Enter your email below to {isLogin ? 'login' : 'create'} your
            account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* TODO use components ui later with validation */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Ati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Link
                    href=""
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            {isLogin ? 'Sign In' : 'Sign Up'} with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
