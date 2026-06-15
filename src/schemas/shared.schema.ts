import { z } from 'zod';

export const decimalSchema = z
  .union([
    z.number().positive().max(999999999.99),
    z.string().regex(/^\d+(\.\d{1,2})?$/),
  ])
  .default(0)
  .transform((val) => (typeof val === 'string' ? parseFloat(val) : val));
