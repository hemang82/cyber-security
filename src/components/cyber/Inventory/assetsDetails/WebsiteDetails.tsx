"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import OwaspReport, { RoutesScanned, VurnabilitiesFindings } from "@/components/ui/faq/FaqSection";
import { useInventoryStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { RiInformation2Line, RiFileList3Line, RiGlobalLine, RiSpeedUpLine, RiServerLine, RiShieldCheckLine, RiPieChartLine, RiClipboardLine, RiLightbulbLine } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { toPng } from "html-to-image";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { PerformanceChart } from "@/components/charts/circular/PerformanceChart";
import { VulnerabilityChart } from "@/components/charts/circular/VulnerabilityChart";

import { GoEye } from "react-icons/go";
import CountUp from "react-countup";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Drawer from "@/components/ui/drawer/Drawer";
import { PDFDocument } from "../assetsReport/CyberSecurityPDF";


export const Card = ({ title, tooltip, children, className = "" }: any) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        };
        if (showTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showTooltip]);

    return (
        <div className={`h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/3 ${className}`}>
            {title && (
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-gray-800 dark:text-white">
                            {title}
                        </div>
                        {tooltip && (
                            <div className="relative group" ref={tooltipRef}>
                                <span
                                    className="cursor-help text-gray-400 hover:text-brand-500 transition-colors"
                                    onClick={() => setShowTooltip((prev) => !prev)}
                                    onMouseEnter={() => setShowTooltip(true)}
                                >
                                    <RiInformation2Line size={18} />
                                </span>
                                {showTooltip && (
                                    <div className="absolute left-1/2 bottom-full z-50 mb-2 w-72 -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                                        <div className="relative z-10">
                                            {tooltip}
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

const severityColorMap: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-orange-50 text-orange-600 border-orange-100",
    warning: "bg-orange-50 text-orange-600 border-orange-100",
    low: "bg-yellow-50 text-yellow-600 border-yellow-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    ["critical risk"]: "bg-red-100 text-red-800 border-red-200",
    ["safe"]: "bg-green-50 text-green-600 border-green-100",
    ["high risk"]: "bg-red-50 text-red-600 border-red-100",
    ["medium risk"]: "bg-orange-50 text-orange-600 border-orange-100",
    ["low risk"]: "bg-yellow-50 text-yellow-600 border-yellow-100"
};

export const severityColor = (severity: any) => {
    if (!severity) return "bg-blue-50 text-blue-500";

    return (
        severityColorMap[String(severity).toLowerCase()] ||
        "bg-blue-50 text-blue-500"
    );
};

/* ---------- Page ---------- */

export enum CyberColor {
    GREEN = "Green",
    BLUE = "Blue",
    ORANGE = "Orange",
    RED = "Red",
    DARK_RED = "DarkRed",
    YELLOW = "Yellow",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export const CyberColorClass: Record<CyberColor, string> = {
    [CyberColor.GREEN]: "bg-green-50 text-green-700 border-green-200",

    [CyberColor.BLUE]: "bg-blue-50 text-blue-700 border-blue-200",

    [CyberColor.ORANGE]: "bg-orange-50 text-orange-700 border-orange-200",

    [CyberColor.RED]: "bg-red-50 text-red-700 border-red-200",

    [CyberColor.DARK_RED]: "bg-red-100 text-red-900 border-red-300",

    [CyberColor.YELLOW]: "bg-yellow-50 text-yellow-700 border-yellow-200",

    [CyberColor.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",

    [CyberColor.IN_PROGRESS]: "bg-blue-50 text-blue-700 border-blue-200",

    [CyberColor.COMPLETED]: "bg-green-50 text-green-700 border-green-200",

    [CyberColor.FAILED]: "bg-red-50 text-red-700 border-red-200",
};

/* ---------- UI Helpers ---------- */
export const Badge = ({ color, children, classname }: any) => {
    return (
        <span className={`${classname} border border-gray-500 rounded-md px-2 py-1 text-sm font-bold capitalize ${CyberColorClass[color as keyof typeof CyberColorClass]} `}>
            {children}
        </span>
    );
};

// Grade helper removed as requested

export const safeJoin = (arr: any, separator = ",\n") => Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "N/A";

const StatCard = ({ label, value, icon, trend, subValue }: any) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${trend === 'safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </div>
            )}
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{value}</h4>
            {subValue && <span className="text-sm text-gray-400 font-medium">{subValue}</span>}
        </div>
    </div>
);


export default function WebsiteDetails({ resAssetsDetails }: any) {

    console.log("InventoryData Wevsite", resAssetsDetails);

    const { setLoader, resetInventory } = useInventoryStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { isOpen, openModal, closeModal, modalData } = useModal();

    const [data, setData] = useState<any>(null);
    const [scanDate, setScanDate] = useState<string>("");
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [pdfMargins, setPdfMargins] = useState({ performance: 0, security: 0 });

    useEffect(() => {
        setData(resAssetsDetails)
        setLoader(false)
        resetInventory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data?.scanned_at) {
            setScanDate(formatDate(data?.scanned_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR));
        }
    }, [data]);

    const captureRef = useRef(null);
    const pageRef = useRef(null);

    const handleDownload = async () => {
        setIsDownload(true);
        // Wait for the expansion animation (300ms) + buffer
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
                canvasWidth: width,
                canvasHeight: height,
                style: {
                    transform: "scale(1)",
                    transformOrigin: "top left",
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: "#ffffff",
                },
                filter: (node) => {
                    if (node && node.classList) {
                        return !node.classList.contains("no-capture");
                    }
                    return true;
                },
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${safeText(data?.target)}-Report.png`;
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        } finally {
            setIsDownload(false);
        }
    };

    const column3 = [
        {
            key: "key",
            title: "Header Name",
            render: (row: any) => (
                <span className="text-base">{safeText(row?.key)}</span>
            ),
        },
        {
            key: "status",
            title: "Status",
            render: (row: any) => (
                <span className="text-base">{safeText(row?.status)}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span className={`rounded-full px-2 py-0.5 text-base font-medium ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
        {
            key: "solution",
            title: "Solution",
            render: (row: any) => {
                return (<>
                    {/* <span
                        className={`rounded-full px-2 py-0.5 text-base font-medium ${row?.solution
                            ? "cursor-pointer hover:opacity-80 " +
                            severityColor(row?.severity || "Info")
                            : "text-gray-400"
                            }`}
                        onClick={() => {
                            if (row?.solution) {
                                console.log("Clicked Row 👉", row); // 👈 click સમયે પણ log
                                openModal(row);
                            }
                        }}
                    >
                        {row?.solution ? "View" : "N/A"}
                    </span> */}

                    {!isDownload ? <button className="shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-300 text-blue-500 hover:bg-blue-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => {
                        if (row?.solution) {
                            console.log("Clicked Row 👉", row); // 👈 click સમયે પણ log
                            openModal(row);
                        }
                    }}>
                        <GoEye size={16} />
                    </button>
                        : row?.solution || "N/A"}
                </>);
            },
        }

    ];

    const column4 = [
        {
            key: "type",
            title: "Type",
            render: (row: any) => (
                <span className="text-base">{safeText(row?.type)}</span>
            ),
        },
        {
            key: "detail",
            title: "Description",
            render: (row: any) => (
                <span className="text-base">{safeText(row?.detail) || 0}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span
                    className={`rounded-full px-2 py-0.5 text-base font-medium ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
    ];

    return (
        <>
            <div className="mx-auto max-w-[1600px] p-4 lg:p-6 space-y-6">
                {/* HERO SECTION */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-white/3 border border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                    <RiGlobalLine size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Website Security Audit</p>
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white break-all">
                                        {safeText(data?.target)}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${CyberColorClass[data?.risk_color as keyof typeof CyberColorClass]}`}>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                    </span>
                                    {safeText(data?.risk_level) || "Unknown Risk"}
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    <RiServerLine size={16} />
                                    {safeText(data?.network_info?.host || "Web Asset")}
                                </div>
                            </div>
                        </div>

                        {!isDownload && (
                            <div className="flex flex-wrap gap-3">
                                {isClient ? (
                                    <PDFDownloadLink
                                        document={<PDFDocument data={data} />}
                                        fileName={`${safeText(data?.target)}-Report.pdf`}
                                        className="flex h-12 items-center justify-center gap-3 rounded-xl bg-brand-500 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-brand-500/25 active:scale-95" >
                                        {({ loading }) => (
                                            <>
                                                <HiDownload size={20} />
                                                {loading ? 'Preparing PDF...' : 'Download Full Report'}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                ) : (
                                    <div className="flex h-12 w-48 items-center justify-center gap-3 rounded-xl bg-gray-100 text-sm font-bold text-gray-400 dark:bg-gray-800">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
                                        Loading...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* TOP METRICS GRID */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    {/* Score & Vulnerability Breakdown */}
                    <div className="xl:col-span-8">
                        <Card
                            title="Security Health Index"
                            tooltip={
                                <div className="space-y-2">
                                    <p className="font-bold">Score Calculation</p>
                                    <p>Integrated analysis of {safeText(data?.summary?.checks_performed) || 0} checks across your infrastructure. High criticality findings impact this score exponentially.</p>
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-8 md:flex-row md:items-center justify-center">
                                <div className="flex flex-col items-center gap-6 sm:flex-row text-center sm:text-left">
                                    <div className="relative group">
                                        <div className={`flex h-36 w-36 items-center justify-center rounded-full border-[10px] bg-white shadow-sm dark:bg-gray-900 transition-transform group-hover:scale-105 ${data?.security_score >= 80 ? 'border-green-500' : data?.security_score >= 60 ? 'border-yellow-400' : 'border-red-500'}`}>
                                            <div className="flex flex-col items-center">
                                                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                                                    <CountUp end={Number(safeText(data?.security_score)) || 0} duration={2} />
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-center sm:text-left">
                                        <div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Finding Distribution</p>
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                                {(data?.finding_counts || []).map((item: any, idx: number) => (
                                                    <div key={idx} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${severityColor(item.severity)}`}>
                                                        <span className="text-base font-bold">{safeText(item.count)}</span>
                                                        <span className="text-xs font-bold uppercase tracking-wide opacity-70">{safeText(item.severity)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="max-w-md text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                            Detecting potential attack vectors through automated footprinting and configuration analysis. Fixed vulnerabilities enhance overall resilience.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[220px] flex items-center justify-center">
                                    <VulnerabilityChart data={data?.finding_counts || []} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recommendations */}
                    <div className="xl:col-span-4">
                        <Card title="Quick Recommendations" className="bg-white border-brand-100 dark:bg-white/5 border-2 shadow-lg shadow-brand-500/5">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4 rounded-xl bg-red-50 p-4 transition-colors hover:bg-red-100 dark:bg-red-500/10">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20">
                                        <RiShieldCheckLine size={24} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">Priority Remediation</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Fix <b>{safeText(data?.finding_counts?.find((f: any) => f.severity === 'High')?.count) || 0} Critical</b> issues to prevent unauthorized console access.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-xl bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:bg-blue-500/10">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                                        <RiSpeedUpLine size={24} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">Optimization Needed</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Large payload detected ({safeText(data?.performance?.page_size_kb)}). Minify JS/CSS assets.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 rounded-xl bg-yellow-50 p-4 transition-colors hover:bg-yellow-100 dark:bg-yellow-500/10">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20">
                                        <RiLightbulbLine size={24} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">Security Hygiene</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Implement CSP headers to mitigate XSS and data injection risks.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* SECONDARY GRID - INFO & PERFORMANCE */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Scan Info */}
                    <Card title="Audit Context">
                        <div className="space-y-4">
                            {[
                                { label: 'Asset Name', value: data?.scan_context, icon: <RiGlobalLine /> },
                                { label: 'Asset Type', value: 'Web Site', icon: <RiFileList3Line /> },
                                { label: 'Risk State', value: data?.summary?.risk_level, colorAttr: data?.risk_color },
                                { label: 'Audit Timestamp', value: scanDate, icon: <RiClipboardLine /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                                        {item.label}
                                    </div>
                                    <div className={`text-sm font-bold ${item.colorAttr ? CyberColorClass[item.colorAttr as keyof typeof CyberColorClass]?.split(' ')[1] : 'text-gray-900 dark:text-white'}`}>
                                        {safeText(item.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Compliance Glance */}
                    <Card title="Compliance Health">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'SSL/TLS', state: data?.website_security?.ssl_certificate?.valid, active: 'Encrypted', inactive: 'No SSL' },
                                { label: 'OWASP 10', state: true, active: 'Scanned', inactive: 'Pending' },
                                { label: 'Privacy', state: false, active: 'Compliant', inactive: 'Verify' },
                                { label: 'DNSSEC', state: data?.network_info?.dns_records?.dnssec === 'enabled', active: 'Enabled', inactive: 'Disabled' }
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl border border-gray-50 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/20">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{item.label}</p>
                                    <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm font-bold uppercase ${item.state ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'}`}>
                                        {item.state ? item.active : item.inactive}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Performance Metrics */}
                    <Card title="Performance Index">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-base font-bold text-gray-900 dark:text-white">{safeText(data?.performance?.load_time_ms)} ms</p>
                                    <p className="text-sm uppercase text-gray-500 font-medium">Total Load Time</p>
                                </div>
                                <div className="h-10 w-24 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 flex items-end">
                                    <div className="h-2/3 w-1/4 bg-brand-500/30 m-0.5" />
                                    <div className="h-1/2 w-1/4 bg-brand-500/50 m-0.5" />
                                    <div className="h-3/4 w-1/4 bg-brand-500/20 m-0.5" />
                                    <div className="h-full w-1/4 bg-brand-500 m-0.5 animate-pulse" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-gray-800">
                                <div>
                                    <p className="text-base font-bold text-gray-900 dark:text-white uppercase">{safeText(data?.performance?.page_size_kb)}</p>
                                    <p className="text-xs font-bold text-gray-400 tracking-wider">PAYLOAD</p>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-900 dark:text-white uppercase">{data?.performance?.script_analysis?.external_script_count || 0}</p>
                                    <p className="text-xs font-bold text-gray-400 tracking-wider">EXTERNAL ASSETS</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* DOMAIN & NETWORK SECTION */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <Card title="Domain Intelligence">
                        <div className="overflow-hidden rounded-xl border border-gray-50 dark:border-gray-800">
                            <table className="w-full text-base">
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {[
                                        ['Registrar', data?.network_info?.whois?.registrar],
                                        ['Expiry Date', formatDate(data?.network_info?.whois?.expiry, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)],
                                        ['Primary IP', safeJoin(data?.network_info?.dns_records?.A)],
                                        ['DNSSEC', safeText(data?.network_info?.dns_records?.dnssec) || 'Inactive'],
                                        ['Sitemap', safeText(data?.seo_check?.sitemap_xml) ? 'Verified' : 'Missing']
                                    ].map(([label, val], idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-400 uppercase text-xs tracking-wider w-1/3">{label}</td>
                                            <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 truncate max-w-xs text-sm">{val || 'Not Available'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card title="Infrastructure Shield">
                        <div className="space-y-6">

                            <div className="flex flex-wrap gap-2">
                                {data?.website_security?.technologies?.map((tech: string, i: number) => (
                                    <span key={i} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {safeText(tech)}
                                    </span>
                                ))}
                            </div>

                            <div className="rounded-xl bg-orange-500/5 p-4 border border-orange-500/10">
                                <p className="text-base font-bold uppercase text-orange-500 mb-2">Exposed Services (Ports)</p>
                                <div className="flex flex-wrap gap-3">
                                    {data?.network_info?.open_ports?.length > 0 ? data.network_info.open_ports.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 rounded-md bg-white px-2 py-1 shadow-sm dark:bg-gray-800">
                                            <div className={`h-1.5 w-1.5 rounded-full ${p.status === 'open' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                            <span className="text-sm font-bold">{safeText(p.port)}</span>
                                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{safeText(p.status) || 'Unknown'}</span>
                                        </div>
                                    )) : <span className="text-sm text-gray-400">No high-risk ports exposed.</span>}
                                </div>
                            </div>

                        </div>
                    </Card>
                </div>

                {/* FULL WIDTH TECHNICAL TABLES */}
                <div className="space-y-6">
                    <Card title="Security Header Analysis" tooltip="Browser-level security policies discovered in HTTP responses.">
                        <div className="overflow-x-auto">
                            <DynamicTable
                                columns={column3}
                                data={Object.entries(data?.website_security?.security_headers ?? {}).map(([key, value]: any) => ({
                                    key: key.replaceAll("-", " "),
                                    status: value?.status ?? "N/A",
                                    severity: value?.severity ?? "Info",
                                    solution: value?.solution ?? null
                                })) || []}
                                className="min-w-full"
                            />
                        </div>
                    </Card>

                    <div id="pdf-section-3">
                        <RoutesScanned data={data?.route_scans?.length > 0 ? data?.route_scans : []} download={isDownload} />
                    </div>

                    <div id="pdf-section-4">
                        <OwaspReport data={data?.compliance?.owasp_top_10 ? data?.compliance?.owasp_top_10 : {}} download={isDownload} openModal={openModal} />
                    </div>
                </div>

            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
                <div className="relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">

                    {/* HEADER */}
                    <div className="mb-6">
                        <h4 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
                            🔐 Vulnerability Solution Guide
                        </h4>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                            Below are the detected security vulnerabilities along with recommended fixes.
                        </p>
                    </div>

                    {/* SCROLL AREA */}
                    <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">

                        {/* Vulnerability Card */}
                        <div className={`rounded-xl border p-5 ${severityColor(modalData?.severity)} bg-opacity-10 border-opacity-30`}>
                            <div className="flex justify-between items-center">
                                <h5 className="text-lg font-semibold">
                                    {safeText(modalData?.type) || "Vulnerability Details"}
                                </h5>
                                <Badge color={modalData?.severity}>{safeText(modalData?.severity) || "Unknown Risk"}</Badge>
                            </div>

                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                                {safeText(modalData?.detail) || safeText(modalData?.key) || "No details available."}
                            </p>

                            {/* Impact */}
                            {modalData?.impact && (
                                <div className="mt-4">
                                    <h6 className="font-medium text-gray-900 dark:text-white/90">
                                        ⚠️ Impact
                                    </h6>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {safeText(modalData?.impact)}
                                    </p>
                                </div>
                            )}

                            {/* Solution */}
                            <div className="mt-4">
                                <h6 className="font-medium text-gray-900 dark:text-white/90">
                                    ✅ Recommended Solution
                                </h6>
                                {/* Check if solution is an array or string */}
                                {Array.isArray(modalData?.solution) ? (
                                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-400 space-y-1">
                                        {modalData?.solution.map((sol: any, index: number) => (
                                            <li key={index}>{safeText(sol)}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                        {safeText(modalData?.solution) || "No specific solution provided."}
                                    </p>
                                )}
                            </div>

                            {/* Code Example */}
                            {modalData?.codeExample && (
                                <div className="mt-4 rounded-lg bg-gray-900 p-4 text-xs text-green-400 overflow-x-auto">
                                    <pre>{modalData?.codeExample}</pre>
                                </div>
                            )}

                            {/* Evidence */}
                            {modalData?.evidence && (
                                <div className="mt-4 rounded-lg bg-gray-100 p-4 text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                                    <strong>Evidence:</strong> {safeText(modalData?.evidence)}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </Modal>

        </>
    );
}