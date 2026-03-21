"use client";
import { RiEarthLine, RiInformationLine, RiStockLine } from "react-icons/ri";
import { formatDate, safeText } from "@/common/commonFunction";
import DynamicTable from "@/components/tables/DynamicTable";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { CyberDashboardProps } from "../cyber/Dashboard/CyberDashboard";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false, });

import { ASSETS, FINDINGS_COLORS } from "../cyber/Inventory/Assets/AssetsTypes";

type VulnerabilityItem = {
  label: string;
  count: number;
  percent: number;
  color: string;
};

export default function StatisticsChart({ inventory = [], allScans = [], riskCounts, domains = [] }: CyberDashboardProps) {

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
    { label: "Critical", count: safeRiskInteractions.Critical, percent: totalRiskCount > 0 ? (safeRiskInteractions.Critical / totalRiskCount) * 100 : 0, color: FINDINGS_COLORS.Critical },
    { label: "High", count: safeRiskInteractions.High, percent: totalRiskCount > 0 ? (safeRiskInteractions.High / totalRiskCount) * 100 : 0, color: FINDINGS_COLORS.High },
    { label: "Medium", count: safeRiskInteractions.Medium, percent: totalRiskCount > 0 ? (safeRiskInteractions.Medium / totalRiskCount) * 100 : 0, color: FINDINGS_COLORS.Medium },
    { label: "Low", count: safeRiskInteractions.Low, percent: totalRiskCount > 0 ? (safeRiskInteractions.Low / totalRiskCount) * 100 : 0, color: FINDINGS_COLORS.Low },
    { label: "Info", count: safeRiskInteractions.Info, percent: totalRiskCount > 0 ? (safeRiskInteractions.Info / totalRiskCount) * 100 : 0, color: FINDINGS_COLORS.Info },
  ];

  // --- 2. Automated vs Manual Scan Logic ---
  const scanTypeCounts = {
    automated: 0,
    manual: 0
  };

  allScans?.forEach((item: any) => {
    // We check for 'manual' trigger or source to distinguish.
    // If no field is present, we'll assume a 70/30 split for demo purposes or keep as 0 if empty.
    const isManual = item.trigger?.toLowerCase() === 'manual' || item.source?.toLowerCase() === 'manual' || item.asset_type === 'manual';
    if (isManual) {
      scanTypeCounts.manual++;
    } else {
      scanTypeCounts.automated++;
    }
  });

  // Strictly use actual counts even if manual is 0
  const displayAutomated = scanTypeCounts.automated || (allScans?.length || 0);
  const displayManual = scanTypeCounts.manual || 0;

  const automatedScanSeries = [displayAutomated, displayManual];

  const automatedScanOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: ["Automated", "Manual"],
    colors: ["#3b82f6", "#f59e0b"], // Blue, Orange
    legend: { position: "bottom", horizontalAlign: "center", fontSize: "14px", },
    plotOptions: {
      pie: {
        donut: {
          size: "82%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "History",
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              formatter: () => String(allScans?.length || 0),
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

  // --- 3. New Chart: Asset Distribution (Total Inventory) ---
  const assetCounts: Record<string, number> = {};
  ASSETS.forEach(asset => (assetCounts[asset.key] = 0));

  inventory.forEach((item: any) => {
    let type = (item.asset_type || item.type || "").toLowerCase();
    if (type === "website" || type === "web") type = "web_app";
    else if (type === "mobile") type = "app";

    if (assetCounts.hasOwnProperty(type)) {
      assetCounts[type]++;
    }
  });

  const assetSeries = [{ name: "Assets", data: ASSETS.map(asset => assetCounts[asset.key]) }];

  const assetOptions: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: ASSETS.map(asset => (FINDINGS_COLORS as any)[asset.key] || "#94a3b8"),
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "15%",
        distributed: true,
      },
    },
    dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ["#374151"] } },
    xaxis: {
      categories: ASSETS.map(asset => asset.title),
      tickPlacement: 'on',
      title: { text: "Asset Category", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      title: { text: "Asset Count", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      show: true, labels: { style: { fontSize: '12px', colors: "#6b7280" } },
    },
    grid: { show: true, borderColor: "#f1f5f9", yaxis: { lines: { show: true } } },
    legend: { show: false },
    tooltip: { theme: "light" },
  };

  // --- 4. New Chart: Scan Distribution (Total Scans) ---
  const scanCounts: Record<string, number> = {};
  ASSETS.forEach(asset => (scanCounts[asset.key] = 0));

  allScans.forEach((item: any) => {
    let type = (item.asset_type || item.type || "").toLowerCase();
    if (type === "website" || type === "web") type = "web_app";
    else if (type === "mobile") type = "app";

    if (scanCounts.hasOwnProperty(type)) {
      scanCounts[type]++;
    }
  });

  const scanSeries = [{ name: "Scans", data: ASSETS.map(asset => scanCounts[asset.key]) }];

  const scanOptions: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: ASSETS.map(asset => (FINDINGS_COLORS as any)[asset.key] || "#94a3b8"),
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "15%",
        distributed: true,
      },
    },
    dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ["#374151"] } },
    xaxis: {
      categories: ASSETS.map(asset => asset.title),
      tickPlacement: 'on',
      title: { text: "Asset Category", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      title: { text: "Scan Count", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      show: true, labels: { style: { fontSize: '12px', colors: "#6b7280" } },
    },
    grid: { show: true, borderColor: "#f1f5f9", yaxis: { lines: { show: true } } },
    legend: { show: false },
    tooltip: { theme: "light" },
  };

  // --- 4. New Chart: Security Overview (Vulnerability Dynamics Style) ---
  const securityCounts: Record<string, { fixed: number; notFixed: number }> = {};
  ASSETS.forEach(asset => (securityCounts[asset.key] = { fixed: 0, notFixed: 0 }));

  inventory.forEach((item: any) => {
    let type = (item.asset_type || item.type || "").toLowerCase();
    if (type === "website" || type === "web") type = "web_app";
    else if (type === "mobile") type = "app";

    const risk = (item.risk_level || "").toLowerCase();
    const isFixed = risk.includes("safe") || risk.includes("low");

    if (securityCounts[type]) {
      if (isFixed) securityCounts[type].fixed++;
      else securityCounts[type].notFixed++;
    }
  });

  const securitySeries = [
    {
      name: "Fixed",
      data: ASSETS.map(asset => securityCounts[asset.key].fixed)
    },
    {
      name: "Not Fixed",
      data: ASSETS.map(asset => securityCounts[asset.key].notFixed)
    }
  ];

  const securityOptions: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: "Outfit, sans-serif", stacked: false },
    colors: [FINDINGS_COLORS.Low, FINDINGS_COLORS.Critical],
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "25%",
      },
    },
    dataLabels: { enabled: false },

    xaxis: {
      categories: ASSETS.map(asset => asset.title),
      tickPlacement: 'on',
      title: { text: "Asset Type", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      title: { text: "Asset Count", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      show: true,
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    grid: { show: true, borderColor: "#e5e7eb", yaxis: { lines: { show: true } } },
    legend: { position: 'bottom', horizontalAlign: 'center', },
    tooltip: { theme: "light" },
  };

  // --- 5. Real Data Calculation: Security Score Trend ---
  const typeTrendMap: Record<string, Record<string, { total: number; count: number }>> = {};
  const allDatesSet = new Set<string>();

  inventory.forEach((item: any) => {
    const rawDate = item.scanned_at || item.created_at;
    if (!rawDate) return;

    const dateKey = formatDate(rawDate, "YYYY-MM-DD");
    allDatesSet.add(dateKey);

    let type = (item.asset_type || item.type || "").toLowerCase();
    if (type === "web_app" || type === "website" || type === "web") type = "Web";
    else if (type === "cloud") type = "Cloud";
    else if (type === "app" || type === "mobile") type = "Mobile";
    else type = "Other";

    if (!typeTrendMap[type]) typeTrendMap[type] = {};
    if (!typeTrendMap[type][dateKey]) typeTrendMap[type][dateKey] = { total: 0, count: 0 };

    const score = Number(item?.security_score || item?.full_response?.security_score) || 0;
    if (score > 0) {
      typeTrendMap[type][dateKey].total += score;
      typeTrendMap[type][dateKey].count++;
    }
  });

  // Sort dates chronologically
  const sortedDates = Array.from(allDatesSet).sort();
  const displayDates = sortedDates.map(d => formatDate(d, "MMM DD"));

  // Generate series for each type
  const securityTrendSeries = Object.keys(typeTrendMap).map(type => ({
    name: type,
    data: sortedDates.map(date => {
      const entry = typeTrendMap[type][date];
      return entry ? Math.round(entry.total / entry.count) : null;
    })
  }));

  const securityTrendOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      zoom: { enabled: false },
    },
    colors: ["#2563eb", "#10b981", "#f59e0b", "#6366f1"], // Different colors for types
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 6 }
    },
    dataLabels: {
      enabled: false, // Turn off for cleaner multi-line chart
    },
    xaxis: {
      categories: displayDates.length > 0 ? displayDates : ["N/A"],
      title: { text: "Scan Date", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '12px', colors: "#6b7280" } }
    },
    yaxis: {
      title: { text: "Security Score (%)", style: { fontSize: '12px', fontWeight: 600, color: "#6b7280" } },
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { style: { fontSize: '12px', colors: "#6b7280" }, formatter: (val) => val.toFixed(0) },
    },
    grid: { show: true, borderColor: "#f1f5f9", strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    legend: { show: true, position: 'top', horizontalAlign: 'right', },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => (val !== null ? `${val}%` : "No Data") },
      marker: { show: true }
    },
  };

  // --- 6. Table Columns for Recent Domains ---
  const domainColumns = [
    {
      key: "domain",
      title: "Domain",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block max-w-[300px]" title={row.domain}>
          {safeText(row.domain)}
        </span>
      )
    },
    {
      key: "status",
      title: "Status",
      className: "min-w-[100px]",
      render: (row: any) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.status?.toLowerCase() === 'verified' ? 'bg-green-100 text-green-700' :
          row.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-500'
          }`}>
          {row.status || 'Pending'}
        </span>
      )
    },
    {
      key: "created_at",
      title: "Date",
      className: "min-w-[100px]",
      render: (row: any) => (
        <span className="text-[11px] text-gray-500">
          {formatDate(row.created_at, "DD/MM/YY")}
        </span>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

      {/* 3. Total Inventory (Asset Distribution) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Total Inventory</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Calculated based on the latest scan of each unique asset to avoid double counting." />
        </div>
        <ReactApexChart options={assetOptions} series={assetSeries} type="bar" height={320} />
      </div>

      {/* 4. Total Scans (Scan History) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Total Scans</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Historical count of every scan performed for each asset category." />
        </div>
        <ReactApexChart options={scanOptions} series={scanSeries} type="bar" height={320} />
      </div>

      {/* 5. Vulnerability Dynamics (Security Overview) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Vulnerability Dynamics</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Comparison of Healthy (Safe/Low) vs Vulnerable assets based on their most recent scan results." />
        </div>
        <ReactApexChart options={securityOptions} series={securitySeries} type="bar" height={320} />
      </div>

      {/* 1. Automated Scans */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Automated / Manual Scans</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Status breakdown (In Progress, Completed, Failed) of all scans recorded in history." />
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <ReactApexChart options={automatedScanOptions} series={automatedScanSeries} type="donut" height={310} width={340} />
        </div>
      </div>

      {/* 2. Vulnerability Distribution */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Vulnerability Distribution</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Risk level breakdown calculated by counting the severity of the latest scan for every unique asset." />
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

      {/* 6. Recent Domains */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden flex flex-col">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <RiEarthLine className="text-blue-500" />
              Recent Domains
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Top 5</span>
            <RiInformationLine className="text-gray-400 cursor-help" title="The 5 most recently added domains for identity verification." />
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <DynamicTable
            columns={domainColumns}
            data={domains?.slice(0, 5) || []}
            className="min-w-full"
          />
        </div>
      </div>

      {/* 5. Security Score Trend */}
      <div className="col-span-1 md:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          {/* <RiStockLine className="text-blue-600 text-xl" /> */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Security Score Trend</h3>
          <RiInformationLine className="text-gray-400 cursor-help" title="Average security score progression over time grouped by asset type." />
        </div>
        <ReactApexChart options={securityTrendOptions} series={securityTrendSeries} type="line" height={320} />
      </div>

    </div>
  );

}
