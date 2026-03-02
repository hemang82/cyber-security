import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = "http://cyberapi.tracewavetransparency.com/api/scan/history";
    console.log("External Backend Call:", { url, method: "POST", body });

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();

    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: responseData?.message,
      success: true,
      data: responseData?.data || responseData,
    });

  } catch (error) {

    return NextResponse.json(
      {
        code: CODES?.ERROR,
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}