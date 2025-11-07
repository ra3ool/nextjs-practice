import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/constants/acl.constants';
import { routes } from '@/constants/routes.constants';
import { canAccess } from '@/lib/acl';
import { UserRole } from '@/types/user.type';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

function redirectTo(url: string, request: NextRequest, callbackUrl?: string) {
  const target = callbackUrl ? `${url}?callbackUrl=${callbackUrl}` : url;
  return NextResponse.redirect(new URL(target, request.url));
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Handle authenticated users on auth routes
  if (token && isAuthRoute) {
    return redirectTo(routes.dashboard.root, request, pathname);
  }

  // Handle unauthenticated users on protected routes
  if (!token && isProtectedRoute) {
    return redirectTo(routes.auth.root, request, pathname);
  }

  // ACL Check for authenticated users
  if (token) {
    if (!canAccess(pathname, token.role as UserRole)) {
      return NextResponse.redirect(new URL(routes.dashboard.root, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth', '/cart/:path*'],
};
