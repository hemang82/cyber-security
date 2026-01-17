import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    console.log("🔥 MIDDLEWARE HIT:", request.nextUrl.pathname);

    const isLogin = request.cookies.get("LOGIN_KEY")?.value;
    const pathname = request.nextUrl.pathname;

    console.log('MIDDLEWARE isLogin',isLogin);
    

    if (!isLogin && pathname !== "/signin") {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isLogin && pathname === "/signin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/", "/signin", "/dashboard/:path*"],
};
