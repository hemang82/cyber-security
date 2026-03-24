import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { handleBackendResponse } from "@/common/api-handler";

/** ✅ Proxy for User Registration */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/add`;

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    return handleBackendResponse(data, { defaultErrorMsg: "Failed to register user" });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
