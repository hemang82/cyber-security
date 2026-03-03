
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

export async function getInventoryList(data: Record<string, any> = {}) {
    try {
        const headerList = await headers();
        const url = `${TEMP_URL}/api/inventory/list`;
        console.log("Backend Call:", { url, body: data });

        const resList = await fetch(`${TEMP_URL}/api/inventory/list`, {
            method: "POST",
            cache: "no-store",
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
            body: JSON.stringify(data),
        });
        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}

export async function getScanList(data: Record<string, any> = {}) {
    try {
        const headerList = await headers();
        const url = `${TEMP_URL}/api/inventory/scanlist`;
        console.log("Backend Call:", { url, body: data });

        const resList = await fetch(url, {
            method: "POST",
            // cache: "no-store",
            next: { revalidate: 60 }, // 🔥 Cache for 60 seconds
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
            body: JSON.stringify(data),
        });
        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }
        return [];
    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}

export async function listDomain(data: Record<string, any> = {}) {
    try {
        const headerList = await headers();
        const url = `${TEMP_URL}/api/domain/list`;
        console.log("Backend Call:", { url, body: data });

        const resList = await fetch(`${TEMP_URL}/api/domain/list`, {
            method: "POST",
            cache: "no-store",
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
            body: JSON.stringify(data),
        });

        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        console.log(err.message);
        return [];
    }
}

export async function listVulnerability(data: Record<string, any> = {}) {
    try {
        const headerList = await headers();
        const url = `${TEMP_URL}/api/vulnerability/list`;
        console.log("Backend Call:", { url, body: data });
        const resList = await fetch(`${TEMP_URL}/api/vulnerability/list`, {
            method: "POST",
            cache: "no-store",
            headers: {
                cookie: headerList.get("cookie") ?? "", // 🔥 REQUIRED
            },
            body: JSON.stringify(data),
        });

        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        return [];
    }
}

export async function getInventoryDetails(data: Record<string, any> = {}) {
    try {
        console.log("Backend Call:", { url: "/api/inventoryDetails", body: data });

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

export async function getInventoryView(data: Record<string, any> = {}) {
    try {

        const res: InventoryResponse = await fetcher("/api/inventoryView", { method: "POST", body: data });
        console.log("Backend Call:", { url: "/api/inventoryView", body: data });

        if (res?.code == CODES?.SUCCESS || res?.code === 1) {
            return res?.data;
        } else {
            return {};
        }
    } catch (err: any) {
        console.log(err.message); // user-friendly message
    }
}

export async function getCloudScanDetails(data: Record<string, any> = {}) {
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

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
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