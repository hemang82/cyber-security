import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ASSETS_KEYS } from "@/components/cyber/Inventory/Assets/AssetsTypes";
import CloudDetails from "@/components/cyber/Inventory/assetsDetails/CloudDetails";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
    description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
};

export default async function InventoryView({ searchParams, }: { searchParams: Promise<{ id?: string }> }) {

    const params = await searchParams;

    const resAssetsDetails = await getInventoryView({ id: params?.id })

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" />
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
