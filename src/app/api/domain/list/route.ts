import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const baseUrl = "https://cyberapi.ipotrending.com/api/verification-history";
    const queryString = body ? new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)])).toString() : "";
    const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    console.log("External Backend Call:", { url: finalUrl, method: "GET" });

    const response = await fetch(finalUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("External API failed");
    }

    const responseData = await response.json();

    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: responseData?.message,
      success: true,
      data: responseData?.data || responseData,
    });

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

