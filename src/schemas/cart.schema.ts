import { PAYMENT_METHODS } from '@/constants/cart.constants';
import { z } from 'zod';

const decimalSchema = z
  .union([z.number().min(0), z.string().regex(/^\d+(\.\d{1,2})?$/)])
  .transform((val) => (typeof val === 'string' ? parseFloat(val) : val));

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
  stock: z.number().int().min(0).default(0),
  image: z.url().or(z.string().min(1)),
  price: decimalSchema.refine((val) => val >= 0, 'Price cannot be negative'),
});

export const insertCartSchema = z.object({
  sessionCartId: z.uuidv4(),
  userId: z.number().int().positive().optional().nullable(),
  items: z.array(cartItemSchema).default([]),
  itemsPrice: decimalSchema.default(0),
  taxPrice: decimalSchema.default(0),
  shippingPrice: decimalSchema.default(0),
  totalPrice: decimalSchema.default(0),
  paymentMethod: z.string().min(1).max(50),
});

export const cartResponseSchema = insertCartSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
});

export const shippingAddressSchema = z.object({
  id: z.number().optional(),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country name too long'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City name too long'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address too long'),
  postalCode: z
    .string()
    .regex(/^\d{10}$/, 'Invalid postal code format')
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string().regex(/^09\d{9}$/, 'Invalid phone number format'),
  isDefault: z.boolean(),
  // lat: z.string().optional(),
  // lng: z.string().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string(),
    discountCode: z
      .string()
      .min(5, 'Must be at least 5 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => PAYMENT_METHODS.map((method) => method.name).includes(data.type),
    {
      path: ['type'],
      error: 'Invalid payment method',
    },
  );

export const insertOrderSchema = z.object({
  userId: z.number(),
  shippingAddress: z.string(),
  paymentMethod: z
    .string()
    .refine((data) =>
      PAYMENT_METHODS.map((method) => method.name).includes(data),
    ),
  itemsPrice: decimalSchema.default(0),
  taxPrice: decimalSchema.default(0),
  shippingPrice: decimalSchema.default(0),
  totalPrice: decimalSchema.default(0),
});

export const insertOrderItemSchema = z.object({
  productId: z.number(),
  orderId: z.number(),
  qty: z.number(),
  price: decimalSchema.default(0),
});
