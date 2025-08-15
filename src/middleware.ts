import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/signin', '/signup', '/favicon.ico', '/api']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    if (isPublic) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)


    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Jalankan middleware untuk semua halaman
         * kecuali untuk:
         * - static files: _next, images, favicon, dll
         * - auth pages
         * - API routes
         */
        '/((?!_next/static|_next/image|favicon.ico|images|fonts|signin|signup|api).*)',
    ],
}
