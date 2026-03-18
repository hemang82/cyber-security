"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import OwaspReport, { RoutesScanned, VurnabilitiesFindings } from "@/components/ui/faq/FaqSection";
import { useInventoryStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { RiInformation2Line, RiFileList3Line, RiGlobalLine, RiSpeedUpLine, RiServerLine, RiShieldCheckLine, RiPieChartLine, RiClipboardLine, RiLightbulbLine, RiShieldFlashLine, RiAlarmWarningFill } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { toPng } from "html-to-image";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { PerformanceChart } from "@/components/charts/circular/PerformanceChart";
import { FINDINGS_COLORS, VulnerabilityChart } from "@/components/charts/circular/VulnerabilityChart";

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
        <div className={`h-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/3 ${className}`}>
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
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/3">
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
            <div className="mx-auto max-w-[1800px] p-4 lg:p-6 space-y-6">
                {/* HERO SECTION */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/3 border border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
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
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                    {/* Security Health Index */}
                    <div className="xl:col-span-8">
                        <Card title="Security Health Index">

                            <div className="flex flex-col lg:flex-row gap-8">

                                {/* LEFT SECTION */}
                                {/* aspect-square flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 lg:w-2/3 ">

                                    {/* SCORE CIRCLE */}
                                    {/* <div className="relative shrink-0">

                                        <div
                                            className={`flex items-center justify-center rounded-full border-[10px] sm:border-[12px] h-28 w-28 sm:h-36 sm:w-36 bg-white dark:bg-gray-900 shadow-md transition-all hover:scale-105 ${data?.security_score >= 80
                                                ? "border-green-500/20 ring-4 ring-green-500/10"
                                                : data?.security_score >= 60
                                                    ? "border-yellow-400/20 ring-4 ring-yellow-400/10"
                                                    : "border-red-500/20 ring-4 ring-red-500/10"
                                                }`} >

                                            <div
                                                className="absolute inset-0 rounded-full border-[10px] sm:border-[12px] border-transparent"
                                                style={{
                                                    borderTopColor: data?.security_score >= 80 ? "#22c55e" : data?.security_score >= 60 ? "#facc15" : "#ef4444",
                                                    transform: `rotate(${Math.min(360, (data?.security_score) * 360
                                                    )}deg)`
                                                }}
                                            />

                                            <div className="flex flex-col items-center">
                                                <span
                                                    className={`text-3xl sm:text-4xl font-extrabold ${data?.security_score >= 80
                                                        ? "text-green-600"
                                                        : data?.security_score >= 60
                                                            ? "text-yellow-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    <CountUp end={Number(data?.security_score) || 0} duration={2} />
                                                </span>

                                                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                                                    Score
                                                </span>
                                            </div>

                                        </div>
                                    </div> */}
                                    {/* SCORE CIRCLE */}
                                    <div className="relative shrink-0">
                                        {(() => {

                                            const score = Number(data?.security_score) || 0;

                                            const radius = 60;
                                            const stroke = 10;
                                            const normalizedRadius = radius - stroke * 2;
                                            const circumference = normalizedRadius * 2 * Math.PI;

                                            const strokeDashoffset = circumference - (score / 100) * circumference;

                                            const findings = data?.finding_counts || [];

                                            const severityPriority = [
                                                "Critical",
                                                "High",
                                                "Medium",
                                                "Low",
                                                "Info"
                                            ];

                                            // const FINDINGS_COLORS = {
                                            //     Critical: "#7f1d1d",
                                            //     High: "#ef4444",
                                            //     Medium: "#fb923c",
                                            //     Low: "#facc15",
                                            //     Info: "#3b82f6"
                                            // };

                                            const activeSeverity = severityPriority.find(sev =>
                                                findings.find((f: any) => f.severity === sev && f.count > 0)
                                            );

                                            const progressColor = FINDINGS_COLORS[activeSeverity as keyof typeof FINDINGS_COLORS] || "#22c55e";

                                            return (

                                                <div className="relative flex items-center justify-center h-60 w-40 sm:h-36 sm:w-36">

                                                    <svg
                                                        height={radius * 2}
                                                        width={radius * 2}
                                                        className="rotate-[-90deg]"
                                                    >

                                                        {/* Background */}
                                                        <circle
                                                            stroke="#e5e7eb"
                                                            fill="transparent"
                                                            strokeWidth={stroke}
                                                            r={normalizedRadius}
                                                            cx={radius}
                                                            cy={radius}
                                                        />

                                                        {/* Progress */}
                                                        <circle
                                                            stroke={progressColor}
                                                            fill="transparent"
                                                            strokeWidth={stroke}
                                                            strokeDasharray={`${circumference} ${circumference}`}
                                                            style={{ strokeDashoffset }}
                                                            strokeLinecap="round"
                                                            r={normalizedRadius}
                                                            cx={radius}
                                                            cy={radius}
                                                            className="transition-all duration-700"
                                                        />

                                                    </svg>

                                                    {/* Score Text */}
                                                    <div className="absolute flex flex-col items-center">

                                                        <span className="text-3xl sm:text-4xl font-extrabold">
                                                            <CountUp end={score} duration={2} />
                                                        </span>

                                                        <span className="text-[10px] uppercase tracking-widest text-gray-400">
                                                            Score
                                                        </span>

                                                    </div>
                                                </div>
                                            );
                                        })()}

                                    </div>

                                    {/* THREAT LANDSCAPE */}
                                    <div className="flex-1 text-center sm:text-left space-y-4">

                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                                            Threat Landscape
                                        </p>

                                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">

                                            {(data?.finding_counts || []).map((item: any, idx: any) => (<div
                                                key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${severityColor(
                                                    item.severity
                                                )}`}
                                            >
                                                <span className="text-sm font-bold">{safeText(item.count)}</span>
                                                <span>{safeText(item.severity)}</span>
                                            </div>
                                            ))}

                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                                            Our system analyzed{" "}
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {safeText(data?.summary?.checks_performed || 0)}
                                            </span>{" "}
                                            security checks to identify vulnerabilities and configuration issues.
                                        </p>

                                    </div>
                                </div>


                                {/* RIGHT SECTION - CHART */}
                                <div className="flex justify-center lg:w-1/3">

                                    <div className="w-[150px] sm:w-[240px] aspect-square flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
                                        <VulnerabilityChart data={data?.finding_counts || []} />
                                    </div>

                                </div>

                            </div>

                        </Card>
                    </div>


                    {/* QUICK RECOMMENDATIONS */}
                    <div className="xl:col-span-4">
                        <Card title="Quick Recommendations">

                            <div className="space-y-4">

                                {/* Priority */}
                                <div className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10">

                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20">
                                        <RiShieldCheckLine size={20} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Priority Remediation
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Fix{" "} <b> {safeText(data?.finding_counts?.find((f: any) => f.severity === "High")?.count || 0)} </b>{" "} critical issues.
                                        </p>
                                    </div>

                                </div>


                                {/* Optimization */}
                                <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">

                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20">
                                        <RiSpeedUpLine size={20} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Optimization Needed
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Page size {safeText(data?.performance?.page_size_kb)} KB detected.
                                        </p>
                                    </div>

                                </div>


                                {/* Security */}
                                <div className="flex gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-500/10">

                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20">
                                        <RiLightbulbLine size={20} />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Security Hygiene
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Implement CSP headers to prevent XSS attacks.
                                        </p>
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
                                    <p className="text-base font-bold text-gray-900 dark:text-white uppercase">{safeText(data?.performance?.script_analysis?.external_script_count || 0)}</p>
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
                                        ['Registrar', safeText(data?.network_info?.whois?.registrar)],
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

                            {data?.network_info?.findings?.length > 0 && <div className="overflow-x-auto">
                                <DynamicTable
                                    columns={column4}
                                    data={data?.network_info?.findings || []}
                                    // data={Object.entries(data?.network_info?.findings ?? {}).map(([key, value]: any) => ({
                                    //     key: key.replaceAll("-", " "),
                                    //     status: value?.status ?? "N/A",
                                    //     severity: value?.severity ?? "Info",
                                    //     solution: value?.solution ?? null
                                    // })) || []}
                                    className="min-w-full"
                                />
                            </div>
                            }
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
                        <OwaspReport data={data?.compliance?.owasp_top_10 ? data?.compliance?.owasp_top_10 : {}} download={isDownload} openModal={openModal} />
                    </div>

                    <div id="pdf-section-4">
                        <RoutesScanned data={data?.route_scans?.length > 0 ? data?.route_scans : []} download={isDownload} />
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