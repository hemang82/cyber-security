import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ASSETS_KEYS } from "@/components/cyber/Inventory/Assets/AssetsTypes";
import CloudDetails from "@/components/cyber/Inventory/assetsDetails/CloudDetails";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails, getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default async function InventoryDetails({ searchParams, }: { searchParams: Promise<{ id?: string }> }) {

    const params = await searchParams;

    const resAssetsDetails = await getInventoryView({ id: params.id })

    console.log('resAssetsDetails Server', ASSETS_KEYS?.cloud, "resAssetsDetails?.asset_type == ASSETS_KEYS?.cloud", resAssetsDetails?.asset_type == ASSETS_KEYS?.cloud, resAssetsDetails);

    return (
        <div>
            <PageBreadcrumb pageTitle="Asset Details" />
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
