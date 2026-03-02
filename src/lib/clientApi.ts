import { CODES } from "@/common/constant";

/**
 * Universal fetcher for client-side API calls
 */
export async function clientFetcher(url: string, options: any = {}) {
    const { method = "GET", body, headers: customHeaders } = options;

    console.log("Backend Call:", { url, method, body });
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...customHeaders,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
}

export async function getCloudScanDetails(data: Record<string, any>) {
    try {

        const res = await clientFetcher("/api/cloudScanDetails", {
            method: "POST",
            body: data
        });

        return res;

    } catch (err: any) {
        return [];
    }
}


export async function getWebsiteDetails(data: Record<string, any>) {
    try {

        const res = await clientFetcher("/api/inventoryDetails", {
            method: "POST",
            body: data
        });

        return res;

    } catch (err: any) {
    }
}