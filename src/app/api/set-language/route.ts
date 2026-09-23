import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'es';
  const redirect = searchParams.get('redirect') || '/';

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'http');
  const baseUrl = `${protocol}://${host}`;

  // Create a response that redirects to the target URL
  const response = NextResponse.redirect(new URL(redirect, baseUrl));
  
  // Set the cookie securely via the Server Response (Set-Cookie header)
  response.cookies.set('NEXT_LOCALE', lang, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
