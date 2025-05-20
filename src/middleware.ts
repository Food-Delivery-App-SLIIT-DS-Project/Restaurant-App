// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  const currentPath = request.nextUrl.pathname;

  // Allow access to the home page (`/`) even if no token
  if (!token && currentPath === '/') {
    return NextResponse.next(); // No redirect, allow access
  }

  // If no token and trying to access any protected page (other than `/`)
  if (!token && currentPath !== '/') {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to `/` (login page)
  }

  // If token exists and user tries to visit login, redirect to /order
  if (token && (currentPath === '/')) {
    return NextResponse.redirect(new URL('/restaurant', request.url)); // Redirect to `/restaurant`
  }

  // Otherwise, allow access to the protected pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|static|favicon.ico|api|images).*)', // match everything except static and api
  ],
};
