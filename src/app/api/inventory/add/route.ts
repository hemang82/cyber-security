import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { CODES } from "@/common/constant";

export async function POST(req: Request) {
    try {
        // ✅ FIX 1: await cookies()
        const cookieStore = await cookies();

        // Read request body
        const newItem = await req.json();

        if (!newItem || typeof newItem !== "object") {
            return NextResponse.json(
                { success: false, message: "Invalid inventory data" },
                { status: 400 }
            );
        }

        // Read existing inventory
        const inventoryCookie = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.INVENTORY_LIST);
        let inventory: any[] = [];

        if (inventoryCookie?.value) {
            try {
                inventory = JSON.parse(inventoryCookie.value);
                if (!Array.isArray(inventory)) inventory = [];
            } catch {
                inventory = [];
            }
        }

        // Push new object
        inventory.push({
            id: Date.now(),
            ...newItem,
        });

        // ✅ FIX 2: set cookie after await
        cookieStore.set(MIDDLEWARE_COOKIE_KEYS.INVENTORY_LIST, JSON.stringify(inventory), {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
        });

        const response = await fetch("http://cyberapi.tracewavetransparency.com/api/assets/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": newItem?.assets_details?.value?.assets_name,
                    "type": newItem?.assets_type?.value,
                    ...(newItem?.assets_type?.value === "web_app" && { "url": newItem?.website_url }),
                    "description": newItem?.assets_details?.value?.description,
                    "tags": newItem?.assets_details?.value?.tags,
                    "contact_name": newItem?.assets_details?.value?.name,
                    "contact_email": newItem?.assets_details?.value?.email,
                    "contact_phone": newItem?.assets_details?.value?.phone_number,
                    ...(newItem?.assets_type?.value === "cloud" && {
                        "metadata": {
                            "credentials": {
                                "provider": newItem?.assets_details?.value?.provider,
                                "access_key": newItem?.assets_details?.value?.access_key,
                                "secret_key": newItem?.assets_details?.value?.secret_key,
                                "region": newItem?.assets_details?.value?.region,
                            }
                        }
                    })
                }),
                cache: "no-store",
            }
        );

        // if (!response.ok) {
        //     throw new Error("External API failed");
        // }

        const data = await response.json();

        return NextResponse.json({
            code: CODES?.SUCCESS,
            success: true,
            message: data?.message,
            data: data?.data,
        });

    } catch (error) {
        console.error("Inventory Add API Error:", error);
        return NextResponse.json(
            {
                code: CODES?.ERROR,
                success: false,
                message: "Failed to add inventory",
            },
            { status: 500 }
        );
    }
}
