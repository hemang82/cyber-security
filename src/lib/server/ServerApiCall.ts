
/**
 * Fetch IPO list (server-side)
 * Always fresh per request
 */

import { CODES } from "@/common/constant";
import { fetcher } from "@/lib/fetcher";

type InventoryResponse = {
    code?: any
    message?: any
    data?: any
};

export async function getInventory() {
    try {
        const res: InventoryResponse = await fetcher("/api/inventory", { method: "POST", body: {} });
        if (res?.code == CODES?.SUCCESS) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}

export async function getInventoryDetails() {
    try {
        const res: InventoryResponse = await fetcher("/api/inventory", { method: "POST", body: {} });
        if (res?.code == CODES?.SUCCESS) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}