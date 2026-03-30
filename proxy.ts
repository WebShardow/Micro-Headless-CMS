import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');
  const mustChangePw = request.cookies.get('must_change_pw');
  const { pathname } = request.nextUrl;

  const isChangePassword = pathname === '/admin/change-password';
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (mustChangePw && !isChangePassword) {
      return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }

    if (!mustChangePw && isChangePassword) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (pathname === '/login' && session) {
    if (mustChangePw) {
      return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname === '/setup' && session && !mustChangePw) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/setup'],
};
