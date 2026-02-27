"use client";
import React from "react";
import CountUp from "react-countup";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";
import { RiGlobalLine, RiShieldCheckLine, RiAlertLine, RiCheckDoubleLine, RiFileList3Line, RiShieldFlashLine, RiLock2Line, RiServerLine, RiSpyLine, RiCodeLine, RiBugLine, RiEarthLine, RiSpeedUpLine, RiEyeLine } from "react-icons/ri";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { Badge, CyberColorClass } from "@/components/cyber/Inventory/assetsDetails/WebsiteDetails";
import { useRouter } from "next/navigation";
import DynamicTable from "@/components/tables/DynamicTable";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";


export interface CyberDashboardProps {
    inventory: any[];
    riskCounts: any;
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

export default function CyberDashboard({ inventory = [] }: CyberDashboardProps) {
    const router = useRouter();

    // --- Statistics Calculations ---
    const totalAssets = inventory.length;

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

    inventory.forEach(item => {
        const riskLevel = item?.risk_level || "Unknown";
        // Use security_score if available (from recent user edit), fallback to output_score
        const score = Number(item?.security_score) || 0;
        console.log("score", score);

        if (score > 0) {
            totalScore += score;
            scoredAssets++;
        }

        // Count risks
        if (riskLevel.toLowerCase().includes("critical")) riskCounts.Critical++;
        else if (riskLevel.toLowerCase().includes("high")) riskCounts.High++;
        else if (riskLevel.toLowerCase().includes("medium")) riskCounts.Medium++;
        else if (riskLevel.toLowerCase().includes("low")) riskCounts.Low++;
        else if (riskLevel.toLowerCase().includes("safe")) riskCounts.Safe++;
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

    const recentScans = [...inventory].sort((a, b) => new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime()).slice(0, 5);

    // Domain Info (Take the latest one for display)
    const latestAsset = recentScans[0];
    const sslInfo = latestAsset?.full_response?.website_security?.ssl_certificate;
    const registrarInfo = latestAsset?.full_response?.domain_information?.whois;

    // --- Columns for Dynamic Table ---
    const columns = [
        {
            key: "target_url",
            title: "Target Asset",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <RiGlobalLine size={16} />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white break-all">{safeText(row?.target_url)}</span>
                </div>
            )
        },
        {
            key: "security_score",
            title: "Score",
            render: (row: any) => {
                const score = Number(row?.security_score) || 0;
                return (
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                            {score} / 100
                        </span>
                    </div>
                );
            }
        },
        {
            key: "risk_level",
            title: "Risk Level",
            render: (row: any) => (
                <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CyberColorClass[row?.risk_color as keyof typeof CyberColorClass]}`}>
                    {safeText(row?.risk_level) || "Unknown"}
                </span>
            )
        },
        {
            key: "scanned_at",
            title: "Scan Date",
            render: (row: any) => (
                <span className="text-gray-500 text-sm">
                    {formatDate(row?.scanned_at, DATE_FORMAT.FULL_DAY_MONTH_YEAR)}
                </span>
            )
        },
        {
            key: "action",
            title: "Action",
            render: (row: any) => (

                <button
                    onClick={() => router.push(`/Inventory-view?id=${encodeURIComponent(row?.id)}`)}
                    className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                    View Report
                </button>
            )
        }
    ];

    const checkFeatures = [
        { icon: <RiLock2Line size={24} />, title: "SSL/TLS Security", desc: "Certificate validity & configuration", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
        { icon: <RiGlobalLine size={24} />, title: "DNS Health", desc: "SPF, DMARC, and record analysis", color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
        { icon: <RiServerLine size={24} />, title: "Server Headers", desc: "Security headers & exposing info", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
        { icon: <RiSpyLine size={24} />, title: "Open Ports", desc: "Scanning for vulnerable ports", color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
        { icon: <RiBugLine size={24} />, title: "OWASP Top 10", desc: "Common web vulnerability checks", color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
        { icon: <RiCodeLine size={24} />, title: "Code Analysis", desc: "JS libraries & deprecated code", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
        { icon: <RiEarthLine size={24} />, title: "Domain Info", desc: "Whois & Registrar details", color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400" },
        { icon: <RiShieldFlashLine size={24} />, title: "Dark Web", desc: "Breach monitoring (Basic)", color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    ];


    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Security Command Center</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive overview of your digital security posture.</p>
                </div>
                <div className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400 animate-pulse">
                    ● System Operational
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Assets */}
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
                            All Active
                        </span>
                    </div>
                </div>

                {/* Avg Security Score */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
                            <RiShieldCheckLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Security Score</span>
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
                            {riskCounts.Critical > 0 ? 'Action Required' : 'Secure'}
                        </span>
                    </div>
                </div>

                {/* Safe Assets */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                            <RiCheckDoubleLine size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Safe Assets</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                            <CountUp end={riskCounts.Safe + riskCounts.Low} duration={2} />
                        </h3>
                        <span className="text-xs font-medium text-gray-500">
                            Low Risk
                        </span>
                    </div>
                </div>

            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Charts & Domain Info */}
                <div className="space-y-6 lg:col-span-1">

                    {/* <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <RiShieldFlashLine className="text-brand-500" />
                            Risk Distribution
                        </h3>

                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div> */}

                    {/* Domain Information Card */}
                    {latestAsset && (
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <RiEarthLine className="text-blue-500" />
                                Latest Asset Insight
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Asset</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">{safeText(latestAsset?.target_url)}</p>
                                </div>

                                {/* <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Registrar</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">
                                        {safeText(registrarInfo?.registrar) || 'Unknown'}
                                    </p>
                                </div> */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Score</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${getScoreColor(Number(latestAsset?.security_score))}`}>
                                                {Number(latestAsset?.security_score) || 0} / 100
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
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Scan Date</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">
                                        {formatDate(latestAsset?.scanned_at, DATE_FORMAT.FULL_DAY_MONTH_YEAR)}
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
                        <button onClick={() => router.push('/inventory')} className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View All</button>
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

            <StatisticsChart inventory={inventory} riskCounts={riskCounts} />

            {/* Security Coverage Section (What We Check) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* <EcommerceMetrics /> */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Comprehensive Security Coverage
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {checkFeatures.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                            <div className={`p-3 rounded-full mb-3 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
