import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { handleBackendResponse } from "@/common/api-handler";

/** ✅ Proxy for Fetching Single User Details */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    
    if (!userId) return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/details/${userId}`;

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url, {
        method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store",
    });

    const data = await response.json();
    return handleBackendResponse(data, { defaultErrorMsg: "Failed to fetch user details" });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
