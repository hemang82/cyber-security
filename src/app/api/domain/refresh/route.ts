import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { CODES } from "@/common/constant";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        // ✅ External API call (body direct forward)
        const response = await fetch("http://cyberapi.tracewavetransparency.com/api/check_txt_record",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body), // 👈 DIRECT PASS
                cache: "no-store",
            }
        );

        console.log('refresh response', response, 'body', body);

        // if (!response.ok) {
        //     throw new Error("External API failed");
        // }

        const data = await response.json();

        console.log('refresh data', data);

        return NextResponse.json({
            code: CODES?.SUCCESS,
            message: data?.message,
            success: true,
            data: data?.data,
        });

    } catch (error) {
        console.error("Domain Refresh API Error:", error);
        return NextResponse.json({
            code: CODES?.ERROR,
            success: false,
            message: "Something went wrong .",
        }, { status: 500 }
        );
    }
}
