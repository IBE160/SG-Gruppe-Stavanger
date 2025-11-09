// Middleware for route protection (stub)
// TODO: Enable when auth is fully configured

import { NextResponse } from "next/server"

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
