import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddSalesComponent from "@/components/account/sales/AddSalesComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function AddSales() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Sales" />
            <div className="space-y-6">
                <ComponentCard title="Create Sales" excel={false}>

                    <AddSalesComponent />
                </ComponentCard>
            </div>
        </div>
    );
}
