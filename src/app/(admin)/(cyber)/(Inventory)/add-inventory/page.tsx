import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddInventory from "@/components/cyber/Inventory/AddInventory";
import { listDomain } from "@/lib/server/ServerApiCall";

export const metadata: Metadata = {
    title: "Add New Security Asset | CyberSafe Inventory Management",
    description: "Register new domains or cloud infrastructure assets to start security monitoring and vulnerability tracking.",
    keywords: ["Add Security Asset", "CyberSecurity Enrollment", "Domain Registration", "Cloud Monitoring", "Vulnerability Tracking"],
};

export default async function page() {

    const resDomainList = await listDomain();

    return (
        <div>
            <PageBreadcrumb pageTitle="Add Inventory" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddInventory resDomainList={resDomainList} />
                </ComponentCard>
            </div>
        </div>
    );
}
