'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { LoginType, RegisterType } from '@/types/auth.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isLoading, setIsLoading] = useState(false);

  const schema = mode === 'login' ? loginSchema : registerSchema;

  const form = useForm<LoginType | RegisterType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const onSubmit = async (data: LoginType | RegisterType) => {
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const signInRes = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          toast.success('Welcome back!');
          router.push(callbackUrl || '/dashboard');
        } else {
          if (signInRes?.error === 'CredentialsSignin') {
            toast.error('Invalid email or password');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        }
      } else {
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (registerRes.ok) {
          toast.success('Account created successfully!');

          // Auto-login after successful registration
          const signInRes = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (signInRes?.ok) {
            toast.success('Welcome to the app!');
            router.push(callbackUrl || '/dashboard');
          } else {
            toast.error(
              'Account created but login failed. Please try signing in.',
            );
          }
        } else {
          const result = await registerRes.json();
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'register' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'register' && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading
            ? mode === 'login'
              ? 'Signing In...'
              : 'Creating Account...'
            : mode === 'login'
            ? 'Sign In'
            : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
