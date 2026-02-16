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
import { PDFDocument } from "./CyberSecurityPDF";


export const Card = ({ title, tooltip, children }: any) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        };

        if (showTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside); // Handle touch events
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showTooltip]);

    return (
        <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 my-4 overflow-hidden">
            <div className="mb-4 flex items-center gap-2 ">
                <h3 className="text-2xl font-semibold text-brand-800 dark:text-white/90 truncate">
                    {title}
                </h3>

                {tooltip && (
                    <div className="relative cursor-pointer" ref={tooltipRef}>
                        <span
                            className="text-lg text-brand-800 flex items-center"
                            onClick={() => setShowTooltip((prev) => !prev)}
                            onMouseEnter={() => setShowTooltip(true)}
                        >
                            <RiInformation2Line size={20} />
                        </span>

                        {showTooltip && (
                            <div className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-md bg-gray-100 p-3 text-sm text-gray-800 shadow-xl border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                                {tooltip}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <hr className="w-full border-gray-200 dark:border-gray-800 mb-3" />
            <div className="w-full overflow-x-auto">
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
}

export const CyberColorClass: Record<CyberColor, string> = {
    [CyberColor.GREEN]: "bg-green-50 text-green-700 border-green-200",

    [CyberColor.BLUE]: "bg-blue-50 text-blue-700 border-blue-200",

    [CyberColor.ORANGE]: "bg-orange-50 text-orange-700 border-orange-200",

    [CyberColor.RED]: "bg-red-50 text-red-700 border-red-200",

    [CyberColor.DARK_RED]: "bg-red-100 text-red-900 border-red-300",

    [CyberColor.YELLOW]: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

/* ---------- UI Helpers ---------- */
export const Badge = ({ color, children, classname }: any) => {
    return (
        <span className={`${classname} border border-gray-500 rounded-md px-2 py-1 text-base font-medium capitalize ${CyberColorClass[color as keyof typeof CyberColorClass]} `}>
            {children}
        </span>
    );
};

export const getGrade = (score: number) => {
    if (!score && score !== 0) return { grade: '?', color: 'text-gray-400', bg: 'bg-gray-100' };
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
};

export const safeJoin = (arr: any, separator = ",\n") => Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "N/A";


export default function InventoryDetailsComponent({ InventoryData }: any) {

    const { setLoader, resetInventory } = useInventoryStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    console.log('InventoryDataInventoryData', InventoryData);


    const { isOpen, openModal, closeModal, modalData } = useModal();

    const [data, setData] = useState<any>(null);
    const [scanDate, setScanDate] = useState<string>("");
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [pdfMargins, setPdfMargins] = useState({ performance: 0, security: 0 });

    useEffect(() => {
        setData(InventoryData)
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
                <span className="text-base">{row?.key || 0}</span>
            ),
        },
        {
            key: "status",
            title: "Status",
            render: (row: any) => (
                <span className="text-base">{row?.status || 0}</span>
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
                <span className="text-base">{row?.type || 0}</span>
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


    return (<>

        <div className="p-3">
            <div id="pdf-section-1">
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5  sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">
                    {/* Header Section */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left Info */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <RiGlobalLine size={18} className="text-brand-600 dark:text-brand-400" />
                                <span className="text-xs font-bold uppercase tracking-wider">Target Asset</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-white break-all">
                                    {safeText(data?.target)}
                                </span>
                                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${CyberColorClass[data?.risk_color as keyof typeof CyberColorClass]}`}>
                                    {safeText(data?.risk_level) || "Unknown"}
                                </span>
                            </div>
                        </div>

                        {/* Scan Date */}
                        {/* <p className="text-base sm:text-base text-gray-800 dark:text-gray-500">
                            Scan Date:{" "}
                            <span className="font-medium">
                                {safeText(scanDate)}
                            </span>
                        </p> */}
                    </div>
                    {
                        !isDownload &&
                        <div className="flex gap-3">
                            {isClient ? <PDFDownloadLink
                                document={<PDFDocument data={data} />}
                                fileName={`${safeText(data?.target)}-Report.pdf`}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600 cursor-pointer"
                            >
                                {/* @ts-ignore */}
                                {({ loading }) => (
                                    <>
                                        <HiDownload size={20} />
                                        {loading ? 'Generating...' : 'Download Report'}
                                    </>
                                )}
                            </PDFDownloadLink>
                                : <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition opacity-50 cursor-not-allowed">
                                    <HiDownload size={20} />
                                    Loading...
                                </button>
                            }
                            {/* <button onClick={handlePdfDownload} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600" >
                                <HiDownload size={20} />
                                Download Report
                            </button> */}
                            {/* <button
                                onClick={handleDownload}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                            >
                                <HiDownload size={20} />
                                Download PNG
                            </button> */}
                        </div>
                    }
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mb-4">
                    {/* Vulnerabilities */}
                    <Card title={<div className="flex items-center gap-2"><RiPieChartLine /> Vulnerabilities</div>} tooltip={<>
                        <h1 className="mb-1 ">How Security Score Is Calculated ?</h1>  &nbsp;
                        <p>The security score is calculated based on the total number of vulnerabilities, their severity level, and compliance with security best practices.
                            High-risk issues significantly reduce the overall score.</p>
                    </>}>

                        <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                            {/* Score & Grade Section */}
                            <div className="flex flex-col items-center gap-6 sm:flex-row">
                                <div className="relative flex items-center justify-center">
                                    {/* Animated Score Circle */}
                                    <div className={`flex h-30 w-30 items-center justify-center rounded-full border-[6px] ${data?.security_score >= 80 ? 'border-green-500' : data?.security_score >= 60 ? 'border-yellow-400' : 'border-red-500'} bg-white dark:bg-gray-800 shadow-sm`}>
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                                                <CountUp end={Number(safeText(data?.security_score)) || 0} duration={2.5} />
                                            </span>
                                            <span className="text-xs uppercase text-gray-500 font-bold tracking-wide mt-1">Score</span>
                                        </div>
                                    </div>

                                    {/* Grade Badge (Absolute positioned or flexed next to it) */}
                                    {/* <div className={`absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full shadow-lg border-2 border-white ${getGrade(Number(data?.security_score)).bg} ${getGrade(Number(data?.security_score)).color}`}>
                                        <span className="text-xl font-black">{getGrade(Number(data?.security_score)).grade}</span>
                                    </div> */}
                                </div>

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Vulnerability Breakdown</h4>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        {data?.finding_counts?.map((item: any, index: number) => (
                                            <Badge key={index} color={item?.color}>
                                                {item?.count} {item?.severity}
                                            </Badge>
                                        ))}
                                    </div>
                                    {/* <div className="mt-4 rounded-lg bg-red-50 p-3 text-base text-red-700 ">
                                        ⚠ Vulnerabilities Not Fixed : <b>{safeText(data?.output_score) || 0}</b>
                                    </div> */}
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="flex-1 w-full max-w-sm min-h-[250px] flex items-center justify-center">
                                <VulnerabilityChart data={data?.finding_counts || []} />
                            </div>
                        </div>

                        <div className="my-3">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 ">What Does High Risk Mean?</h3>
                            <p className="text-gray-500 text-base mt-2">High-risk vulnerabilities can allow attackers to gain unauthorized access, steal sensitive data, or completely compromise the website.
                                These issues should be fixed on priority to reduce business, legal, and reputation risk.</p>
                        </div>

                    </Card>
                </div>

                <div className="grid grid-cols-1  md:grid-cols-1 ">
                    {/* Scan Details */}
                    <div className="mb-4">

                        <Card title={<div className="flex items-center gap-2"><RiFileList3Line /> Scan Details</div>} tooltip={<>
                            <h1 className="mb-1">Scan Overview</h1> &nbsp;
                            <p>Overview of the target asset, including its risk classification and automated scan metadata.</p>
                        </>}>
                            <p className="mb-4 text-gray-500 text-base">
                                Key metadata about the security scan, including the target asset, risk scoring, and scan classification.
                            </p>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Asset Name
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                        {safeText(data?.scan_context)}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Asset Type
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {"Web Site"}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Risk Level
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.summary?.risk_level)}
                                    </span>
                                </li>


                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Security Score
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.summary?.score)}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Scan Method
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        Automated
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Scan Date
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(scanDate)}
                                    </span>
                                </li>

                            </ul>
                        </Card>

                    </div>

                    {/* Domain Information */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiGlobalLine /> Domain Information</div>} tooltip={<>
                            <h1 className="mb-1">Domain & Infrastructure Information</h1> &nbsp;
                            <p>This section provides publicly available domain and infrastructure details.
                                Misconfigured DNS or server settings may increase security risks.</p>
                        </>}>

                            <p className="mb-4 text-gray-500 text-base">
                                Publicly available registration and server details. Understanding your domain&apos;s footprint is essential for identifying potential attack surfaces.
                            </p>

                            {/* <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Domain Information
                </h2> */}

                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                                {/* Registrar */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Registrar
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                        {safeText(data?.network_info?.whois?.registrar)}
                                    </span>
                                </li>

                                {/* Expiry */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Expiry
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(formatDate(data?.network_info?.whois?.expiry, DATE_FORMAT?.FULL_DAY_MONTH_YEAR))}
                                    </span>
                                </li>

                                {/* Server */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Server
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.website_security?.technologies?.[0])}
                                    </span>
                                </li>

                                {/* SSL */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        SSL Certificate
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {data?.website_security?.ssl_certificate?.valid
                                            ? `${data.website_security.ssl_certificate.days_remaining} Days Valid`
                                            : "Not Found"}
                                    </span>
                                </li>

                                {/* A Record */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        A Record
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                        {safeJoin(data?.network_info?.dns_records?.A)}
                                    </span>
                                </li>

                                {/* MX Records */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        MX Records
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                        {
                                            data?.network_info?.dns_records?.MX?.length > 0 &&
                                                Array.isArray(data?.network_info?.dns_records?.MX)
                                                ? data?.network_info?.dns_records.MX.map((mx: any) => `${mx.exchange} (Priority ${mx.priority})`).join(",\n") : "N/A"}
                                    </span>
                                </li>

                                {/* TXT Records */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        TXT Records
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all whitespace-pre-line">
                                        {safeJoin(data?.network_info?.dns_records?.TXT)}
                                    </span>
                                </li>

                                {/* Name Servers */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Name Server
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                        {safeJoin(data?.network_info?.dns_records?.NS)}
                                    </span>
                                </li>

                                {/* DNSSEC */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        DNSSEC
                                    </span>
                                    <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.network_info?.dns_records?.dnssec)}
                                    </span>
                                </li>

                                {/* Whois */}
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Whois
                                    </span>
                                    <pre className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 whitespace-pre-wrap font-sans">
                                        {safeText(data?.network_info?.whois?.raw_partial)}
                                    </pre>
                                </li>
                            </ul>
                        </Card>
                    </div>

                </div>
            </div>

            <div id="pdf-section-2" className="bg-white w-full">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 ">
                    {/* Performance */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiSpeedUpLine /> Performance</div>} tooltip="Performance metrics that impact user experience and availability.">
                            <p className="mb-4 text-gray-500 text-base">
                                Optimizing load time and page size is crucial for availability. Slow responses can affect user experience.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                                <ul className="divide-y divide-gray-100 dark:divide-gray-800 w-full">

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Load Time
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.performance?.load_time_ms)} ms
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Page Size
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.performance?.page_size_kb) || "-"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Status
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.performance?.status) || "-"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Inline script count
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.performance?.script_analysis?.inline_script_count) || "-"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            External Script Count
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.performance?.script_analysis?.external_script_count) || "-"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Sitemap
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.seo_check?.sitemap_xml) || "0"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Robot TXT File
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {safeText(data?.seo_check?.robots_txt) || "0"}
                                        </span>
                                    </li>

                                    <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                        <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                            Website BlackList
                                        </span>
                                        <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                            {data?.summary?.blacklisted ? "Blacklisted Webiste" : "Not Blacklist"}
                                        </span>
                                    </li>

                                </ul>


                            </div>
                        </Card>
                    </div>
                </div>

                {/* Website Security Headers */}
                {/* <div className=""> */}
                <Card title={<div className="flex items-center gap-2"><RiShieldCheckLine /> Website Security Headers</div>} tooltip={<>
                    <h1 className="mb-1">Why Security Headers Matter</h1>  &nbsp;
                    <p>Security headers protect the website from common attacks such as cross-site scripting, clickjacking, and data injection.
                        Missing or misconfigured headers weaken browser-level protection.</p>
                </>}>

                    <p className="mb-4 text-gray-500 text-base">
                        HTTP response headers that instruct the browser to enable security features. Proper configuration can prevent Cross-Site Scripting (XSS) and other attacks.
                    </p>

                    <div className="overflow-x-auto w-full">
                        <DynamicTable columns={column3} data={Object.entries(data?.website_security?.security_headers ?? {}).map(([key, value]: any) => ({
                            key: key.replaceAll("-", " "),
                            status: value?.status ?? "N/A",
                            severity: value?.severity ?? "Info",
                            solution: value?.solution ?? null
                        })
                        ) || []} className={"min-w-[400px]"} />
                    </div>

                </Card>
                {/* </div> */}

                {/* Network Information */}
                <Card title={<div className="flex items-center gap-2"><RiServerLine /> Network Information</div>} tooltip={<>
                    <h1 className="mb-1">Attack Surface Overview</h1>  &nbsp;
                    <p>The attack surface represents all publicly accessible entry points that attackers can target.
                        Reducing exposed services and endpoints minimizes the risk of exploitation.</p>
                </>}>

                    <p className="mb-4 text-gray-500 text-base">
                        Information about the hosting infrastructure. Unnecessary exposed ports or unveiled server technologies can aid attackers in reconnaissance.
                    </p>

                    {/* <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Network Information
                </h2> */}

                    {/* <div className="my-3">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 ">Attack Surface Overview</h3>
                    <p className="text-gray-500 text-base mt-2">The attack surface represents all publicly accessible entry points that attackers can target.
                        Reducing exposed services and endpoints minimizes the risk of exploitation.</p>
                </div> */}

                    <ul className="divide-y divide-gray-100 dark:divide-gray-800 mb-4 border-b pb-4">

                        <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                            <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                Host
                            </span>
                            <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                {safeText(data?.network_info?.host) || "N/A"}
                            </span>
                        </li>

                        <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                            <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                IP Address
                            </span>
                            <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                {safeJoin(data?.network_info?.dns_records?.A)}
                            </span>
                        </li>

                        <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                            <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                Technologies
                            </span>
                            <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                {safeJoin(data?.website_security?.technologies)}
                            </span>
                        </li>

                        <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                            <span className="w-full text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                Open Ports
                            </span>

                            <span className="w-full text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                {
                                    data?.network_info?.open_ports?.length > 0 ? (data?.network_info?.open_ports ?? []).map(
                                        (portItem: any) =>
                                            `${safeText(portItem?.port) ?? "N/A"} (${safeText(
                                                portItem?.status
                                            ) ?? "Unknown"})`
                                    ).join("   ,   ") : "N/A"}
                            </span>

                        </li>

                        {/* <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                            Technologies
                        </span>
                        <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                            {data?.website_security?.technologies[1] || "N/A"}
                        </span>
                    </li> */}

                    </ul>

                    <div className="pt-4 overflow-x-auto w-full">
                        {data?.network_info?.findings?.length > 0 && <DynamicTable columns={column4} data={data?.network_info?.findings?.length > 0 ? data?.network_info?.findings : []} className={"min-w-[600px] "} />}
                    </div>

                </Card>

            </div>

            <div id="pdf-section-3">
                <RoutesScanned data={data?.route_scans?.length > 0 ? data?.route_scans : []} download={isDownload} />
            </div>

            <div id="pdf-section-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiClipboardLine /> Compliance Overview</div>} tooltip="Basic compliance checks based on scan results.">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-600 dark:text-gray-400">SSL/TLS Encryption</span>
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${data?.website_security?.ssl_certificate?.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {data?.website_security?.ssl_certificate?.valid ? "Secure (HTTPS)" : "Insecure"}
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-600 dark:text-gray-400">Cookie Consent</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        Check Required
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-600 dark:text-gray-400">OWASP Top 10</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
                                        Scanned
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-600 dark:text-gray-400">GDPR Basic Check</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-700">
                                        Review Needed
                                    </span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                    {/* Quick Actions / Recommendations Static */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiLightbulbLine /> Recommendations</div>} tooltip="Suggested actions based on findings.">
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                <li>Review and fix <b>{data?.finding_counts?.find((f: any) => f.severity === 'High')?.count || 0} High Severity</b> vulnerabilities immediately.</li>
                                <li>Ensure separate <b>Global/Local</b> script usage is optimized (Current ratio: {data?.performance?.script_analysis?.inline_script_count || 0} / {data?.performance?.script_analysis?.external_script_count || 0}).</li>
                                <li>Verify <b>Security Headers</b> implementation (`X-Frame-Options`, `Content-Security-Policy`).</li>
                            </ul>
                        </Card>
                    </div>
                </div>

                <OwaspReport data={data?.compliance?.owasp_top_10 ? data?.compliance?.owasp_top_10 : {}} download={isDownload} openModal={openModal} />
            </div>

        </div>

        {/* <VurnabilitiesFindings data={data?.findings?.length > 0 ? data?.findings : []} /> */}

        {/* {data?.route_scans?.length > 0 && <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} className={"min-w-[500px]"} />} */}

        {/* {data?.findings?.length > 0 && <DynamicTable columns={columns2} data={data?.findings?.length > 0 ? data?.findings : []} className={"min-w-[600px]"} />} */}

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
            <div className="relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">

                {/* HEADER */}
                <div className="mb-6">
                    <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        🔐 Vulnerability Solution Guide
                    </h4>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Below are the detected security vulnerabilities along with recommended fixes.
                    </p>
                </div>

                {/* SCROLL AREA */}
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">

                    {/* Vulnerability Card */}
                    <div className={`rounded-xl border p-5 ${severityColor(modalData?.severity)} bg-opacity-10 border-opacity-30`}>
                        <div className="flex justify-between items-center">
                            <h5 className="text-lg font-semibold">
                                {modalData?.type || "Vulnerability Details"}
                            </h5>
                            <Badge color={modalData?.severity}>{modalData?.severity || "Unknown Risk"}</Badge>
                        </div>

                        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                            {modalData?.detail || modalData?.key || "No details available."}
                        </p>

                        {/* Impact */}
                        {modalData?.impact && (
                            <div className="mt-4">
                                <h6 className="font-medium text-gray-800 dark:text-white/90">
                                    ⚠️ Impact
                                </h6>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {modalData?.impact}
                                </p>
                            </div>
                        )}

                        {/* Solution */}
                        <div className="mt-4">
                            <h6 className="font-medium text-gray-800 dark:text-white/90">
                                ✅ Recommended Solution
                            </h6>
                            {/* Check if solution is an array or string */}
                            {Array.isArray(modalData?.solution) ? (
                                <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {modalData?.solution.map((sol: any, index: number) => (
                                        <li key={index}>{sol}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {modalData?.solution || "No specific solution provided."}
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
                                <strong>Evidence:</strong> {modalData?.evidence}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Modal>

    </>);
}
