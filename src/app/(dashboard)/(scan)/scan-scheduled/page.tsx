import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ScanScheduled from "@/components/cyber/Scan/ScanScheduled";
import { getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security Scan Scheduled | CyberSafe",
    description: "Your security assessment has been scheduled and is queued for analysis.",
};

export const dynamic = "force-dynamic";

export default async function ScanScheduledPage({ searchParams, }: { searchParams: Promise<{ id?: string; name?: string; type?: string; time?: string; scan_type?: string }> }) {
    const params = await searchParams;
    const resAssetsDetails = await getInventoryView({ id: params.id });
    const scanData = resAssetsDetails?.data || resAssetsDetails;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            <div className="">
                <PageBreadcrumb pageTitle="Scheduled Analysis" parentName="Scans" parentPath="/scan" />
                <ScanScheduled
                    assetName={scanData?.asset_name || scanData?.target || params.name || "your asset"}
                    assetType={scanData?.asset_type || params.type || ""}
                    scheduledAt={scanData?.scheduled_at || params.time}
                    scanType={scanData?.scan_type || params.scan_type}
                />
            </div>
        </div>
    );
}
