import { StepsType } from '@/types/cart.type';

export const CART_STEPS_INFO = [
  { name: 'cart', label: 'Cart Table', link: '/cart' },
  {
    name: 'shipping',
    label: 'Shipping Address',
    link: '/cart/shipping-address',
  },
  { name: 'payment', label: 'Payment Method', link: '/cart/payment-method' },
  { name: 'review', label: 'Review Order', link: '/cart/review' },
] as const;

export const CART_STEPS_MAP = CART_STEPS_INFO.reduce((acc, step) => {
  acc[step.link] = step.name;
  return acc;
}, {} as Record<string, StepsType>);

export const PAYMENT_METHODS = ['PayPal', 'CashOnDelivery'];
