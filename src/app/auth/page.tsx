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
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthForm } from './AuthForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </CardTitle>
        <CardDescription>
          Enter your email below to {isLogin ? 'login' : 'create'} your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <AuthForm
          mode={isLogin ? 'login' : 'register'}
          callbackUrl={callbackUrl}
        />
      </CardContent>
    </Card>
  );
}
