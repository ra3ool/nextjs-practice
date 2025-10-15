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
import { useState } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </CardTitle>
        <CardDescription>
          Enter your data below to {isLogin ? 'login' : 'create'} your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <AuthForm mode={isLogin ? 'login' : 'register'} />
      </CardContent>
    </Card>
  );
}
