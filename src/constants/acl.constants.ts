import { UserRole } from '@/types/user.type';
import { roles } from './roles.constants';
import { routes } from './routes.constants';

export const AUTH_ROUTES = [routes.auth.root] as const;

export const PROTECTED_ROUTES = [
  routes.dashboard.root,
  routes.cart.shippingAddress,
  routes.cart.paymentMethod,
] as const;

export const ROUTE_ACCESS: Record<string, readonly UserRole[]> = {
  [routes.dashboard.users.root]: [roles.admin],
  [routes.dashboard.users.mock]: [roles.admin],
} as const;
