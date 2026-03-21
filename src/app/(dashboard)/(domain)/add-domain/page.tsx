import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AddDomain from "@/components/cyber/domain/AddDomain";

export const metadata: Metadata = {
    title: "Verify New Domain | CyberSafe DNS Setup",
    description: "Start the domain verification process to enable continuous security monitoring, DNS auditing, and SSL tracking for your new domain.",
    keywords: ["Domain Verification", "DNS Setup", "Verify Ownership", "Security Onboarding"],
};

export const dynamic = "force-dynamic";

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Add Domain" parentName="All Domains" parentPath="/domain" />
            <div className="space-y-6">
                <ComponentCard  >
                    <AddDomain />
                </ComponentCard>
            </div>
        </div>
    );
}
