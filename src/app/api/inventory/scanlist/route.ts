import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { apiLogger } from "@/lib/logger";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/scan/history`;

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