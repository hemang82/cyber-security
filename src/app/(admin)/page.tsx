import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";

export const metadata: Metadata = {
  title: "CyberSafe Dashboard | Security Insights & Threat Monitoring",
  description: "Comprehensive dashboard for real-time security monitoring, vulnerability scores, and critical threat alerts for your digital assets.",
  keywords: ["CyberSecurity Dashboard", "Threat Monitoring", "Vulnerability Management", "Security Insights", "Real-time Security Alerts"],
};

import { getScanList } from "@/lib/server/ServerApiCall";
import CyberDashboard from "@/components/cyber/Dashboard/CyberDashboard";

export default async function Page() {
  const InventoryData = await getScanList({ page: "1", page_size: "5" });
  const scans = InventoryData?.scans || (Array.isArray(InventoryData) ? InventoryData : []);

  // Calculate risk counts
  const riskCounts: any = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Safe: 0,
    Info: 0
  };

  if (Array.isArray(scans)) {
    scans.forEach((item: any) => {
      const risk = (item?.risk_level || "").toLowerCase();
      if (risk.includes("critical")) riskCounts.Critical++;
      else if (risk.includes("high")) riskCounts.High++;
      else if (risk.includes("medium")) riskCounts.Medium++;
      else if (risk.includes("low")) riskCounts.Low++;
      else if (risk.includes("safe")) riskCounts.Safe++;
      else riskCounts.Info++;
    });
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-4">
      <div className="col-span-12">
        <CyberDashboard
          inventory={scans}
          riskCounts={riskCounts}
        />
      </div>
    </div>
  );
}
