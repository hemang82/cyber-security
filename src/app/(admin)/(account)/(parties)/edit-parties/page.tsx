import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddSalesComponent from "@/components/account/sales/AddSalesComponent";
import { Metadata } from "next";
import React from "react";
import AddPartiesComponent from "@/components/account/parties/AddPartiesComponent";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function AddParties() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Parties" />
            <div className="space-y-6">
                <ComponentCard title="Edit Parties" excel={false}>
                    <AddPartiesComponent isEdit={true}/>
                </ComponentCard>
            </div>
        </div>
    );
}
