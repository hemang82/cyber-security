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

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, "") || "";
    const url = `${baseUrl}/api/users/get`;

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id: userId }),
      cache: "no-store",
    });

    const result = await response.json();

    // ✅ Map backend structure to flat data for current component
    // Backend: data: { user: { contact_number, web_limit, ... } }
    if (result.code === 1 && result.data?.user) {
        const u = result.data.user;
        result.data = {
            ...u,
            phone_number: u.contact_number,
            website_limit: u.web_limit,
            app_limit: u.mobile_limit, // mapping mobile_limit to app_limit
            cloud_limit: u.cloud_limit
        };
    }

    return handleBackendResponse(result, { defaultErrorMsg: "Failed to fetch user details" });

  } catch (error) {
    console.error("User Details API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
