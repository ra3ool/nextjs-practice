export const routes = {
  root: '/',
  auth: {
    root: '/auth',
  },
  dashboard: {
    root: '/dashboard',
    profile: '/dashboard/profile',
    addresses: '/dashboard/addresses',
    users: {
      root: '/dashboard/users',
      mock: '/dashboard/users/mock',
    },
  },
  cart: {
    root: '/cart',
    shippingAddress: '/cart/shipping-address',
    paymentMethod: '/cart/payment-method',
    placeOrder: '/cart/place-order',
  },
  products: {
    root: '/products',
    brands: '/products/brands',
    categories: '/products/categories',
    single: '/product',
  },
  orders: {
    root: '/orders',
    single: '/order',
  },
} as const;
