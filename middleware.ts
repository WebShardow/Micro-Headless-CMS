import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const mustChangePw = request.cookies.get('must_change_pw');
  const { pathname } = request.nextUrl;

  const isChangePassword = pathname === '/admin/change-password';
  const isAdminRoute = pathname.startsWith('/admin');

  // ─── /admin routes ───────────────────────────────────────────────
  if (isAdminRoute) {
    // ต้อง login ก่อน
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ถ้ายังไม่เปลี่ยน password → บังคับไป /admin/change-password
    if (mustChangePw && !isChangePassword) {
      return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }

    // ถ้าเปลี่ยน password แล้ว ห้ามเข้า /admin/change-password ซ้ำ
    if (!mustChangePw && isChangePassword) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // ─── /login ──────────────────────────────────────────────────────
  if (pathname === '/login') {
    if (session) {
      // มี session แล้ว → ตรวจว่าต้องเปลี่ยน password ไหม
      if (mustChangePw) {
        return NextResponse.redirect(new URL('/admin/change-password', request.url));
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // ─── /setup ──────────────────────────────────────────────────────
  if (pathname === '/setup') {
    // ถ้า login แล้วและผ่าน must_change_pw ไปแล้ว → ไม่ต้อง setup แล้ว
    if (session && !mustChangePw) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/setup'],
};
