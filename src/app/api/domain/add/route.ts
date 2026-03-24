import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { CODES, BACKEND_STATUS } from "@/common/constant";
import { handleBackendResponse } from "@/common/api-handler";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        const cookieStore = await cookies();
        const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

        // ✅ External API call (body direct forward)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/generate_txt_record`,
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


        console.log("response", response);
        const data = await response.json();
        return handleBackendResponse(data, { defaultErrorMsg: "Failed to add domain" });

    } catch (error) {
        console.error("Domain Add API Error:", error);
        return NextResponse.json({
            code: CODES?.ERROR,
            success: false,
            message: "Something went wrong .",
        }, { status: 500 }
        );
    }
}
