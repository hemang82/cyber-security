import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ASSETS_KEYS } from "@/components/cyber/Inventory/Assets/AssetsTypes";
import CloudDetails from "@/components/cyber/Inventory/assetsDetails/CloudDetails";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asset Security Summary | CyberSafe Monitoring",
    description: "In-depth summary of asset security parameters. Monitor cloud infrastructure and website endpoints for threats and misconfigurations.",
    keywords: ["Security Summary", "Endpoint Monitoring", "Cloud Infrastructure Audit", "Asset View"],
};

export const dynamic = "force-dynamic";

export default async function InventoryView({ searchParams, }: { searchParams: Promise<{ id?: string }> }) {

    const params = await searchParams;

    const resAssetsDetails = await getInventoryView({ id: params?.id })

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" parentName="Inventory" parentPath="/inventory" />
            <div className="space-y-6">
                {
                    resAssetsDetails?.asset_type == "cloud" ? (
                        <CloudDetails resAssetsDetails={resAssetsDetails} />
                    ) : (
                        <WebsiteDetails resAssetsDetails={resAssetsDetails} />
                    )
                }
            </div>
        </div>
    );
}
