import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryComponent from "@/components/cyber/Inventory/InventoryComponent";
import { getInventoryList } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/common/Skeleton";

export const metadata: Metadata = {
  title: "Asset Inventory Management | CyberSafe Digital Assets",
  description: "Monitor and manage your organization's digital assets including domains, sub-domains, cloud infrastructure, and verified assets for continuous security.",
  keywords: ["Security Inventory", "Asset Management", "Domain Monitoring", "Digital Infrastructure Security", "Asset Tracking"],
};

export const dynamic = "force-dynamic";

async function InventoryContent({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "10";

  const InventoryData = await getInventoryList({
    page: page,
    page_size: pageSize
  });

  return <InventoryComponent InventoryData={InventoryData} />;
}

export default function Page({ searchParams }: any) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory" />
      <div className="space-y-6">
        <ComponentCard
          title="Inventory"
          buttonName={"Add Asset "}
          navigation={"/add-inventory"}
          excel={false}
        >
          <Suspense fallback={<TableSkeleton />}>
            <InventoryContent searchParams={searchParams} />
          </Suspense>
        </ComponentCard>
      </div>
    </div>
  );
}
