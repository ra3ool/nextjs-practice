'use client';

import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

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
        <CardContent>{isLogin ? <LoginForm /> : <RegisterForm />}</CardContent>
      </Card>
    </div>
  );
}
