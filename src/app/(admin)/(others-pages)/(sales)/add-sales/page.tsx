import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddSalesComponent from "@/components/sales/AddSalesComponent";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function AddSales() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Domin" />
            <div className="space-y-6">
                <ComponentCard title="Domin" excel={false}>
                    <AddSalesComponent />
                </ComponentCard>
            </div>
        </div>
    );
}
