import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DominComponent from "@/components/cyber/domin/DominComponent";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { listDomain } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function page() {

  const resDomainList = await listDomain();

  return (
    <div>
      <PageBreadcrumb pageTitle="Domin" />
      <div className="space-y-6">
        <ComponentCard title="Domin" buttonName={"Add Domin"} navigation={"/add-domin"} >
          <DominComponent resDomainList={resDomainList} />
        </ComponentCard>
      </div>
    </div>
  );
}
