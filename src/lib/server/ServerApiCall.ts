
/**
 * Fetch IPO list (server-side)
 * Always fresh per request
 */


import { CODES, TEMP_URL } from "@/common/constant";
import { fetcher } from "@/lib/fetcher";
import { apiLogger } from "../logger";
import { cookies } from "next/headers";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

const BASE_EXTERNAL_URL = "https://cyberapi.ipotrending.com";

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE)?.value;
    
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
}

type InventoryResponse = {
    code?: any
    message?: any
    data?: any
};

export async function getInventoryList(data: Record<string, any> = {}) {
    try {
        const url = `${BASE_EXTERNAL_URL}/api/assets/list`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store", // Direct real-time fetch
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
            next: { revalidate: 0 } 
        });

        apiLogger(url, "POST", data, resList.status);
        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        return [];
    }
}

export async function getScanList(data: Record<string, any> = {}) {
    try {
        const url = `${BASE_EXTERNAL_URL}/api/scan/history`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store", // Real-time scan history
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
            next: { revalidate: 0 }
        });

        apiLogger(url, "POST", data, resList.status);
        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }
        return [];
    } catch (err: any) {
        // Log removed
    }
}

export async function listDomain(data: Record<string, any> = {}) {
    try {
        const baseUrl = `${BASE_EXTERNAL_URL}/api/verification-history`;
        const queryString = data ? new URLSearchParams(Object.entries(data).map(([k, v]) => [k, String(v)])).toString() : "";
        const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

        const resList = await fetch(finalUrl, {
            method: "GET",
            cache: "no-store",
            headers: await getAuthHeaders(),
        });

        apiLogger(finalUrl, "GET", null, resList.status);
        const res = await resList.json();

        if (res?.code === CODES?.SUCCESS || res?.code === 1) {
            return res.data;
        }

        return [];

    } catch (err: any) {
        // Log removed
    }
}

export async function listVulnerability(data: Record<string, any> = {}) {
    try {
        const url = `${BASE_EXTERNAL_URL}/api/scan/findings`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store", // Real-time vulnerability list
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
            next: { revalidate: 0 }
        });

        apiLogger(url, "POST", data, resList.status);
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
        const url = `${BASE_EXTERNAL_URL}/api/scan/website`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store",
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
        });

        apiLogger(url, "POST", data, resList.status);
        const res = await resList.json();

        if (res?.code == CODES?.SUCCESS || res?.code === 1) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        // Log removed
    }
}

export async function getInventoryView(data: Record<string, any> = {}) {
    try {
        const url = `${BASE_EXTERNAL_URL}/api/scan/scan-details`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store",
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
        });

        apiLogger(url, "POST", data, resList.status);
        const res = await resList.json();

        if (res?.code == CODES?.SUCCESS || res?.code === 1) {
            return res?.data;
        } else {
            return {};
        }
    } catch (err: any) {
        // Log removed
    }
}

export async function getCloudScanDetails(data: Record<string, any> = {}) {
    try {
        const url = `${BASE_EXTERNAL_URL}/api/scan/cloud`;
        const resList = await fetch(url, {
            method: "POST",
            cache: "no-store",
            headers: await getAuthHeaders(),
            body: JSON.stringify(data),
        });

        apiLogger(url, "POST", data, resList.status);
        const res = await resList.json();

        if (res?.code == CODES?.SUCCESS || res?.code === 1) {
            return res?.data;
        } else {
            return [];
        }
    } catch (err: any) {
        // Log removed
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

        apiLogger("/api/domain/add", "POST", data, response.status);
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