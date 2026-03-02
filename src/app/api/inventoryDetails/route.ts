import { CODES } from "@/common/constant";
import { NextResponse } from "next/server";

/**
 * This API is STATIC
 * It will always return same data
 */

// export const dynamic = "force-static";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = "http://cyberapi.tracewavetransparency.com/api/scan/website";
    console.log("External Backend Call:", { url, method: "POST", body });

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // 👈 DIRECT PASS
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("External API failed");
    }

    const data = await response.json();

    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: data?.message,
      success: true,
      data: data?.data,
    });

  } catch (error) {
    return NextResponse.json(
      {
        code: CODES?.ERROR,
        success: false,
        message: "Something went wrong while scanning website",
      },
      { status: 500 }
    );
  }
}