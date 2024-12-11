import {NextRequest, NextResponse} from 'next/server';
import {jwtVerify} from "jose";

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/login') {
        return NextResponse.next()
    }
    const session = req.cookies.get('session')
    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    const data = await jwtVerify(session.value, new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'secret')) as any
    const response = NextResponse.next()
    response.headers.set('x-user-data', JSON.stringify(data.payload));
    return  response
}

export const config = {
    matcher: "/",
};
