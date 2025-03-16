import { NextResponse } from 'next/server';

export function middleware(request) {
    // Only apply to /api routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Get the origin from the request
    const origin = request.headers.get('origin') || '*';

    // Create a Response object
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Add SameSite=None and Secure attributes to cookies
    response.headers.set('Set-Cookie',
        response.headers.get('Set-Cookie')?.replace(
            /(SameSite=Lax|SameSite=Strict)/,
            'SameSite=None; Secure'
        ) || ''
    );

    return response;
}

// Specify which routes this middleware should run on
export const config = {
    matcher: ['/api/:path*'],
};