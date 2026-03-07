import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ASSETS_KEYS } from "@/components/cyber/Inventory/Assets/AssetsTypes";
import CloudDetails from "@/components/cyber/Inventory/assetsDetails/CloudDetails";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails, getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Asset Security Analysis | CyberSafe View",
    description: "In-depth analysis of your security assets. View comprehensive reports on cloud vulnerabilities and website safety status.",
    keywords: ["Security Analysis", "Asset Monitoring", "Cloud Vulnerability Report", "Website Security Audit"],
};

export const dynamic = "force-dynamic";

export default async function InventoryDetails({ searchParams, }: { searchParams: Promise<{ id?: string }> }) {

    const params = await searchParams;

    const resAssetsDetails = await getInventoryView({ id: params.id })

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
