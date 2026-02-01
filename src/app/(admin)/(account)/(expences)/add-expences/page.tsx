import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import AddPurchaseComponent from "@/components/account/purchase/AddPurchaseComponent";
import AddBankAccount from "@/components/account/bankaccounts/AddBankAccount";
import AddExpences from "@/components/account/expences/AddExpences";
import { listPartyAPI } from "@/lib/apiManager/APICalling/AccountAPI";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default async function page() {
      const partyList = await listPartyAPI({})
    
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Expences" />
            <div className="space-y-6">
                <ComponentCard title="Add Expences" excel={false}>
                    <AddExpences partyList={partyList}/>
                </ComponentCard>
            </div>
        </div>
    );
}
