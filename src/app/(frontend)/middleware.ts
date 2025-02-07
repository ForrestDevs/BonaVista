import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SERVER_URL,
  'https://www2.bonavistaleisurescapes.com',
  'https://bonavistaleisurescapes.com',
].filter(Boolean) // Filter out any undefined values

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token', // Added CSRF token
  'Access-Control-Allow-Credentials': 'true', // Important for authenticated requests
  'Access-Control-Max-Age': '86400', // Cache preflight requests for 24 hours
}

export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get('origin') ?? ''

  // If no origin, assume it's a simple same-origin request
  if (!origin) {
    return NextResponse.next()
  }

  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return new NextResponse(null, { headers: preflightHeaders, status: 204 })
  }
  // Handle simple requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)', '/**'],
}
