import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { NextResponse } from "next/server";

export async function POST() {
    
    const response = NextResponse.json({
        code: CODES?.SUCCESS,
        success: true,
        message: "Suceess",
        data: {}
    });

    response.cookies.set(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, "", {
        path: "/",
        maxAge: 0, // ❌ delete cookie
    });

    response.cookies.set(MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE, "", {
        path: "/",
        maxAge: 0, // ❌ delete cookie
    });

    response.cookies.set(MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE, "", {
        path: "/",
        maxAge: 0, // ❌ delete cookie
    });

    return response;
}

// Suggetion

// const logout = async () => {
//   await fetch("/api/logout", { method: "POST" });
//   router.replace("/signin");
// };
