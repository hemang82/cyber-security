
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const id = formData.get("id");
        const appFile = formData.get("app_file");

        if (!id || !appFile) {
            return NextResponse.json({ success: false, message: "Missing ID or File" }, { status: 400 });
        }

        // Re-construct formData for external API
        const externalFormData = new FormData();
        externalFormData.append("id", id);
        externalFormData.append("app_file", appFile);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assets/upload-file`, {
            method: "POST",
            body: externalFormData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error("Internal Upload Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
