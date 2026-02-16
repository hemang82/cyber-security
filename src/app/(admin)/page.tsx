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

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-4">
      <div className="col-span-12">
        <CyberDashboard inventory={InventoryData?.length > 0 ? InventoryData : []} />
      </div>
    </div>
  );
}
