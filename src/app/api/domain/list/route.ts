import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {

    // const body = await req.json();

    // ✅ External API call (body direct forward)
    const response = await fetch("http://cyberapi.tracewavetransparency.com/api/verification-history",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(body), // 👈 DIRECT PASS
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("External API failed");
    }

    const data = await response.json();

    console.log('ssr New', data);
    
    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: data?.message,
      success: true,
      data: data?.data,
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

