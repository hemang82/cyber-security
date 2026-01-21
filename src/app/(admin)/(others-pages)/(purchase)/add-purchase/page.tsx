import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import AddPurchaseComponent from "@/components/account/purchase/AddPurchaseComponent";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function AddSales() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Purchase" />
            <div className="space-y-6">
                <ComponentCard title="Create Purchase" excel={false}>
                    <AddPurchaseComponent />
                </ComponentCard>
            </div>
        </div>
    );
}
