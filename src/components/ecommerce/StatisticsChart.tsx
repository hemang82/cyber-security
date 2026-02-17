"use client";
import { RiInformationLine, RiStockLine } from "react-icons/ri";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { CyberDashboardProps } from "../cyber/Dashboard/CyberDashboard";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false, });

const STATUS_COLORS = {
  BLUE: "#3b83f6bd",
  WARNING: "#eab20896",
  SUCCESS: "#10b981ce",
  DANGER: "#ef4444d2",
  ORANGE: "#f97416d3",
  INFO: "#354155",
};


type VulnerabilityItem = {
  label: string;
  count: number;
  percent: number;
  color: string;
};

export default function StatisticsChart({ inventory = [], riskCounts }: CyberDashboardProps) {

  // --- 1. Old Chart: Vulnerability Distribution Data ---
  // Using static data as requested, matching the screenshot style roughly
  // Ensure riskCounts has default values to prevent undefined errors
  const safeRiskInteractions = {
    Critical: riskCounts?.Critical || 0,
    High: riskCounts?.High || 0,
    Medium: riskCounts?.Medium || 0,
    Low: riskCounts?.Low || 0,
    Info: riskCounts?.Info || 0,
  };

  const totalRiskCount =
    safeRiskInteractions.Critical +
    safeRiskInteractions.High +
    safeRiskInteractions.Medium +
    safeRiskInteractions.Low +
    safeRiskInteractions.Info;

  // Improve Avg Risk Score Calculation (Example: Weighted average or simple average of counts)
  // Current logic seems to be average count? Or weighted score? 
  // Sticking to safe sum / 5 for now as per user intent, but making it safe.
  const avgRiskScore = totalRiskCount > 0 ? (totalRiskCount / 5).toFixed(1) : "0";


  // --- 1. Old Chart: Vulnerability Distribution Data ---
  const vulnerabilityData: VulnerabilityItem[] = [
    { label: "Critical", count: safeRiskInteractions.Critical, percent: totalRiskCount > 0 ? (safeRiskInteractions.Critical / totalRiskCount) * 100 : 0, color: STATUS_COLORS.DANGER },
    { label: "High", count: safeRiskInteractions.High, percent: totalRiskCount > 0 ? (safeRiskInteractions.High / totalRiskCount) * 100 : 0, color: STATUS_COLORS.ORANGE },
    { label: "Medium", count: safeRiskInteractions.Medium, percent: totalRiskCount > 0 ? (safeRiskInteractions.Medium / totalRiskCount) * 100 : 0, color: STATUS_COLORS.WARNING },
    { label: "Low", count: safeRiskInteractions.Low, percent: totalRiskCount > 0 ? (safeRiskInteractions.Low / totalRiskCount) * 100 : 0, color: STATUS_COLORS.SUCCESS },
    { label: "Info", count: safeRiskInteractions.Info, percent: totalRiskCount > 0 ? (safeRiskInteractions.Info / totalRiskCount) * 100 : 0, color: STATUS_COLORS.INFO },
  ];

  // --- 2. Old Chart: Automated Scan Data ---
  const automatedScanSeries = [0, inventory?.length, 0, 0]; // 2 Completed


  const automatedScanOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: ["In Progress", "Completed", "Failed", "Scheduled"],
    colors: ["#3b82f6", "#10b981", "#ef4444", "#9ca3af"], // Blue, Green, Red, Gray
    legend: { position: "bottom", horizontalAlign: "center", fontSize: "14px", },
    plotOptions: {
      pie: {
        donut: {
          size: "85%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              formatter: () => String(inventory?.length || 0),
            },
            value: {
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              offsetY: 8,
            }
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: { enabled: true },
  };

  // --- 3. New Chart: Asset Distribution (Total Inventory Style) ---
  const assetCounts = { web_app: inventory?.length, api: 0, cloud: 0 };
  inventory.forEach((item: any) => {
    if (item.type === "web_app") assetCounts.web_app++;
    else if (item.type === "api") assetCounts.api++;
    else if (item.type === "cloud") assetCounts.cloud++;
  });

  const assetSeries = [{ name: "Count", data: [assetCounts.cloud, 0, assetCounts.api, assetCounts.web_app, 0, 0, 0] }]; // Match order: Cloud, Network, API, Web, Mobile, Desktop, SCR
  const assetOptions: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: ["#1e40af"], // Dark Blue for bars
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "25%", // Thinner bars
        distributed: false, // Single color
      },
    },
    dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ["#374151"] } },
    xaxis: {
      categories: ["Cloud", "Network", "API", "Web", "Mobile", "Desktop", "SCR"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      show: true,
      labels: { style: { fontSize: '12px', colors: "#6b7280" } },
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 0,
      position: 'back',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }, // Horizontal lines only
    },
    legend: { show: false },
    tooltip: { theme: "light" },
  };

  // --- 4. New Chart: Security Overview (Vulnerability Dynamics Style) ---
  const totalAssets = inventory.length;
  let criticalThreats = 0;
  inventory.forEach((item: any) => {
    const risk = item.risk_level?.toLowerCase();
    if (risk === "critical" || risk === "high") criticalThreats++;
  });
  const safeAssets = totalAssets - criticalThreats;

  // Use dummy "Fixed" vs "Not Fixed" logic for visual match, or map real data if available.
  // Mapping real data: Fixed (Safe), Not Fixed (Critical/High)
  const securitySeries = [
    { name: "Fixed", data: [0, 0, 0, safeAssets, 0, 0, 0] }, // Green
    { name: "Not Fixed", data: [0, 0, 0, criticalThreats, 0, 0, 0] } // Red
  ];

  const securityOptions: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif", stacked: false },
    colors: ["#10b981", "#ef4444"], // Green, Red
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "40%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Cloud", "Network", "API", "Web", "Mobile", "Desktop", "SCR"], // Match layout
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: { show: true, labels: { style: { fontSize: '12px', colors: "#6b7280" } } },
    grid: { show: true, borderColor: "#e5e7eb", yaxis: { lines: { show: true } } },
    legend: { position: 'bottom', horizontalAlign: 'center', },
    tooltip: { theme: "light" },
  };

  // --- 5. New Chart: Security Score Trend ---
  const securityTrendSeries = [
    { name: "Security Score", data: [75, 90, 65, 70, 80, 75, 68] }
  ];
  const securityTrendOptions: ApexOptions = {
    chart: { type: "line", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif", zoom: { enabled: false } },
    colors: ["#2563eb"], // Blue
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5, colors: ["#2563eb"], strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["02-10", "02-11", "02-12", "02-13", "02-14", "02-15", "02-16"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: { style: { fontSize: '12px', colors: "#6b7280" }, formatter: (val) => val.toFixed(0) },
    },
    grid: { show: true, borderColor: "#e5e7eb", strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    legend: { show: true, position: 'top', horizontalAlign: 'left', },
    tooltip: { theme: "light", y: { formatter: (val) => `${val}%` } },
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

      {/* 3. Total Inventory (Asset Distribution) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Total Inventory</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Distribution of assets by type" />
        </div>
        <ReactApexChart options={assetOptions} series={assetSeries} type="bar" height={320} />
      </div>

      {/* 4. Vulnerability Dynamics (Security Overview) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Vulnerability Dynamics</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Fixed vs Not Fixed vulnerabilities" />
        </div>
        <ReactApexChart options={securityOptions} series={securitySeries} type="bar" height={320} />
      </div>

      {/* 1. Vulnerability Distribution */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Vulnerability Distribution</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Breakdown by risk level" />
        </div>
        <div className="space-y-5">
          {vulnerabilityData.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-24 text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</div>
              <div className="relative h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500`} style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
              </div>
              <div className="w-20 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.count} <span className="text-gray-400">({Math.round(item.percent)}%)</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            Avg Risk Score: <span className="text-gray-900 dark:text-white font-bold">{avgRiskScore}</span>
          </div>
          <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            Total: <span className="text-gray-900 dark:text-white font-bold">{totalRiskCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Automated Scans */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Automated Scans</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Status of automated scans" />
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <ReactApexChart options={automatedScanOptions} series={automatedScanSeries} type="donut" height={350} width={380} />
        </div>
      </div>

      {/* 5. Security Score Trend */}
      <div className="col-span-1 md:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          {/* <RiStockLine className="text-blue-600 text-xl" /> */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Security Score Trend</h3>
        </div>
        <ReactApexChart options={securityTrendOptions} series={securityTrendSeries} type="line" height={320} />
      </div>

    </div>
  );
}
