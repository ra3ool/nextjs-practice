import { StepsType } from '@/types/cart.type';

export const CART_STEPS_MAP: Record<string, StepsType> = {
  '/cart': 'cart',
  '/cart/shipping-address': 'shipping',
  '/cart/payment-method': 'payment',
  '/cart/review': 'review',
};

export const CART_STEPS_INFO = [
  { name: 'cart', label: 'Cart Table', link: '/cart' },
  {
    name: 'shipping',
    label: 'Shipping Address',
    link: '/cart/shipping-address',
  },
  { name: 'payment', label: 'Payment Method', link: '/cart/payment-method' },
  { name: 'review', label: 'Review Order', link: '/cart/review' },
];

export const CART_STEPS_LEVEL: Record<StepsType, number> = {
  '': 0,
  cart: 1,
  shipping: 2,
  payment: 3,
  review: 4,
};

export const PAYMENT_METHODS = ['PayPal', 'CashOnDelivery'];
