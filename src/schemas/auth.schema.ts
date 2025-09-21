import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(4, 'Full Name must be at least 4 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
