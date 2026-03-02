import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WebsiteDetails from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { getInventoryDetails, getInventoryView } from "@/lib/server/ServerApiCall";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cloud Infrastructure Security | CyberSafe Audit",
    description: "Monitor and audit your cloud infrastructure (AWS, Azure, GCP) for security vulnerabilities, configuration errors, and compliance.",
    keywords: ["Cloud Security Audit", "AWS Monitoring", "Azure Security", "GCP Compliance", "Infrastructure Scanning"],
};

export default async function InventoryDetails({ searchParams, }: { searchParams: Promise<{ id?: string }> }) {

    const params = await searchParams;

    const InventoryData = await getInventoryView({ id: params.id })

    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory Details" />
            <div className="space-y-6">
                <WebsiteDetails InventoryData={InventoryData} />
            </div>
        </div>
    );
}
