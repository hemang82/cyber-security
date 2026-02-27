
/**
 * Fetch IPO list (server-side)
 * Always fresh per request
 */

import { TOAST_ERROR } from "@/common/commonFunction";
import { CODES, TEMP_URL } from "@/common/constant";
import { fetcher } from "@/lib/fetcher";
import { headers } from "next/headers";

type InventoryResponse = {
    code?: any
    message?: any
    data?: any
};

export async function getInventoryList() {
    try {
        const headerList = await headers();
        console.log("TEMP_URL", `${TEMP_URL}/api/inventory/list`);

        const resList = await fetch(`${TEMP_URL}/api/inventory/list`, {
            method: "POST",
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

export async function getScanList(data: Record<string, any>) {
    try {
        const headerList = await headers();

        console.log("data getScanList", data);
        const resList = await fetch(`${TEMP_URL}/api/inventory/scanlist`, {
            method: "POST",
            cache: "no-store",
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
            body: JSON.stringify(data),
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

export async function listDomain() {
    try {
        const headerList = await headers();
        console.log(`tempp ${TEMP_URL}/api/domain/list`);

        const resList = await fetch(`${TEMP_URL}/api/domain/list`, {
            method: "POST",
            cache: "no-store",
            // headers: {
            //     cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            // },
        });

        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS) {
            return res.data;
        } else {
            TOAST_ERROR("Something went wrong .")
        }

        return [];

    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}

export async function listVulnerability() {
    try {
        const headerList = await headers();
        console.log(`tempp ${TEMP_URL}/api/vulnerability/list`);
        const resList = await fetch(`${TEMP_URL}/api/vulnerability/list`, {
            method: "POST",
            cache: "no-store",
            // headers: {
            //     cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            // },
        });

        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS) {
            return res.data;
        } else {
            TOAST_ERROR("Something went wrong .")
        }

        return [];

    } catch (err: any) {
        console.log("listVulnerability error", err.message);
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

export async function getInventoryView(data: Record<string, any>) {
    try {

        const res: InventoryResponse = await fetcher("/api/inventoryView", { method: "POST", body: data });

        console.log("res test", res);

        if (res?.code == CODES?.SUCCESS) {
            return res?.data;
        } else {
            return {};
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}

export async function getCloudScanDetails(data: Record<string, any>) {
    try {

        const res: InventoryResponse = await fetcher("/api/cloudScanDetails", { method: "POST", body: data });

        if (res?.code == CODES?.SUCCESS) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}

export async function addDomainDetails(data: Record<string, any>) {
    try {
        const response = await fetch("/api/domain/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const res: InventoryResponse = await response.json();

        if (res?.code === CODES?.SUCCESS) {
            return res;
        }

        return null; // or throw an error if preferred
    } catch (err: any) {
        console.error("addDomainDetails error:", err.message);
        return null;
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