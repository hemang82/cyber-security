import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScanInProgress from "@/components/cyber/Scan/ScanInProgress";
import { getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security Scan In Progress | CyberSafe",
    description: "Your security assessment is currently being processed by our advanced AI engine.",
};

export const dynamic = "force-dynamic";

export default async function ScanProgressPage({ searchParams, }: { searchParams: Promise<{ id?: string; name?: string; type?: string }> }) {
    const params = await searchParams;
    const resAssetsDetails = await getInventoryView({ id: params.id });
    const scanData = resAssetsDetails?.data || resAssetsDetails;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            <div className="">
                <PageBreadcrumb pageTitle="Analysis in Progress" parentName="Scans" parentPath="/scan" />
                <ScanInProgress
                    assetName={scanData?.asset_name || scanData?.target || params.name || "your asset"}
                    assetType={scanData?.asset_type || params.type || ""}
                />
            </div>
        </div>
    );
}
