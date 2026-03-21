import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ASSETS_KEYS } from "@/components/cyber/Inventory/Assets/AssetsTypes";
import CloudDetails from "@/components/cyber/Inventory/assetsDetails/CloudDetails";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import ApplicationDetails from "@/components/cyber/Inventory/assetsDetails/ApplicationDetails";
import ScanInProgress from "@/components/cyber/Scan/ScanInProgress";
import { getInventoryDetails, getInventoryView } from "@/lib/server/ServerApiCall";
import { normalizeStatus } from "@/common/commonFunction";
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

    // Normalize the data object (some APIs return it nested, some don't)
    const scanData = resAssetsDetails?.data || resAssetsDetails;

    // Check if the scan is actually in an active/not-ready state
    // const rawStatus = (scanData?.status || "").toUpperCase();
    // const status = normalizeStatus(rawStatus);

    // We consider it "InProgress" if it matches any ongoing state or if it's PENDING
    // const isInProgress = (
    //     status === "IN_PROGRESS" ||
    //     rawStatus === "PENDING" ||
    //     rawStatus === "IN PROGRESS" ||
    //     rawStatus === "PROCESSING" ||
    //     rawStatus === "QUEUED" ||
    //     rawStatus === "INITIALIZING" ||
    //     rawStatus === "WAITING" ||
    //     (!rawStatus && scanData?.asset_type) // If we have base data but no status, assume initializing if it came from a recent scan click
    // );

    // // If scan is still in progress, show the dedicated high-fidelity InProgress component
    // if (isInProgress) {
    //     return (
    //         <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
    //             <PageBreadcrumb pageTitle="Security Analysis In-Progress" />
    //             <div className="p-4 lg:p-10">
    //                 <ScanInProgress assetName={scanData?.asset_name || scanData?.target || "your asset"} />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div>
            <PageBreadcrumb pageTitle="Asset Details" parentName="Scan History" parentPath="/scan" />
            <div className="space-y-6">
                {
                    scanData?.asset_type == "app" ? (
                        <ApplicationDetails resAssetsDetails={scanData} />
                    ) : scanData?.asset_type == "cloud" ? (
                        <CloudDetails resAssetsDetails={scanData} />
                    ) : (
                        <WebsiteDetails resAssetsDetails={scanData} />
                    )
                }
            </div>
        </div>
    );
}
