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
    review: '/cart/review',
  },
  products: {
    root: '/products',
    brands: '/products/brands',
    categories: '/products/categories',
  },
  product: {
    root: '/product',
  },
};
