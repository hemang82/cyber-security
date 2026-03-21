import { NextResponse } from "next/server";
import { getCookie } from "@/common/middleware.function";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { CODES } from "@/common/constant";

export async function GET() {
    const userCookie = await getCookie(MIDDLEWARE_COOKIE_KEYS?.AUTH_KEY_COOKIE);
    const user = userCookie ? userCookie : null;

    console.log('GET', user);

    return NextResponse.json({
        code: CODES?.SUCCESS,
        success: true,
        message: "Suceess",
        data: user
    });
}
