import { StepsType } from '@/types/cart.type';

export const CART_STEPS_INFO = [
  { name: 'cart', label: 'Cart Table', link: '/cart' },
  {
    name: 'shipping',
    label: 'Shipping Address',
    link: '/cart/shipping-address',
  },
  { name: 'payment', label: 'Payment Method', link: '/cart/payment-method' },
  { name: 'review', label: 'Review And Place Order', link: '/cart/review' },
] as const;

export const CART_STEPS_MAP = CART_STEPS_INFO.reduce((acc, step) => {
  acc[step.link] = step.name;
  return acc;
}, {} as Record<string, StepsType>);

export const PAYMENT_METHODS = [
  { name: 'PayPal', description: 'pay with all credit cards' },
  { name: 'Wallet', description: 'use your wallet charge to pay' },
  { name: 'CashOnDelivery', description: 'pay after you deliver the products' },
];
export const DEFAULT_PAYMENT_METHODS = 'PayPal';

export const freeShippingLimit = 100;
