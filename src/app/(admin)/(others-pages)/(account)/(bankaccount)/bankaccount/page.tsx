import ComponentCard from "@/components/common/ComponentCard";
import ComponentCardList from "@/components/common/ComponentCardList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bank Account" />
      <div className="space-y-6">
        <ComponentCardList title="Bank Account" buttonName={"Add Bank Account"} navigation={"/add-bankaccount"}>
          <BasicTableOne />
        </ComponentCardList>
      </div>
    </div>
  );
}
