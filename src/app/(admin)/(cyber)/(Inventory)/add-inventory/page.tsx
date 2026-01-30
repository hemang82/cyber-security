import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddInventory from "@/components/cyber/Inventory/AddInventory";
import { listDomain } from "@/lib/server/ServerApiCall";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default async function page() {

      const resDomainList = await listDomain();
    
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Inventory" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddInventory resDomainList={resDomainList}/>
                </ComponentCard>
            </div>
        </div>
    );
}
