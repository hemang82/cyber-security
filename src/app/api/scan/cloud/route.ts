import { CODES } from "@/common/constant";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/logger";

/**
 * This API is STATIC
 * It will always return same data
 */

// export const dynamic = "force-static";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/scan/cloud`;

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

    apiLogger(url, "POST", body, response.status);

    const data = await response.json();

    revalidatePath("/scan");

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
