import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const isLogin = request.cookies.get(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE)?.value;
    const pathname = request.nextUrl.pathname;

    const publicPaths = ["/signin", "/signup", "/verify"];

    // Redirect logged-in users away from auth pages
    if (isLogin && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Protect all other routes
    if (!isLogin && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
    ],
};
