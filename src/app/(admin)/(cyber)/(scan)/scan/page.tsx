import ComponentCard from "@/components/common/ComponentCard";
import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryComponent from "@/components/cyber/Inventory/InventoryComponent";
import ScanComponent from "@/components/cyber/Inventory/ScanComponent";
import { getInventoryList, getScanList } from "@/lib/server/ServerApiCall";
import AssetFilter from "@/components/cyber/Inventory/AssetFilter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Scan History | CyberSafe Vulnerability Audit",
  description: "Access your historical security scan results. Track vulnerability trends, security scores, and remediation progress over time.",
  keywords: ["Vulnerability Scan History", "Security Audit Logs", "CyberSecurity Reports", "Automated Scan History", "Threat Assessment History"],
};

export default async function Page({ searchParams }: any) {
  const params = await searchParams;
  const page = params?.page || "1";
  const pageSize = params?.page_size || "15";

  const [ScanHistory, resInventoryList] = await Promise.all([
    getScanList({
      assetId: params?.assets_id,
      page: page,
      page_size: pageSize
    }),
    getInventoryList()
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Scan History" />
      <div className="space-y-6">
        <ComponentCard title="" buttonName={"Scan Assets"} navigation={"/add-asset"} excel={false} extraHeader={<AssetFilter resInventoryList={resInventoryList} />}>
          <ScanComponent ScanHistory={ScanHistory} resInventoryList={resInventoryList} />
        </ComponentCard>
      </div>
    </div>
  );
}
