import { NextResponse } from "next/server";
import { CODES, BACKEND_STATUS } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "./middleware.constants";

/**
 * Common handler to map backend status codes to standard Next.js responses.
 * 
 * @param data - The JSON body received from the external backend
 * @param options - Optional overrides for messages or data
 */
export function handleBackendResponse(data: any, options?: {
    defaultErrorMsg?: string;
    includeDataOnFailure?: boolean;
}) {
    const backendCode = Number(data?.code);

    // 1 -> SUCCESS (200)
    if (backendCode === BACKEND_STATUS.SUCCESS) {
        return NextResponse.json({
            code: CODES.SUCCESS,
            message: data?.message || "Operation successful",
            success: true,
            data: data?.data || data,
        });
    }

    // -1 -> UNAUTHORIZED (401)
    if (backendCode === BACKEND_STATUS.UNAUTHORIZED) {
        const response = NextResponse.json({
            code: CODES.UNAUTHORIZED,
            message: data?.message || "Session expired. Please login again.",
            success: false,
            data: data?.data || data,
        }, { status: 401 });

        // ✅ User-friendly message and direct server-side cookie clearing (effective logout)
        response.cookies.set(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, "", { path: "/", maxAge: 0 });
        response.cookies.set(MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE, "", { path: "/", maxAge: 0 });
        response.cookies.set(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE, "", { path: "/", maxAge: 0 });
        response.cookies.set(MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE, "", { path: "/", maxAge: 0 });

        return response;
    }

    // 2 -> DATA NOT FOUND (404)
    if (backendCode === BACKEND_STATUS.NOT_FOUND) {
        return NextResponse.json({
            code: CODES.NOT_FOUND,
            message: data?.message || "Requested resource not found",
            success: false,
            data: data?.data || data,
        }, { status: 404 });
    }

    // 0 or other -> ERROR (Generic)
    return NextResponse.json({
        code: CODES.ERROR,
        message: data?.message || options?.defaultErrorMsg || "An unexpected error occurred",
        success: false,
        data: data?.data || data,
    });
}
