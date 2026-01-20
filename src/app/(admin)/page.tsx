import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";

export const metadata: Metadata = {
  title: "CyberSafe Dashboard | Cyber Security Monitoring & Threat Analysis",
  description: "CyberSafe Dashboard for real-time cyber security monitoring, vulnerability assessment, threat detection, and system protection management.",
};

export default function Ecommerce() {

  // redirect("/signin");
  return (<>
    <div className="grid grid-cols-12 gap-4 md:gap-4">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics />
        {/* <MonthlySalesChart /> */}
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}

    </div>
  </>);
}
