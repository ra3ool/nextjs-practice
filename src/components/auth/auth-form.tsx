'use client';

import { loginAction, registerAction } from '@/actions/auth.actions';
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
import { routes } from '@/constants/routes.constants';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import type { LoginType, RegisterType } from '@/types/auth.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

type AuthMode = 'login' | 'register';

function AuthForm({ mode }: { mode: AuthMode }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      }
    >
      <AuthFormContent mode={mode} />
    </Suspense>
  );
}

function AuthFormContent({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isLoading, setIsLoading] = useState(false);

  const schema = mode === 'login' ? loginSchema : registerSchema;

  const form = useForm<LoginType | RegisterType>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '', name: '' },
  });

  const onSubmit = async (data: LoginType | RegisterType) => {
    setIsLoading(true);
    try {
      const result =
        mode === 'login'
          ? await loginAction(data as LoginType)
          : await registerAction(data as RegisterType);

      if (result.success) {
        router.push(callbackUrl || routes.dashboard.root);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderInputs(mode, form, isLoading)}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          suppressHydrationWarning
        >
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

function renderInputs(
  mode: AuthMode,
  form: UseFormReturn<LoginType | RegisterType>,
  isLoading: boolean,
) {
  const fields = {
    login: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'm@example.com',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '********',
      },
    ],
    register: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'm@example.com',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '********',
      },
      {
        name: 'confirmPassword',
        label: 'Confirmation Password',
        type: 'password',
        placeholder: '********',
      },
    ],
  } as const;

  return fields[mode].map((field) => (
    <FormField
      key={field.name}
      control={form.control}
      name={field.name}
      render={({ field: rhfField }) => (
        <FormItem>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              disabled={isLoading}
              suppressHydrationWarning
              {...rhfField}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ));
}

export { AuthForm };
