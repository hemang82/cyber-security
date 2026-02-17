import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";

export const metadata: Metadata = {
  title: "CyberSafe Dashboard | Cyber Security Monitoring & Threat Analysis",
  description: "CyberSafe Dashboard for real-time cyber security monitoring, vulnerability assessment, threat detection, and system protection management.",
};

import { getScanList } from "@/lib/server/ServerApiCall";
import CyberDashboard from "@/components/cyber/Dashboard/CyberDashboard";

export default async function page() {
  const InventoryData = await getScanList();

  // Calculate risk counts
  const riskCounts: { [key: string]: number; Critical: number; High: number; Medium: number; Low: number; Info: number; } = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Info: 0
  };

  if (Array.isArray(InventoryData)) {
    InventoryData.forEach((item: any) => {
      const risk = item?.risk_level || "Info";
      // Map risk level to key if it matches, otherwise default or ignore? 
      // Assuming risk_level matches keys exactly or close to it. 
      // Let's normalize to title case to match keys: Critical, High, Medium, Low, Info.
      // If the API returns lowercase, we need to handle that. 
      // StatisticsChart uses: riskCounts?.Critical

      // Handle known variations if any, typically just "Critical", "High", etc.
      if (risk === "Critical" || risk === "High" || risk === "Medium" || risk === "Low" || risk === "Info") {
        riskCounts[risk]++;
      } else {
        // specific handling for potential mismatches? 
        // For now, let's assume direct mapping or simple normalization if needed 
        // Looking at other files, it seems valid values are "Critical", "High", etc.
        // Let's try to be robust. 
        const normalized = risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();
        if (Object.prototype.hasOwnProperty.call(riskCounts, normalized)) {
          riskCounts[normalized as keyof typeof riskCounts]++;
        } else {
          riskCounts.Info++; // Default fallback
        }
      }
    });
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-4">
      <div className="col-span-12">
        <CyberDashboard
          inventory={InventoryData?.length > 0 ? InventoryData : []}
          riskCounts={riskCounts}
        />
      </div>
    </div>
  );
}
