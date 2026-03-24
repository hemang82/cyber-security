"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import { useInventoryStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import {
    RiInformation2Line,
    RiFileList3Line,
    RiSmartphoneLine,
    RiShieldCheckLine,
    RiPieChartLine,
    RiClipboardLine,
    RiLightbulbLine,
    RiBugLine,
    RiShieldFlashLine,
    RiAlarmWarningFill,
    RiLockPasswordLine,
    RiApps2Line,
    RiArrowRightSLine
} from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { toPng } from "html-to-image";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { VulnerabilityChart } from "@/components/charts/circular/VulnerabilityChart";
import { GoEye } from "react-icons/go";
import CountUp from "react-countup";
import { pdf } from "@react-pdf/renderer";
import { ApplicationReportPDF } from "../assetsReport/ApplicationReportPDF";
import { Badge, Card, CyberColorClass, severityColor } from "./WebsiteDetails";
import { ASSETS, FINDINGS_COLORS } from "../Assets/AssetsTypes";

const StatCard = ({ title, value, icon: Icon, colorClass, subValue, trend }: any) => (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon size={22} className={colorClass.replace('bg-', 'text-').replace('-50', '-600').replace('-100', '-600')} />
            </div>
            {trend && <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{trend}</span>}
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none capitalize">{value}</h3>
                {subValue && <span className="text-xs text-gray-400 font-medium">/ {subValue}</span>}
            </div>
        </div>
    </div>
);

export default function ApplicationDetails({ resAssetsDetails }: any) {
    const finalData = resAssetsDetails?.data || resAssetsDetails;
    const { setLoader, resetInventory } = useInventoryStore();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const [data, setData] = useState<any>(finalData);
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (finalData) {
            setData(finalData);
            setLoader(false);
            resetInventory();
        }
    }, [finalData]);

    const captureRef = useRef(null);
    const pageRef = useRef(null);

    const handleDownloadImage = async () => {
        setIsDownload(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const element = captureRef.current || (pageRef.current as any);
        if (!element) {
            setIsDownload(false);
            return;
        }

        try {
            const width = element.scrollWidth;
            const height = element.scrollHeight;

            const dataUrl = await toPng(element, {
                cacheBust: true,
                backgroundColor: "#ffffff",
                pixelRatio: 3,
                width,
                height,
                style: {
                    transform: "scale(1)",
                    transformOrigin: "top left",
                    width: `${width}px`,
                    height: `${height}px`,
                },
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${safeText(data?.app_info?.app_name || 'App')}-Security-Report.png`;
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        } finally {
            setIsDownload(false);
        }
    };

    const handlePdfDownload = async () => {
        if (!data) return;
        setIsGenerating(true);
        try {
            const blob = await pdf(<ApplicationReportPDF data={data} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeText(data?.app_info?.app_name || 'App')}-Security-Report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Helper to map technical permission to friendly name & icon
    const getPermissionMeta = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('camera')) return { label: 'Camera', icon: '📸', risk: 'High', desc: 'Allows app to take photos and videos.' };
        if (lower.includes('location')) return { label: 'Location', icon: '📍', risk: 'High', desc: 'Accesses your precise geographic location.' };
        if (lower.includes('contacts')) return { label: 'Contacts', icon: '👥', risk: 'High', desc: 'Reads your contact list.' };
        if (lower.includes('storage') || lower.includes('media')) return { label: 'Storage', icon: '📁', risk: 'Medium', desc: 'Reads/Writes to your local files.' };
        if (lower.includes('microphone') || lower.includes('record_audio')) return { label: 'Microphone', icon: '🎙️', risk: 'High', desc: 'Allows recording of audio.' };
        if (lower.includes('sms')) return { label: 'SMS', icon: '💬', risk: 'High', desc: 'Can read or send text messages.' };
        if (lower.includes('phone')) return { label: 'Phone', icon: '📞', risk: 'Medium', desc: 'Access to phone state / call logs.' };
        if (lower.includes('internet')) return { label: 'Internet', icon: '🌐', risk: 'Low', desc: 'Basic data access for cloud features.' };
        if (lower.includes('bluetooth')) return { label: 'Bluetooth', icon: '📶', risk: 'Low', desc: 'Connect to nearby devices.' };

        // Default for others
        return {
            label: name.split('.').pop() || 'System',
            icon: '⚙️',
            risk: 'Low',
            desc: 'Standard system-level background operation.'
        };
    };

    const findingsColumns = [
        {
            key: "title",
            title: "Security Finding",
            render: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{safeText(row?.title || row?.type)}</span>
                    {/* <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{safeText(row?.point_name || row?.category)}</span> */}
                </div>
            ),
        },

        {
            key: "category",
            title: "Category",
            render: (row: any) => (
                <span className="text-sm font-base text-gray-700 dark:text-gray-300">{safeText(row?.point_name || row?.category) || ""}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-black uppercase ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
        {
            key: "action",
            title: "Details",
            render: (row: any) => (
                <button
                    className="shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-300 text-blue-500 hover:bg-blue-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 transition-colors"
                    onClick={() => openModal(row)}
                >
                    <GoEye size={16} />
                </button>
            ),
        }
    ];

    const findingCounts = data?.finding_counts?.map((f: any) => ({
        severity: f.severity,
        count: f.count,
        color: f.color
    })) || [];


    console.log("data?.risk_level", data?.risk_level);


    const progressColor = FINDINGS_COLORS[data?.risk_level as keyof typeof FINDINGS_COLORS] || "#22c55e";

    return (
        <div className="p-2 lg:p-4" ref={pageRef}>
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-4 py-6 sm:px-6 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3 shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-brand-500/5 blur-3xl" />

                <div className="flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest text-[10px]">
                        <RiSmartphoneLine size={16} />
                        Mobile Application Analysis
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {safeText(data?.app_info?.app_name || "App")}
                        </h2>
                        <Badge color={data?.risk_color || "Blue"}>{safeText(data?.risk_level || "Unknown")}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><RiApps2Line /> {safeText(data?.app_info?.package_name || data?.app_info?.bundle_id || "N/A")}</span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold">v{safeText(data?.app_info?.version_name || "1.0")}</span>
                    </div>
                </div>

                {!isDownload && (
                    <div className="flex gap-3">
                        <button
                            onClick={handlePdfDownload}
                            disabled={isGenerating}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-700 active:scale-95 disabled:opacity-50"
                        >
                            <HiDownload size={20} />
                            {isGenerating ? "Generating..." : "Download PDF"}
                        </button>
                        {/* <button
                            onClick={handleDownloadImage}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-600 active:scale-95"
                        >
                            <HiDownload size={20} />
                            PNG Report
                        </button> */}
                    </div>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Security Score"
                    value={`${data?.security_score || 0}%`}
                    icon={RiShieldFlashLine}
                    colorClass={data?.security_score > 70 ? "bg-green-100" : "bg-red-100"}
                    subValue="100"
                />
                <StatCard
                    title="Total Findings"
                    value={data?.summary?.total_findings || 0}
                    icon={RiBugLine}
                    colorClass="bg-red-100"
                />
                <StatCard
                    title="Permissions"
                    value={data?.app_info?.permissions_count || 0}
                    icon={RiLockPasswordLine}
                    colorClass="bg-blue-100"
                />
                <StatCard
                    title="Platform"
                    value={safeText(data?.app_info?.platform || "Android")}
                    icon={RiApps2Line}
                    colorClass="bg-orange-100"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                {/* Security Posture Analysis */}
                <div className="xl:col-span-8">
                    <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold text-sm sm:text-base"><RiPieChartLine className="text-brand-600" /> Security Posture</div>}>
                        <div className="flex flex-col xl:flex-row items-center justify-around gap-6 lg:gap-10">
                            <div className="flex flex-col items-center gap-6 sm:flex-row bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 w-full xl:w-auto">
                                <div className="relative">
                                    {/* ${data?.security_score >= 80 ? 'border-green-500' : data?.security_score >= 60 ? 'border-yellow-400' : 'border-red-500'} */}
                                    <div
                                        className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] bg-white dark:bg-gray-900 shadow-sm"
                                        style={{ borderColor: progressColor }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white leading-none">
                                                <CountUp end={Number(data?.security_score) || 0} duration={2} />
                                            </span>
                                            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mt-2">Health Score</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Vulnerability Impact</h4>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        {findingCounts?.map((item: any, index: number) => (
                                            <Badge key={index} color={item?.color}>
                                                {item?.count} {item?.severity}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-5 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Key Insight</p>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Analyzed {data?.summary?.total_findings || 0} security points on {safeText(data?.app_info?.platform)} platform.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-full sm:max-w-sm flex items-center justify-center bg-gray-50 dark:bg-gray-800/20 rounded-2xl p-4 min-h-[250px] lg:min-h-[300px]">
                                <VulnerabilityChart data={findingCounts || []} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recommendations */}
                <div className="xl:col-span-4">
                    <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold"><RiLightbulbLine className="text-brand-600" /> Recommendations</div>}>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase flex items-center gap-2 mb-2">
                                    <RiShieldCheckLine /> Strategy
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                    Prioritize fixing <b>{findingCounts.find((f: any) => f.severity === 'Medium')?.count || 0} Medium</b> risk storage issues found.
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                <h3 className="text-sm font-bold text-orange-900 dark:text-orange-400 uppercase flex items-center gap-2 mb-2">
                                    <RiLightbulbLine /> Immediate Action
                                </h3>
                                <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed font-medium">
                                    Update <b>AndroidManifest.xml</b> to disable <b>allowBackup</b> and implement <b>Network Security Configuration</b>.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Application & Compliance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Application Context */}
                <Card title={<div className="flex items-center gap-2"><RiFileList3Line /> App Information</div>}>
                    <div className="space-y-4">
                        {[
                            { label: 'App Name', value: data?.app_info?.app_name, icon: RiSmartphoneLine, color: 'text-blue-500' },
                            { label: 'Package ID', value: data?.app_info?.package_name || data?.app_info?.bundle_id, icon: RiApps2Line, color: 'text-purple-500' },
                            { label: 'Version', value: `${data?.app_info?.version_name} ${data?.app_info?.version_code ? `(${data?.app_info?.version_code})` : ''}`, icon: RiInformation2Line, color: 'text-green-500' },
                            { label: 'Target SDK', value: data?.app_info?.target_sdk, icon: RiShieldCheckLine, color: 'text-orange-500' },
                            { label: 'Min SDK', value: data?.app_info?.min_sdk || data?.app_info?.min_os, icon: RiLockPasswordLine, color: 'text-red-500' },
                            { label: 'Permissions', value: data?.app_info?.permissions_count || data?.app_info?.supported_platforms, icon: RiLockPasswordLine, color: 'text-indigo-500' }
                        ].map((item, idx) => (<>
                            {
                                item.value &&
                                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-white/3 border border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-white/5 transition-all shadow-sm group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform ${item.color}`}>
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</span>
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px]">{safeText(item.value) || 'N/A'}</span>
                                </div>
                            }
                        </>))}
                    </div>
                </Card>

                {/* Compliance Health */}
                <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold text-sm sm:text-base"><RiShieldCheckLine /> Compliance Health</div>}>
                    <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">Quick audit of app environment against standard security benchmarks.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Platform SDK', state: (data?.app_info?.target_sdk || 0) >= 30, active: 'Modern', inactive: 'Legacy' },
                            { label: 'Permissions', state: (data?.app_info?.permissions_count || 0) < 20, active: 'Optimized', inactive: 'Excessive' },
                            { label: 'Security Index', state: (data?.security_score || 0) > 60, active: 'Stable', inactive: 'Review' },
                            { label: 'App Integrity', state: true, active: 'Verified', inactive: 'Warning' }
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50/30 p-5 dark:border-gray-800 dark:bg-gray-800/20 flex flex-col justify-between hover:border-brand-500/30 transition-colors">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{item.label}</p>
                                <div className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border shadow-sm ${item.state ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/5 dark:text-green-400 dark:border-green-500/20' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/5 dark:text-orange-400 dark:border-orange-500/20'}`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${item.state ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'}`} />
                                    {item?.state ? safeText(item?.active) : safeText(item?.inactive)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/30">
                        <p className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest mb-1">Audit Outcome</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Application targets <b>Android API {safeText(data?.app_info?.target_sdk)}</b> with <b>{safeText(data?.app_info?.permissions_count)}</b> total permissions identified.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Simplified Visual Permission Audit */}
            {(data?.app_info?.permissions && data?.app_info?.permissions.length > 0) && (
                <div className="mb-6">
                    <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold"><RiShieldCheckLine className="text-brand-600" /> App Permissions & Safety</div>}>
                        <div className="flex flex-col gap-8">

                            {/* 1. HIGH RISK SECTION - CRITICAL ACCESS */}
                            {(data?.app_info?.permissions || []).filter((p: any) => getPermissionMeta(p.name).risk === 'High').length > 0 && (
                                <div className="bg-red-50/20 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/20 overflow-hidden">
                                    <div className="bg-red-50/50 dark:bg-red-500/10 px-5 py-3 border-b border-red-100 dark:border-red-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">⚠️</span>
                                            <h5 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Critical Access (Sensitive Data)</h5>
                                        </div>
                                        <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">ACTION REQUIRED</span>
                                    </div>
                                    <div className="divide-y divide-red-100/50 dark:divide-red-500/10">
                                        {(data?.app_info?.permissions || []).filter((p: any) => getPermissionMeta(p.name).risk === 'High').map((row: any, i: number) => {
                                            const meta = getPermissionMeta(row?.name);
                                            return (
                                                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900 shadow-sm text-2xl">
                                                            {meta.icon}
                                                        </div>
                                                        <div>
                                                            <h6 className="text-base font-bold text-gray-900 dark:text-white">{safeText(meta.label)}</h6>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{safeText(meta.desc)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-red-600 uppercase border border-red-200 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-500/10">High Risk</span>
                                                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                                            <RiAlarmWarningFill size={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 2. SAFE / GENERAL SECTION */}
                            {(data?.app_info?.permissions || []).filter((p: any) => getPermissionMeta(p.name).risk !== 'High').length > 0 && (
                                <div className="bg-green-50/20 dark:bg-green-500/5 rounded-2xl border border-green-100 dark:border-green-500/20 overflow-hidden">
                                    <div className="bg-green-50/50 dark:bg-green-500/10 px-5 py-3 border-b border-green-100 dark:border-green-500/20 flex items-center gap-2">
                                        <span className="text-xl">✅</span>
                                        <h5 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Safe / General Access</h5>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {(data?.app_info?.permissions || []).filter((p: any) => getPermissionMeta(p.name).risk !== 'High').map((row: any, i: number) => {
                                            const meta = getPermissionMeta(row?.name);
                                            return (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-green-50 bg-white dark:bg-gray-900/50 dark:border-green-900/20 shadow-sm">
                                                    <span className="text-xl">{meta.icon}</span>
                                                    <div>
                                                        <h6 className="text-sm font-bold text-gray-800 dark:text-gray-200">{safeText(meta.label)}</h6>
                                                        <p className="text-[10px] text-gray-400 italic">Standard Access</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </Card>
                </div>
            )}

            {/* Detailed Findings */}
            <div className="mb-6">
                <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold"><RiBugLine className="text-brand-600" /> Vulnerability Assessment</div>}>
                    <div className="overflow-x-auto">
                        <DynamicTable columns={findingsColumns} data={data?.findings || []} className="min-w-[800px]" />
                    </div>
                </Card>
            </div>

            {/* Finding Modal */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
                <div className="relative w-full max-w-[800px] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900 lg:p-10">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-widest text-[12px] mb-2">
                            Security Advisory
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {safeText(modalData?.title || modalData?.type)}
                        </h4>
                    </div>

                    <div className="space-y-6">
                        <div className={`rounded-xl border p-6 ${severityColor(modalData?.severity)} bg-opacity-10 border-opacity-30`}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[12px] font-black uppercase tracking-widest text-gray-500">Risk Assessment</span>
                                <Badge color={modalData?.severity}>{modalData?.severity || "Medium"}</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h6 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <RiAlarmWarningFill className="text-red-500" /> The Risk
                                    </h6>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                        {safeText(modalData?.risk || modalData?.detail)}
                                    </p>
                                </div>
                                <div>
                                    <h6 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <RiShieldFlashLine className="text-orange-500" /> Potential Impact
                                    </h6>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                        {safeText(modalData?.impact || "Compromise of application data integrity and confidentiality.")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-brand-500" />
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Technical Fix</h5>
                            </div>
                            <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                                            {safeText(modalData?.solution || modalData?.ai_solution)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Compliance</span>
                                <span className="text-base font-bold text-gray-900 dark:text-white">{safeText(modalData?.owasp || "OWASP Mobile Rank")}</span>
                            </div>
                            {/* <div>
                                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest block mb-1">CVSS Score</span>
                                <span className="text-xs font-bold text-red-600">{modalData?.cvss_score || "N/A"}</span>
                            </div> */}
                        </div>
                    </div>

                </div>
            </Modal>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #374151;
                }
            `}</style>

        </div>
    );
}
