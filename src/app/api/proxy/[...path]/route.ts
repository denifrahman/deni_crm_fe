import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params)
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params)
}
export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params)
}

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
    const cookiesList = await cookies()
    const token = cookiesList.get('token')?.value
    const path = params?.path.join('/')
    const queryString = req.nextUrl.search
    const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${path}${queryString}`

    const res = await fetch(backendUrl, {
        method: req.method,
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
            'Content-Type': req.headers.get('content-type') || '',
        },
        body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : await req.text(),
        cache: 'no-store',
    })

    const data = await res.text()

    return new Response(data, {
        status: res.status,
        headers: {
            'Content-Type': res.headers.get('content-type') || 'application/json',
        },
    })
}
