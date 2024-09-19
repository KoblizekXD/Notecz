import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { lucia } from './lib/util';
import { Lucia } from 'lucia';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('Redirecting because logged in...');
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signup', '/signin'],
}