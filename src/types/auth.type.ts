import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import { z } from 'zod';

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
