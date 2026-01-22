import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

    console.log("🔥 MIDDLEWARE HIT:", request.nextUrl.pathname);

    const isLogin = request.cookies.get(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE)?.value;
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
