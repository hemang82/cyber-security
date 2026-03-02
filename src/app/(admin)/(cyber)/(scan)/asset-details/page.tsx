import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vulnerability Scan Result | CyberSafe Security Audit",
    description: "Detailed security audit results for your asset. Review specific threat vectors, safety scores, and SSL/DNS health reports.",
    keywords: ["Scan Results", "Security Audit", "Threat Vectors", "Asset Security Score"],
};

export default async function InventoryDetails({ searchParams, }: { searchParams: Promise<{ url?: string }> }) {
    const params = await searchParams;

    const InventoryData = await getInventoryDetails({ url: params.url })

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" />
            <div className="space-y-6">
                <WebsiteDetails InventoryData={InventoryData} />
            </div>
        </div>
    );
}
