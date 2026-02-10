import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryComponent from "@/components/cyber/Inventory/InventoryComponent";
import { getInventory } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
  description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function Page() {

  const InventoryData = await getInventory();

  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory" />
      <div className="space-y-6">
        <ComponentCard title="Inventory" 
        buttonName={"Add Inventory "}
         navigation={"/add-inventory"} excel={false}>
          <InventoryComponent
           InventoryData={InventoryData?.length > 0 ? InventoryData : []} />
        </ComponentCard>
      </div>
    </div>
  );
}
