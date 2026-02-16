import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddInventory from "@/components/cyber/Inventory/AddInventory";
import { getInventoryList, listDomain } from "@/lib/server/ServerApiCall";
import AddScan from "@/components/cyber/Inventory/AddScan";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default async function page() {

    const resDomainList = await getInventoryList();

    return (
        <div>
            <PageBreadcrumb pageTitle="Add Scan" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddScan resDomainList={resDomainList} />
                </ComponentCard>
            </div>
        </div>
    );
}
