import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { routes } from './constants/routes.constants';

const PROTECTED_ROUTES = [
  routes.dashboard.root,
  routes.cart.shippingAddress,
  routes.cart.paymentMethod,
];
const AUTH_ROUTES = [routes.auth.root];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (token && isAuthRoute) {
    return NextResponse.redirect(
      new URL(`${routes.dashboard.root}?callbackUrl=${pathname}`, request.url),
    );
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`${routes.auth.root}?callbackUrl=${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/auth',
    '/cart/:path*',
  ],
};
