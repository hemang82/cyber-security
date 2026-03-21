import ComponentCard from "@/components/common/ComponentCard";
import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScanComponent from "@/components/cyber/Inventory/ScanComponent";
import { getInventoryList, getScanList } from "@/lib/server/ServerApiCall";
import AssetFilter from "@/components/cyber/Inventory/AssetFilter";
import { Metadata } from "next";
import { TableSkeleton } from "@/components/common/Skeleton";

export const metadata: Metadata = {
  title: "Security Scan History | CyberSafe Vulnerability Audit",
  description: "Access your historical security scan results. Track vulnerability trends, security scores, and remediation progress over time.",
  keywords: ["Vulnerability Scan History", "Security Audit Logs", "CyberSecurity Reports", "Automated Scan History", "Threat Assessment History"],
};

export const dynamic = "force-dynamic";

// This component ONLY fetches the scan list, making it faster
async function ScanContent({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "15";
  const assetId = params?.assets_id || "";

  const ScanHistory = await getScanList({
    assetId: assetId,
    page: page,
    page_size: pageSize
  });

  return (
    <ScanComponent ScanHistory={ScanHistory} />
  );
}

export default async function Page({ searchParams }: any) {
  // Fetch inventory list once at the page level. 
  // Inventory is shared and doesn't change every filter click.
  const resInventoryList = await getInventoryList();

  return (
    <div>
      <PageBreadcrumb pageTitle="Scan History" />
      <div className="space-y-6">
        <ComponentCard title="" buttonName={"Scan Assets"} navigation={"/add-asset"} excel={false} extraHeader={<AssetFilter resInventoryList={resInventoryList} />}>
          {/* We do NOT use a key here anymore. 
              Next.js Transition handles the swapping smoothly. */}
          {/* <Suspense fallback={<></>}> */}
          <ScanContent searchParams={searchParams} />
          {/* </Suspense> */}
        </ComponentCard>
      </div>
    </div>
  );
}
