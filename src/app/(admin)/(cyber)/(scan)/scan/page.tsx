import ComponentCard from "@/components/common/ComponentCard";
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

export default async function Page() {

  const ScanHistory = await getScanList();

  return (
    <div>
      <PageBreadcrumb pageTitle="Scan History" />
      <div className="space-y-6">
        <ComponentCard title="Scan History"
          buttonName={"Scan Assets"}
          navigation={"/add-asset"} excel={false}>
          <ScanComponent ScanHistory={ScanHistory?.length > 0 ? ScanHistory : []} />
        </ComponentCard>
      </div>
    </div>
  );
}
