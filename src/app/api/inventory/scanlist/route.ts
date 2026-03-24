import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { apiLogger } from "@/lib/logger";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/scan/history`;

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: "no-store",
        body: JSON.stringify(body),
      }
    );

    apiLogger(url, "POST", body, response.status);
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