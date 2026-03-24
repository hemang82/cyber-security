import { logoutRedirection, TOAST_ERROR } from "@/common/commonFunction";

/**
 * Universal fetcher for client-side API calls
 */
export async function clientFetcher(url: string, options: any = {}) {
    const { method = "GET", body, headers: customHeaders } = options;

    // Get token from localStorage (client-side only)
    const token = typeof window !== "undefined" ? localStorage.getItem("CYBER_access_token") : null;

    console.log("Backend Call:", { url, method, body });
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...customHeaders,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 401) {
        TOAST_ERROR("Session expired. Please login again.");
        logoutRedirection();
        if (typeof window !== "undefined") {
            window.location.href = "/signin";
        }
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
}

export async function getCloudScanDetails(data: Record<string, any>) {
    try {

        const res = await clientFetcher("/api/scan/cloud", {
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

        const res = await clientFetcher("/api/scan/website", {
            method: "POST",
            body: data
        });

        return res;

    } catch (err: any) {
    }
}

export async function getApplicationDetails(data: Record<string, any>) {
    try {
        const res = await clientFetcher("/api/scan/mobile", {
            method: "POST",
            body: data
        });
        return res;
    } catch (err: any) {
    }
}