import ComponentCard from "@/components/common/ComponentCard";
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
      <PageBreadcrumb pageTitle="Expences" />
      <div className="space-y-6">
        <ComponentCardList title="Expences" buttonName={"Add Expences"} navigation={"/add-expences"}>
          <BasicTableOne />
        </ComponentCardList>
      </div>
    </div>
  );
}
