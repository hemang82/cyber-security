import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default async function InventoryDetails({ searchParams, }: { searchParams: Promise<{ url?: string, inventory_id?: String }> }) {
    const params = await searchParams;

    const InventoryData = await getInventoryDetails({ url: params.url, assetId: params.inventory_id })

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" />
            <div className="space-y-6">
                <WebsiteDetails InventoryData={InventoryData} />
            </div>
        </div>
    );
}
