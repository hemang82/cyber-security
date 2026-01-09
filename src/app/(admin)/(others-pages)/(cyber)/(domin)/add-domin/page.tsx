import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddDomin from "@/components/cyber/domin/AddDomin";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Domin" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddDomin />
                </ComponentCard>
            </div>
        </div>
    );
}
