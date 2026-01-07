import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddSalesComponent from "@/components/account/sales/AddSalesComponent";
import { Metadata } from "next";
import React from "react";
import AddPurchaseComponent from "@/components/account/purchase/AddPurchaseComponent";
import AddBankAccount from "@/components/account/bankaccounts/AddBankAccount";
import AddExpences from "@/components/account/expences/AddExpences";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function bankAccount() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Expences" />
            <div className="space-y-6">
                <ComponentCard title="Add Expences" excel={false}>
                    <AddExpences />
                </ComponentCard>
            </div>
        </div>
    );
}
