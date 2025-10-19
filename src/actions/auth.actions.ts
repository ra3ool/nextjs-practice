'use client';

import { signIn } from '@/lib/auth-client';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import type { LoginType, RegisterType } from '@/types/auth.type';
import { toast } from 'sonner';

export const loginAction = async (input: LoginType) => {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    toast.error(parsed.error.issues[0]?.message || 'Invalid login data');
    return { success: false };
  }

  const data: LoginType = parsed.data;

  const res = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (res?.ok) {
    toast.success('Welcome back!');
    return { success: true };
  }

  toast.error(
    res?.error === 'CredentialsSignin'
      ? 'Invalid email or password'
      : 'Something went wrong. Please try again.',
  );

  return { success: false };
};

export const registerAction = async (input: RegisterType) => {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    toast.error(parsed.error.issues[0]?.message || 'Invalid registration data');
    return { success: false };
  }

  const data: RegisterType = parsed.data;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json();
    toast.error(result.error || 'Registration failed');
    return { success: false };
  }

  toast.success('Account created successfully!');

  // Auto-login after registration
  return loginAction(data);
};
