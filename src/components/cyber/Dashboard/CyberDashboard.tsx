"use client";
import React from "react";
import CountUp from "react-countup";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";
import { RiGlobalLine, RiShieldCheckLine, RiAlertLine, RiCheckDoubleLine, RiFileList3Line, RiShieldFlashLine, RiLock2Line, RiServerLine, RiSpyLine, RiCodeLine, RiBugLine, RiEarthLine, RiSpeedUpLine, RiEyeLine, RiApps2Line, RiCloudLine, RiSmartphoneLine } from "react-icons/ri";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { Badge, CyberColorClass } from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DynamicTable from "@/components/tables/DynamicTable";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import { ASSETS } from "../Inventory/Assets/AssetsTypes";
import { GoEye } from "react-icons/go";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";


export interface CyberDashboardProps {
    inventory: any[];
    riskCounts: any;
    allScans?: any[];
    domains?: any[];
}

const COLORS = {
    Critical: "#991B1B", // Dark Red
    High: "#DC2626",     // Red
    Medium: "#EA580C",   // Orange
    Low: "#CA8A04",      // Yellow (instead of green/blue)
    Info: "#2563EB",     // Blue
    Safe: "#16A34A",     // Green
    Unknown: "#9CA3AF"   // Gray
};

export default function CyberDashboard({ inventory = [], domains = [] }: CyberDashboardProps) {
    const router = useRouter();

    // --- Unique Assets Filter (Fix for 3 vs 5 data issue) ---
    // Dashboard should reflect unique assets, not total scan history entries.
    const uniqueAssetsMap = new Map();
    inventory.forEach(item => {
        // Use a persistent identifier like target, asset_name, or name (to distinguish between multiple scans of same asset)
        const id = item?.asset_id || item?.target || item?.asset_name || item?.name;
        const currentTS = new Date(item.scanned_at || item.created_at).getTime();

        if (!uniqueAssetsMap.has(id)) {
            uniqueAssetsMap.set(id, item);
        } else {
            const existing = uniqueAssetsMap.get(id);
            const existingTS = new Date(existing.scanned_at || existing.created_at).getTime();
            if (currentTS > existingTS) {
                uniqueAssetsMap.set(id, item);
            }
        }
    });
    const uniqueAssets = Array.from(uniqueAssetsMap.values());

    // --- Statistics Calculations based on UNIQUE assets ---
    const totalAssets = uniqueAssets.length;
    const totalScans = inventory.length;

    const riskCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
        Info: 0,
        Safe: 0
    };

    let totalScore = 0;
    let scoredAssets = 0;

    uniqueAssets.forEach(item => {
        const riskLevel = item?.risk_level || "Unknown";
        // Use security_score if available, fallback to 0
        const score = Number(item?.security_score || item?.full_response?.security_score) || 0;

        if (score > 0) {
            totalScore += score;
            scoredAssets++;
        }

        // Count risks
        const lowerRisk = riskLevel.toLowerCase();
        if (lowerRisk.includes("critical")) riskCounts.Critical++;
        else if (lowerRisk.includes("high")) riskCounts.High++;
        else if (lowerRisk.includes("medium")) riskCounts.Medium++;
        else if (lowerRisk.includes("low")) riskCounts.Low++;
        else if (lowerRisk.includes("safe")) riskCounts.Safe++;
        else riskCounts.Info++;
    });

    const avgScore = scoredAssets > 0 ? Math.round(totalScore / scoredAssets) : 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    // Chart Data
    const riskData = [
        { name: "Critical", value: riskCounts.Critical, color: COLORS.Critical },
        { name: "High", value: riskCounts.High, color: COLORS.High },
        { name: "Medium", value: riskCounts.Medium, color: COLORS.Medium },
        { name: "Low", value: riskCounts.Low, color: COLORS.Low },
        { name: "Safe", value: riskCounts.Safe, color: COLORS.Safe },
    ].filter(d => d.value > 0);

    const recentScans = [...inventory].sort((a, b) => {
        const dateA = new Date(a.scanned_at || a.created_at).getTime();
        const dateB = new Date(b.scanned_at || b.created_at).getTime();
        return dateB - dateA;
    }).slice(0, 5);

    // Domain Info (Take the latest one for display)
    const latestAsset = recentScans[0];
    const sslInfo = latestAsset?.full_response?.website_security?.ssl_certificate;
    const registrarInfo = latestAsset?.full_response?.domain_information?.whois;

    // --- Columns for Dynamic Table ---
    const columns = [
        {
            key: "target_url",
            title: "Target Asset",
            className: "min-w-[300px]",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        {(row?.asset_type === 'app' || row?.type === 'app') ? <RiApps2Line size={16} /> : (row?.asset_type === 'cloud' || row?.type === 'cloud') ? <RiCloudLine size={16} /> : <RiGlobalLine size={16} />}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white break-all">{safeText(row?.asset_name || row?.name || row?.target)}</span>
                </div>
            )
        },
        {
            key: "asset_type",
            title: "Asset Type",
            className: "min-w-[120px]",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-white break-all">{ASSETS.find((item) => item?.key === (row?.asset_type || row?.type))?.title || "N/A"}</span>
                </div>
            )
        },
        {
            key: "security_score",
            title: "Score",
            className: "min-w-[100px]",

            render: (row: any) => {
                const score = Number(row?.security_score) || 0;
                return (
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold`}>
                            {score}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "risk_level",
            title: "Risk Level",
            className: "min-w-[150px]",
            render: (row: any) => (
                <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CyberColorClass[row?.risk_color as keyof typeof CyberColorClass]}`}>
                    {safeText(row?.risk_level) || "Unknown"}
                </span>
            )
        },
        // {
        //     key: "scanned_at",
        //     title: "Scan Date",
        //     render: (row: any) => (
        //         <span className="text-gray-500 text-sm">
        //             {formatDate(row?.scanned_at, DATE_FORMAT.DASH_DD_MM_YYYY)}
        //         </span>
        //     )
        // },
        {
            key: "action",
            title: "Action",
            render: (row: any) => (
                <Link
                    href={`/inventory-view?id=${encodeURIComponent(row?.id)}`}
                    prefetch={false}
                    onClick={() => router.refresh()}
                    className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                    <GoEye size={18} />
                </Link>
            )
        }
    ];

    console.log("recentScans", recentScans);
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Security Command Center</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive overview of your digital security posture.</p>
                </div>
                {/* <div className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400 animate-pulse">
                    ● System Operational
                </div> */}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

                {/* Total Assets (Unique) */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
                            <RiGlobalLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assets</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={totalAssets} duration={2} />
                        </h3>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full dark:bg-green-900/20 dark:text-green-400">
                            Unique
                        </span>
                    </div>
                </div>

                {/* Total Scans (All History) */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg dark:bg-indigo-900/20 dark:text-indigo-400">
                            <RiSpeedUpLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Scans</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={totalScans} duration={2} />
                        </h3>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full dark:bg-indigo-900/20 dark:text-indigo-400">
                            History
                        </span>
                    </div>
                </div>

                {/* Avg Security Score */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
                            <RiShieldCheckLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Security Score</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={avgScore} duration={2.5} />
                        </h3>
                        <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                </div>

                {/* Critical Threats */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                            <RiAlertLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Threats</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={riskCounts.Critical} duration={2} />
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskCounts.Critical > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-500'}`}>
                            {riskCounts.Critical > 0 ? 'Action' : 'Secure'}
                        </span>
                    </div>
                </div>

                {/* Safe Assets */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                            <RiCheckDoubleLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Healthy Assets</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={riskCounts.Safe + riskCounts.Low} duration={2} />
                        </h3>
                        <span className="text-xs font-medium text-gray-500">
                            Safe/Low
                        </span>
                    </div>
                </div>

            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Charts & Domain Info */}
                <div className="space-y-6 lg:col-span-1">


                    {/* Domain Information Card */}
                    {latestAsset && (
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                {(latestAsset?.asset_type === 'app' || latestAsset?.type === 'app') ? <RiSmartphoneLine className="text-brand-500" /> : (latestAsset?.asset_type === 'cloud' || latestAsset?.type === 'cloud') ? <RiCloudLine className="text-blue-500" /> : <RiEarthLine className="text-blue-500" />}
                                Latest Asset Insight
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Asset</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">{safeText(latestAsset?.name || latestAsset?.asset_name || latestAsset?.name || latestAsset?.target)}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Score</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold`}>
                                                {Number(latestAsset?.security_score || latestAsset?.full_response?.security_score) || 0} / 100
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Risk Level</p>
                                        <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${CyberColorClass[latestAsset?.risk_color as keyof typeof CyberColorClass]}`}>
                                            {safeText(latestAsset?.risk_level) || "Unknown"}
                                        </span>
                                    </div>
                                </div>

                                {/* Type Specific Data */}
                                {(latestAsset?.asset_type === 'app' || latestAsset?.type === 'app') ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Findings</p>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {latestAsset?.full_response?.app_info?.permissions_count || latestAsset?.finding_count || '0'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Platform</p>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {latestAsset?.full_response?.app_info?.platform || (latestAsset?.type === 'app' ? 'Android' : 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (latestAsset?.asset_type === 'cloud' || latestAsset?.type === 'cloud') ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Provider</p>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {latestAsset?.full_response?.cloud_provider || latestAsset?.cloud_provider || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Resources</p>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {latestAsset?.full_response?.summary?.resources_scanned || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">SSL Valid</p>
                                            <p className={`font-medium ${sslInfo?.valid ? 'text-green-600' : 'text-red-500'}`}>
                                                {sslInfo?.valid ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Days Left</p>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {sslInfo?.days_remaining || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Scan Date</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">
                                        {formatDate(latestAsset?.scanned_at || latestAsset?.created_at, DATE_FORMAT.FULL_DAY_MONTH_YEAR)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Recent Scans Table */}
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <RiFileList3Line className="text-brand-500" />
                            Recent Scans
                        </h3>
                        <Link
                            href='/inventory'
                            prefetch={false}
                            onClick={() => router.refresh()}
                            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <DynamicTable
                            columns={columns}
                            data={recentScans}
                            className="min-w-[600px]" // Ensure table doesn't squash on small screens inside the card
                        />
                    </div>
                </div>
            </div>

            <StatisticsChart inventory={uniqueAssets} allScans={inventory} riskCounts={riskCounts} domains={domains} />

        </div>
    );
}
