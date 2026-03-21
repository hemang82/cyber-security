
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { CODES } from "@/common/constant";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const contentType = req.headers.get("content-type") || "";
        let newItem: any;

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            newItem = {
                assets_type: JSON.parse(formData.get("assets_type") as string || "{}"),
                assets_details: JSON.parse(formData.get("assets_details") as string || "{}"),
                credentials: JSON.parse(formData.get("credentials") as string || "{}"),
                owners: JSON.parse(formData.get("owners") as string || "{}"),
                final_validate_data: JSON.parse(formData.get("final_validate_data") as string || "{}"),
                website_url: formData.get("website_url") as string || "N/A",
            };

            // Inject the physical file back into the reconstructed assets_details
            const appFile = formData.get("app_file");
            if (appFile) {
                newItem.assets_details.value = {
                    ...newItem.assets_details.value,
                    app_file: appFile
                };
            }
        } else {
            newItem = await req.json();
        }

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

        inventory.push({
            id: Date.now(),
            ...newItem,
        });

        cookieStore.set(MIDDLEWARE_COOKIE_KEYS.INVENTORY_LIST, JSON.stringify(inventory), {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
        });

        // ✅ Common base fields - badha ma same
        const baseFields = {
            name: newItem?.assets_details?.value?.assets_name,
            type: newItem?.assets_type?.value,
            description: newItem?.assets_details?.value?.description,
            tags: newItem?.assets_details?.value?.tags,
            contact_name: newItem?.assets_details?.value?.name,
            contact_email: newItem?.assets_details?.value?.email,
            contact_phone: newItem?.assets_details?.value?.phone_number,
        };

        const assetType = newItem?.assets_type?.value;

        let response2: any;
        let fetchOptions: RequestInit;

        // ✅ CLOUD - JSON
        if (assetType === "cloud") {
            response2 = {
                ...baseFields,
                metadata: {
                    credentials: {
                        provider: newItem?.assets_details?.value?.provider,
                        access_key: newItem?.assets_details?.value?.access_key,
                        secret_key: newItem?.assets_details?.value?.secret_key,
                        region: newItem?.assets_details?.value?.region,
                    },
                },
            };
            fetchOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response2),
                cache: "no-store",
            };
        }

        // ✅ WEB APP - JSON
        else if (assetType === "web_app") {
            response2 = {
                ...baseFields,
                url: newItem?.website_url,
                // web app specific fields add kar here
            };
            fetchOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response2),
                cache: "no-store",
            };
        }

        // ✅ APP - FormData
        else if (assetType === "app") {

            const formData = new FormData();
            formData.append("name", baseFields.name ?? "");
            formData.append("type", baseFields.type ?? "");
            formData.append("description", baseFields.description ?? "");
            formData.append("tags", baseFields.tags ?? "");
            formData.append("contact_name", baseFields.contact_name ?? "");
            formData.append("contact_email", baseFields.contact_email ?? "");
            formData.append("contact_phone", baseFields.contact_phone ?? "");

            // if (newItem?.assets_details?.value?.app_file) {
            //     formData.append("app_file", newItem?.assets_details?.value?.app_file);
            // }
            response2 = formData;

            fetchOptions = {
                method: "POST",
                // ⚠️ Content-Type set nahi karva — browser automatically set karse boundary sathe
                body: formData,
                cache: "no-store",
            };

        }

        else {
            response2 = { ...baseFields };
            fetchOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response2),
                cache: "no-store",
            };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assets/`, fetchOptions!);
        const data = await response.json();

        revalidatePath("/inventory", "page");
        revalidatePath("/scan", "page");
        revalidatePath("/vulnerability", "page");
        revalidatePath("/", "layout");

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