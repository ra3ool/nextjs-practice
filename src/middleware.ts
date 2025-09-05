import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Define your route groups
const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ROUTES = ['/auth'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect authenticated users away from auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users from protected routes
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
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
  ],
};
