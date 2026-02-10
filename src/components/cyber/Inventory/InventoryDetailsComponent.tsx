"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import OwaspReport, { RoutesScanned, VurnabilitiesFindings } from "@/components/ui/faq/FaqSection";
import { useInventoryStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { RiInformation2Line } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { toPng } from "html-to-image";

export const Card = ({ title, tooltip, children }: any) => (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-4 flex items-center gap-2 ">

            <h3 className="text-2xl font-semibold text-brand-800 dark:text-white/90">
                {title}
            </h3>

            {tooltip && (
                <div className="group relative cursor-pointer">
                    <span className="text-lg text-brand-800"><RiInformation2Line size={20} /></span>

                    <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-70 -translate-x-1/2 rounded-md bg-gray-100 px-3 py-2 text-base text-dark opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>
        <hr className="w-full border-gray-200 dark:border-gray-800 mb-3" />

        {children}
    </div>
);

const severityColorMap: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    warning: "bg-yellow-50 text-yellow-600",
    low: "bg-success-100 text-success-700",
    info: "bg-blue-50 text-blue-500",
    ["critical risk"]: "bg-yellow-100 text-yellow-700",
    ["safe"]: "bg-success-100 text-success-700",
    ["high risk"]: "bg-orange-100 text-orange-700"
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
}

export const CyberColorClass: Record<CyberColor, string> = {
    [CyberColor.GREEN]: "bg-green-100 text-green-700 border-green-300",

    [CyberColor.BLUE]: "bg-blue-100 text-blue-700 border-blue-500",

    [CyberColor.ORANGE]: "bg-orange-100 text-orange-700 border-orange-300",

    [CyberColor.RED]: "bg-red-100 text-red-700 border-red-300",

    [CyberColor.DARK_RED]: "bg-red-200 text-red-900 border-red-700",
};

/* ---------- UI Helpers ---------- */
const Badge = ({ color, children }: any) => {
    return (
        <span className={`rounded-md px-2 py-1 text-base font-medium ${CyberColorClass[color as keyof typeof CyberColorClass]}`}>
            {children}
        </span>
    );
};

export default function InventoryDetailsComponent({ InventoryData }: any) {

    const { setLoader, resetInventory } = useInventoryStore();

    const [data, setData] = useState<any>(null);
    const [scanDate, setScanDate] = useState<string>("");
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [pdfMargins, setPdfMargins] = useState({ performance: 0, security: 0 });

    useEffect(() => {
        setData(InventoryData)
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

    const handlePdfDownload = async () => {
        setLoader(true);
        setIsDownload(true);
        // Wait for the expansion animation (300ms) + buffer
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const sectionIds = ['pdf-section-1', 'pdf-section-2', 'pdf-section-3', 'pdf-section-4'];
        const elements = sectionIds.map(id => document.getElementById(id));

        if (elements.some(el => !el)) {
            console.error("Some sections not found");
            setIsDownload(false);
            setLoader(false);
            return;
        }

        try {
            const { toJpeg } = await import("html-to-image");
            const jsPDF = (await import("jspdf")).default;
            // Standard A4 dimensions in points
            const pdfWidth = 595.28;
            const pdfHeight = 841.89;
            const pdfMargin = 20; // 20pt padding on all 4 sides
            const contentWidth = pdfWidth - (2 * pdfMargin);
            const contentHeight = pdfHeight - (2 * pdfMargin);

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
            });

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i] as HTMLElement;
                if (!element) continue;

                // Yield to main thread to prevent UI freeze
                await new Promise(resolve => setTimeout(resolve, 100));

                if (i > 0) {
                    pdf.addPage();
                }

                const width = element.scrollWidth;
                const height = element.scrollHeight;

                // Use JPEG which is much faster to encode than PNG
                // pixelRatio 2 is good balance of quality/speed
                const dataUrl = await toJpeg(element, {
                    // quality: 0.95,
                    cacheBust: true,
                    backgroundColor: "#ffffff",
                    pixelRatio: 2,
                    width,
                    height,
                    canvasWidth: width * 2,
                    canvasHeight: height * 2,
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

                const img = new Image();
                img.src = dataUrl;
                await new Promise((resolve) => { img.onload = resolve; });

                const imgWidth = img.width;
                const imgHeight = img.height;

                // Ratio to fit image width to content width (inside margins)
                const ratio = contentWidth / imgWidth;

                // Height of one page's content area in terms of source image pixels
                const pageHeightInImagePixels = contentHeight / ratio;

                let position = 0;

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Canvas width matches source image width
                canvas.width = imgWidth;

                while (position < imgHeight) {
                    // Yield to main thread during heavy processing loop
                    if (position > 0) await new Promise(resolve => setTimeout(resolve, 0));

                    // If we need to split a single section across multiple pages
                    if (position > 0) {
                        pdf.addPage();
                    }

                    // Height of the current slice
                    const sliceHeight = Math.min(pageHeightInImagePixels, imgHeight - position);

                    if (ctx) {
                        // Update canvas height to match strictly the slice height (avoids blank space on last page)
                        canvas.height = sliceHeight;

                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // Draw slice from source image
                        ctx.drawImage(
                            img,
                            0, position, imgWidth, sliceHeight,
                            0, 0, imgWidth, sliceHeight
                        );

                        const pageDataUrl = canvas.toDataURL('image/jpeg', 0.95);

                        // Destination height on PDF document
                        const destHeight = sliceHeight * ratio;

                        // Use JPEG compression in PDF
                        // Add image at margin coordinates
                        pdf.addImage(pageDataUrl, "JPEG", pdfMargin, pdfMargin, contentWidth, destHeight, undefined, 'FAST');
                    }

                    position += pageHeightInImagePixels;
                }
            }

            pdf.save(`${safeText(data?.target)}-Report.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsDownload(false);
            setLoader(false);
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

    const safeJoin = (arr: any, separator = ",\n") => Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "N/A";

    return (<>
        <div className="p-3">
            <div id="pdf-section-1">
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 my-3 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">
                    {/* Header Section */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left Info */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

                            {/* Website */}
                            <span className="text-base sm:text-base font-medium text-gray-800 dark:text-gray-500 break-all">
                                Website : {safeText(data?.target)}
                            </span>

                            {/* Risk Badge */}
                            <span className={`inline-flex w-fit items-center justify-center rounded-full px-2.5 py-0.5 text-xs sm:text-base font-medium ${CyberColorClass[data?.risk_color as keyof typeof CyberColorClass]}`}>
                                {safeText(data?.risk_level) || "Unknown"}
                            </span>
                        </div>

                        {/* Scan Date */}
                        <p className="text-base sm:text-base text-gray-800 dark:text-gray-500">
                            Scan Date:{" "}
                            <span className="font-medium">
                                {safeText(scanDate)}
                            </span>
                        </p>
                    </div>

                    {/* Right Section */}
                    {
                        !isDownload &&
                        <div className="flex gap-3">
                            <button
                                onClick={handlePdfDownload}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                            >
                                <HiDownload size={20} />
                                Download PDF
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                            >
                                <HiDownload size={20} />
                                Download PNG
                            </button>
                        </div>
                    }
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-1">

                    {/* Vulnerabilities */}
                    <Card title="Vulnerabilities" tooltip={<>
                        <h1 className="mb-1 ">How Security Score Is Calculated ?</h1>  &nbsp;
                        <p>The security score is calculated based on the total number of vulnerabilities, their severity level, and compliance with security best practices.
                            High-risk issues significantly reduce the overall score.</p>
                    </>}>
                        <div className="flex flex-col items-center gap-4 sm:flex-row my-3">
                            <div className={`flex h-24 w-24 items-center justify-center rounded-full border-[2px] text-lg font-medium ${CyberColorClass[data?.risk_color as keyof typeof CyberColorClass]}`} > {data?.findings?.length || 0} </div>
                            <div className="flex flex-col ">
                                <div className="flex flex-wrap gap-2">
                                    <Badge color={data?.risk_color}>
                                        {Math.floor((data?.findings?.length || 0) / 2)} High {" "}
                                    </Badge>

                                    <Badge color={data?.risk_color}>
                                        {Math.floor((data?.findings?.length || 0) / 4)} Medium
                                    </Badge>

                                    <Badge color={data?.risk_color}>
                                        {Math.floor((data?.findings?.length || 0) / 6)}  Low
                                    </Badge>
                                </div>
                                <div className="mt-4 rounded-lg bg-red-50 p-3 text-base text-red-700 ">
                                    ⚠ Vulnerabilities Not Fixed : <b>{safeText(data?.findings?.length) || 0} / {data?.findings?.length || 0}</b>
                                </div>
                            </div>
                        </div>

                        <div className="my-3">
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 ">What Does High Risk Mean?</h3>
                            <p className="text-gray-500 text-base mt-2">High-risk vulnerabilities can allow attackers to gain unauthorized access, steal sensitive data, or completely compromise the website.
                                These issues should be fixed on priority to reduce business, legal, and reputation risk.</p>
                        </div>

                    </Card>

                    {/* Scan Details */}
                    <Card title="Scan Details" >
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Asset Name
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.scan_context)}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Asset Type
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {"Web Site"}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Risk Level
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.summary?.risk_level)}
                                </span>
                            </li>


                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Security Score
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.summary?.score)}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Scan Method
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    Automated
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Created at
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(scanDate)}
                                </span>
                            </li>

                        </ul>
                    </Card>

                    {/* Domain Information */}
                    <Card title="Domain Information" tooltip={<>
                        <h1 className="mb-1">Domain & Infrastructure Information</h1> &nbsp;
                        <p>This section provides publicly available domain and infrastructure details.
                            Misconfigured DNS or server settings may increase security risks.</p>
                    </>}>

                        {/* <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Domain Information
                </h2> */}

                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                            {/* Registrar */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Registrar
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.network_info?.whois?.registrar)}
                                </span>
                            </li>

                            {/* Expiry */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Expiry
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(formatDate(data?.network_info?.whois?.expiry, DATE_FORMAT?.FULL_DAY_MONTH_YEAR))}
                                </span>
                            </li>

                            {/* Server */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Server
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.website_security?.technologies?.[0])}
                                </span>
                            </li>

                            {/* SSL */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    SSL Certificate
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {data?.website_security?.ssl_certificate?.valid
                                        ? `${data.website_security.ssl_certificate.days_remaining} Days Valid`
                                        : "Not Found"}
                                </span>
                            </li>

                            {/* A Record */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    A Record
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeJoin(data?.network_info?.dns_records?.A)}
                                </span>
                            </li>

                            {/* MX Records */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    MX Records
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {
                                        data?.network_info?.dns_records?.MX?.length > 0 &&
                                            Array.isArray(data?.network_info?.dns_records?.MX)
                                            ? data?.network_info?.dns_records.MX.map((mx: any) => `${mx.exchange} (Priority ${mx.priority})`).join(",\n") : "N/A"}
                                </span>
                            </li>

                            {/* TXT Records */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    TXT Records
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all whitespace-pre-line">
                                    {safeJoin(data?.network_info?.dns_records?.TXT)}
                                </span>
                            </li>

                            {/* Name Servers */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Name Server
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeJoin(data?.network_info?.dns_records?.NS)}
                                </span>
                            </li>

                            {/* DNSSEC */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    DNSSEC
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.network_info?.dns_records?.dnssec)}
                                </span>
                            </li>

                            {/* Whois */}
                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Whois
                                </span>
                                <pre className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeText(data?.network_info?.whois?.raw_partial)}
                                </pre>
                            </li>

                        </ul>

                    </Card>
                </div>
            </div>

            <div id="pdf-section-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mt-4">
                    {/* Performance */}
                    <div>
                        <Card title="Performance" >
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Load Time
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.performance?.load_time_ms)} ms
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Page Size
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.performance?.page_size_kb) || "-"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Status
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.performance?.status) || "-"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Inline script count
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.performance?.script_analysis?.inline_script_count) || "-"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        External Script Count
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.performance?.script_analysis?.external_script_count) || "-"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Sitemap
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.seo_check?.sitemap_xml) || "0"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Robot TXT File
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {safeText(data?.seo_check?.robots_txt) || "0"}
                                    </span>
                                </li>

                                <li className="flex items-start gap-5 py-2.5">
                                    <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                        Website BlackList
                                    </span>
                                    <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                        {data?.summary?.blacklisted ? "Blacklisted Webiste" : "Not Blacklist"}
                                    </span>
                                </li>

                            </ul>
                        </Card>
                    </div>

                    {/* Website Security Headers */}
                    <div>
                        <Card title=" Website Security Headers" tooltip={<>
                            <h1 className="mb-1">Why Security Headers Matter</h1>  &nbsp;
                            <p>Security headers protect the website from common attacks such as cross-site scripting, clickjacking, and data injection.
                                Missing or misconfigured headers weaken browser-level protection.</p>
                        </>}>

                            <DynamicTable columns={column3} data={Object.entries(data?.website_security?.security_headers ?? {}).map(([key, value]: any) => ({
                                key: key.replaceAll("-", " "),
                                status: value?.status ?? "N/A",
                                severity: value?.severity ?? "Info",
                            })
                            ) || []} className={"min-w-[400px]"} />

                        </Card>
                    </div>

                    {/* Network Information */}
                    <Card title="Network Information" tooltip={<>
                        <h1 className="mb-1">Attack Surface Overview</h1>  &nbsp;
                        <p>The attack surface represents all publicly accessible entry points that attackers can target.
                            Reducing exposed services and endpoints minimizes the risk of exploitation.</p>
                    </>}>

                        {/* <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Network Information
                </h2> */}

                        {/* <div className="my-3">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 ">Attack Surface Overview</h3>
                    <p className="text-gray-500 text-base mt-2">The attack surface represents all publicly accessible entry points that attackers can target.
                        Reducing exposed services and endpoints minimizes the risk of exploitation.</p>
                </div> */}

                        <ul className="divide-y divide-gray-100 dark:divide-gray-800 mb-4 border-b pb-4">

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Host
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500 break-all">
                                    {safeText(data?.network_info?.host) || "N/A"}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    IP Address
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeJoin(data?.network_info?.dns_records?.A)}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">
                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Technologies
                                </span>
                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
                                    {safeJoin(data?.website_security?.technologies)}
                                </span>
                            </li>

                            <li className="flex items-start gap-5 py-2.5">

                                <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-500">
                                    Open Ports
                                </span>

                                <span className="w-1/2 text-base text-gray-800 sm:w-2/3 dark:text-gray-500">
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

                        <div className="pt-4">
                            {data?.network_info?.findings?.length > 0 && <DynamicTable columns={column4} data={data?.network_info?.findings?.length > 0 ? data?.network_info?.findings : []} className={"min-w-[600px] "} />}
                        </div>

                    </Card>

                </div>
            </div>

            <div id="pdf-section-3">
                <RoutesScanned data={data?.route_scans?.length > 0 ? data?.route_scans : []} download={isDownload} />
            </div>

            <div id="pdf-section-4">
                <OwaspReport data={data?.compliance?.owasp_top_10 ? data?.compliance?.owasp_top_10 : {}} download={isDownload} />
            </div>

            {/* <VurnabilitiesFindings data={data?.findings?.length > 0 ? data?.findings : []} /> */}

            {/* {data?.route_scans?.length > 0 && <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} className={"min-w-[500px]"} />} */}

            {/* {data?.findings?.length > 0 && <DynamicTable columns={columns2} data={data?.findings?.length > 0 ? data?.findings : []} className={"min-w-[600px]"} />} */}
        </div>

    </>);
}
