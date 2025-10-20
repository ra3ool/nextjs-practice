import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/cart/shipping-address',
  '/cart/payment-method',
];
const AUTH_ROUTES = ['/auth'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (token && isAuthRoute) {
    return NextResponse.redirect(
      new URL(`/dashboard?callbackUrl=${pathname}`, request.url),
    );
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`/auth?callbackUrl=${pathname}`, request.url),
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
