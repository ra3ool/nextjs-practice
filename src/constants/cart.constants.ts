import { StepsType } from '@/types/cart.type';
import { routes } from './routes.constants';

export const CART_STEPS_INFO = [
  { name: 'cart', label: 'Cart Table', link: routes.cart.root },
  {
    name: 'shipping',
    label: 'Shipping Address',
    link: routes.cart.shippingAddress,
  },
  { name: 'payment', label: 'Payment Method', link: routes.cart.paymentMethod },
  {
    name: 'review',
    label: 'Review And Place Order',
    link: routes.cart.placeOrder,
  },
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
