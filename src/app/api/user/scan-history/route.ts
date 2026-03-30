import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { handleBackendResponse } from "@/common/api-handler";

/** ✅ Proxy for Fetching User-Specific Scan History */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("page_size") || "15";
    
    if (!userId) return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, "") || "";
    const url = `${baseUrl}/api/scan/history`;

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        user_id: userId, 
        page: page, 
        page_size: pageSize 
      }),
      cache: "no-store",
    });

    const result = await response.json();

    return handleBackendResponse(result, { defaultErrorMsg: "Failed to fetch user scan history" });

  } catch (error) {
    console.error("User Scan History API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
