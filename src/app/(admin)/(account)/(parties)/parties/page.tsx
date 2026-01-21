// import AddSalesComponent from "@/components/account/sales/AddSalesComponent";
import AddSalesComponent from "@/components/account/sales/AddSalesComponent";
import ComponentCardList from "@/components/common/ComponentCardList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Parties" />
      <div className="space-y-6">
        <ComponentCardList title="Parties" buttonName={"Parties"} navigation={"/add-parties"}>
        <></>
          {/* <AddSalesComponent /> */}
        </ComponentCardList>
      </div>
    </div>
  );
}
