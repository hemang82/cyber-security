import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { setCookie } from "@/common/middleware.function";
import { NextResponse } from "next/server";

export const DefaultUser = {
  name: "Admin",
  role: "admin",
  profile_image: "https://jain-fintech-assets.s3.us-east-1.amazonaws.com/profile_image/1747048240510.webp",
  email: "admin@gmail.com",
  password: "Admin@123",
  phone_number: "1234567891"
}

export async function POST(request: Request) {

  const body = await request.json();

  const { email, password } = body;

  if (email === DefaultUser?.email && password === DefaultUser?.password) {
    const response = NextResponse.json({
      code: CODES?.SUCCESS,
      // success: true,
      message: "Login success",
      data: {
        email: email,
        password: password
      }
    });

    setCookie(response, MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, true)
    setCookie(response, MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE, DefaultUser)
    setCookie(response, MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE, DefaultUser?.role)

    // ✅ AUTH COOKIE SET
    // response.cookies.set(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, "true", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 60 * 60 * 24, // 1 day
    // });

    return response;
  }

  return NextResponse.json(
    { code: CODES?.ERROR, message: "Invalid credentials" },
    { status: 401 }
  );
}
