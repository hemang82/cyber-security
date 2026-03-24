import { CODES, BACKEND_STATUS } from "@/common/constant";
import { handleBackendResponse } from "@/common/api-handler";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiLogger } from "@/lib/logger";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

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

    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body), // 👈 DIRECT PASS
        cache: "no-store",
      }
    );

    const data = await response.json();
    const result = handleBackendResponse(data, { defaultErrorMsg: "Failed to initiate cloud scan" });

    if (Number(data?.code) === BACKEND_STATUS.SUCCESS) {
      revalidatePath("/scan");
    }

    return result;

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
