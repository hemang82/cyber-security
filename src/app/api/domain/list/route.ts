import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CODES, BACKEND_STATUS } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { handleBackendResponse } from "@/common/api-handler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/verification-history`;
    const queryString = body ? new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])).toString() : "";
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("External Backend Call:", { url: finalUrl, method: "GET" });

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(finalUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: "no-store",
      }
    );

    const responseData = await response.json();
    return handleBackendResponse(responseData, { defaultErrorMsg: "Failed to fetch verification history" });

  } catch (error) {
    console.error("Domain list API Error:", error);
    return NextResponse.json({
      code: CODES?.ERROR,
      success: false,
      message: "Something went wrong .",
    }, { status: 500 }
    );
  }
}

