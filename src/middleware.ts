// Middleware temporariamente desabilitado até backend estar pronto
// O NextAuth será ativado quando a API de autenticação estiver disponível

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Middleware desabilitado - permitir acesso a todas as rotas
    // Quando o backend estiver pronto, descomentar o código abaixo:

    /*
    import NextAuth from 'next-auth';
    import { authConfig } from '@/lib/auth';
    
    const { auth } = NextAuth(authConfig);
    
    return auth((req) => {
      const isLoggedIn = !!req.auth;
      const { pathname } = req.nextUrl;
  
      const protectedRoutes = ['/my-day', '/documents', '/processes', '/analytics', '/signature'];
      const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
      if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return Response.redirect(loginUrl);
      }
  
      if (pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/my-day', req.url));
      }
  
      return undefined;
    });
    */

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
