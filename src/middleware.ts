import {NextRequest, NextResponse} from 'next/server';
export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/login') {
        return NextResponse.next()
    }
    const session = req.cookies.get('session')
    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return  NextResponse.next()
}

export const config = {
    matcher: "/",
};
