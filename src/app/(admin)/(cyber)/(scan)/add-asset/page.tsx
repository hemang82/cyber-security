import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { getInventoryList, listDomain } from "@/lib/server/ServerApiCall";
import AddScan from "@/components/cyber/Inventory/AddScan";

/**
 * Metadata for the Add Scan page.
 * This helps with SEO and browser tab titling.
 */
export const metadata: Metadata = {
    title: "Add Scan | CyberSecurity Inventory",
    description: "Initiate security scans for your registered assets. Manage and monitor vulnerabilities across your infrastructure.",
};

/**
 * AddAssetPage (Server Component)
 * 
 * This is the entry point for the "Add Scan" functionality. 
 * It performs server-side data fetching to ensure the UI has the necessary 
 * inventory and domain information immediately upon load.
 * 
 * @returns Server-rendered Page layout containing the AddScan client component.
 */
export default async function AddAssetPage() {

    // Fetching inventory and domain lists in parallel to optimize page load time.
    // getInventoryList: Fetches the list of assets registered in the system.
    // listDomain: Fetches the list of verified domains.
    const [resInventoryList, resDomainList] = await Promise.all([
        getInventoryList(),
        listDomain(),
    ]);

    return (
        <div className="container mx-auto px-4 py-2">
            {/* Breadcrumb for easy navigation */}
            <PageBreadcrumb pageTitle="Add Scan" />

            <div className="mt-6 space-y-6">
                <ComponentCard>

                    {/* 
                        AddScan is a Client Component that orchestrates the multi-step scan creation process.
                        Passing fetched data as props minimizes client-side data fetching overhead.
                    */}

                    <AddScan
                        resInventoryList={resInventoryList || []}
                        resDomainList={resDomainList || []}
                    />

                </ComponentCard>
            </div>
        </div>
    );
}
