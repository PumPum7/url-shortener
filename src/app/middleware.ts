import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { corsHeaders } from '../lib/cors';


export default async function middleware(request: NextRequest) {
  try {
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
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}

export const config = {
  matcher: [
    '/api/url/:path*',
    '/((?!api/url/\\[url\\]).*)'
  ]
};
