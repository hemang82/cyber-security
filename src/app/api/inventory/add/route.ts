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

        return NextResponse.json({
            code: CODES?.SUCCESS,
            success: true,
            message: "Inventory added successfully",
            data: inventory,
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
