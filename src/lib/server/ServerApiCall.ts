
/**
 * Fetch IPO list (server-side)
 * Always fresh per request
 */

import { CODES, TEMP_URL } from "@/common/constant";
import { fetcher } from "@/lib/fetcher";
import { headers } from "next/headers";

type InventoryResponse = {
    code?: any
    message?: any
    data?: any
};

export async function getInventory() {
    try {
        const headerList = await headers();
        console.log("TEMP_URL",`${TEMP_URL}/api/inventory/list`);

        const resList = await fetch(`${TEMP_URL}/api/inventory/list`, {
            method: "GET",
            cache: "no-store",
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
        });
        const res = await resList.json();

        console.log("getInventory res", res);

        if (res?.code === CODES?.SUCCESS) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}


export async function getInventoryDetails(data: Record<string, any>) {
    try {

        console.log("getInventoryDetails", data);

        const res: InventoryResponse = await fetcher("/api/inventoryDetails", { method: "POST", body: data });
        if (res?.code == CODES?.SUCCESS) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}

// export async function addInventoryDetails(data: Record<string, any>) {
//     try {

//         const res: InventoryResponse = await fetcher("/api/addInventory", { method: "POST", body: data });
//         if (res?.code == CODES?.SUCCESS) {
//             return res;
//         } else {
//             return [];
//         }
//     } catch (err: any) {
//         console.log(err.message); // user-friendly message
//     }
// }