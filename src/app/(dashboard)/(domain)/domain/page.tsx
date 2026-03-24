import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DomainComponent from "@/components/cyber/domain/DomainComponent";
import { listDomain } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { TableSkeleton } from "@/components/common/Skeleton";

export const metadata: Metadata = {
  title: "Verified Domain Management | CyberSafe DNS Security",
  description: "View and manage your verified domains. Check DNS vulnerability status, verify ownership, and track domain security reputation.",
  keywords: ["Domain Security", "Verified Domains", "DNS Protection", "Ownership Verification", "CyberSecurity DNS Tracking"],
};

export const dynamic = "force-dynamic";

async function DomainContent({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "15";

  const resDomainList = await listDomain({
    page: page,
    page_size: pageSize,
    assetId: params?.assets_id || ""
  });

  return <DomainComponent resDomainList={resDomainList} />;
}

export default function Page({ searchParams }: any) {
  return (
    <div>
      <PageBreadcrumb pageTitle="All Domains" />
      <div className="space-y-6">
          <Suspense fallback={<TableSkeleton />}>
            <DomainContent searchParams={searchParams} />
          </Suspense>
      </div>
    </div>
  );
}
