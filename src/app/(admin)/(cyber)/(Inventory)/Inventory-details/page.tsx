import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asset Security Details | CyberSafe Inventory View",
    description: "Deep dive into asset-specific security details. View SSL status, DNS records, and vulnerability reports for selected inventory items.",
    keywords: ["Security Details", "Asset Audit", "Individual Asset Security", "SSL/DNS Inventory Details"],
};

export const dynamic = "force-dynamic";

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
