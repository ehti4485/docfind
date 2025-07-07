import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isLoginOrRegister = req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/auth/register';

  // If user is signed in and the current path is /auth/login or /auth/register, redirect to /auth/dashboard
  if (session && isLoginOrRegister) {
    const redirectUrl = new URL('/auth/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not signed in and the current path is protected (starts with /auth but not login or register), redirect to /auth/login
  if (!session && isAuthRoute && !isLoginOrRegister) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/auth/:path*'],
};