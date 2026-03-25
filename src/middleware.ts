import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { USER_ROLE } from "@/common/commonVariable";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;
    const pathname = request.nextUrl.pathname;

    // List of public routes
    const isPublicRoute = pathname === "/signin" || pathname === "/signup" || pathname === "/verify";

    // ✅ Protected admin routes
    const adminRoutes = ["/user", "/add-user", "/user-details"];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // If not logged in and trying to access a protected route
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If logged in
    if (token) {
        // If trying to access signin/signup
        if (isPublicRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // 🔐 Role-Based Access Control
        const roleCookie = request.cookies.get(MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE)?.value;
        const role = roleCookie?.replace(/"/g, ''); // ⚡️ Clean potential JSON quotes

        if (isAdminRoute && role !== USER_ROLE.ADMIN) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
