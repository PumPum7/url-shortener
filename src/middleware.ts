import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { corsHeaders } from './lib/cors';

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(request),
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  Object.entries(corsHeaders(request)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/api/url/') && 
      !request.nextUrl.pathname.endsWith('/[url]')) {
    const session = await getSession(request);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders(request) }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
