import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddInventory from "@/components/cyber/Inventory/AddInventory";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function BasicTables() {
    
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Assets" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddInventory />
                </ComponentCard>
            </div>
        </div>
    );
}
