import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DominComponent from "@/components/cyber/domin/DominComponent";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { listDomain } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verified Domain Management | CyberSafe DNS Security",
  description: "View and manage your verified domains. Check DNS vulnerability status, verify ownership, and track domain security reputation.",
  keywords: ["Domain Security", "Verified Domains", "DNS Protection", "Ownership Verification", "CyberSecurity DNS Tracking"],
};

export default async function Page({ searchParams }: any) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "15";

  const resDomainList = await listDomain({
    page: page,
    page_size: pageSize,
    assetId: params?.assets_id || ""
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="All Domains" />
      <div className="space-y-6">
        <ComponentCard
          title="All Domains"
          desc="Note: TXT records may take some time to appear. Please click the refresh button after a few minutes."
          buttonName={"Add Domain"}
          navigation={"/add-domin"}
        >
          <DominComponent resDomainList={resDomainList} />
        </ComponentCard>
      </div>
    </div>
  );
}
