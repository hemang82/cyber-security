import ComponentCard from "@/components/common/ComponentCard";
import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryComponent from "@/components/cyber/Inventory/InventoryComponent";
import ScanComponent from "@/components/cyber/Inventory/ScanComponent";
import { getScanList } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
  description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function Page({ searchParams }: any) {
  const params = await searchParams;
  const ScanHistory = await getScanList({ assetId: params?.assets_id });
  console.log("ScanHistory ScanHistory", ScanHistory);

  return (
    <div>
      <PageBreadcrumb pageTitle="Scan History" />
      <div className="space-y-6">
        <ComponentCard title="Scan History"
          buttonName={"Scan Assets"}
          navigation={"/add-asset"} excel={false}>
          <Suspense fallback={<div>Loading...</div>}>
            <ScanComponent ScanHistory={ScanHistory?.length > 0 ? ScanHistory : []} />
          </Suspense>
        </ComponentCard>
      </div>
    </div>
  );
}
