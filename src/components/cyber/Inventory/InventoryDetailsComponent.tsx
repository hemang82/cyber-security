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


export const Card = ({ title, tooltip, children }: any) => (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 my-4">

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
    YELLOW = "Yellow",
}

export const CyberColorClass: Record<CyberColor, string> = {
    [CyberColor.GREEN]: "bg-green-100 text-green-700 border-green-300",

    [CyberColor.BLUE]: "bg-blue-100 text-blue-700 border-blue-500",

    [CyberColor.ORANGE]: "bg-orange-100 text-orange-700 border-orange-300",

    [CyberColor.RED]: "bg-red-100 text-red-700 border-red-300",

    [CyberColor.DARK_RED]: "bg-red-200 text-red-900 border-red-700",

    [CyberColor.YELLOW]: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

/* ---------- UI Helpers ---------- */
export const Badge = ({ color, children, classname }: any) => {
    return (
        <span className={`${classname} border border-gray-500 rounded-md px-2 py-1 text-base font-medium capitalize ${CyberColorClass[color as keyof typeof CyberColorClass]} `}>
            {children}
        </span>
    );
};

export default function InventoryDetailsComponent({ InventoryData }: any) {

    const { setLoader, resetInventory } = useInventoryStore();

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
                const sectionId = sectionIds[i];

                if (!element) {
                    console.warn(`Section not found: ${sectionId}`);
                    continue;
                }

                console.log(`Processing PDF section: ${sectionId}`);

                // Yield to main thread to prevent UI freeze
                await new Promise(resolve => setTimeout(resolve, 100));

                try {
                    if (i > 0) {
                        pdf.addPage();
                    }

                    const width = element.scrollWidth;
                    const height = element.scrollHeight;

                    if (height === 0 || width === 0) {
                        console.warn(`Skipping empty section: ${sectionId}`);
                        continue;
                    }

                    // Use JPEG which is much faster to encode than PNG
                    // Reduce pixelRatio to 1 to prevent canvas size limits on large sections
                    console.log(`Section ${sectionId} dimensions: ${width}x${height}`);

                    const dataUrl = await toJpeg(element, {
                        // quality: 0.95,
                        cacheBust: true,
                        backgroundColor: "#ffffff",
                        pixelRatio: 1, // Reduced from 2 to avoid large canvas issues
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
                            color: "#000000", // Force black text
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
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = (e) => reject(new Error(`Image load failed for section ${sectionId}`));
                    });

                    const imgWidth = img.width;
                    const imgHeight = img.height;

                    // Ratio to fit image width to content width (inside margins)
                    const ratio = contentWidth / imgWidth;

                    // Height of one page's content area in terms of source image pixels
                    const pageHeightInImagePixels = contentHeight / ratio;

                    let position = 0;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) throw new Error("Canvas context is null");

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

                        position += pageHeightInImagePixels;
                    }
                } catch (sectionErr) {
                    console.error(`Error processing section ${sectionId}:`, sectionErr);
                    // Continue to next section instead of breaking completely? 
                    // Or rethrow to stop? Let's log and continue for now to output partial PDF if possible.
                }
            }

            pdf.save(`${safeText(data?.target)}-Report.pdf`);
        } catch (err) {
            console.error("PDF generation critical failure:", err);
            alert("Failed to generate PDF. Please check console for details.");
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

    const safeJoin = (arr: any, separator = ",\n") => Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "N/A";

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

                    {/* Right Section */}
                    {
                        !isDownload &&
                        <div className="flex gap-3">
                            <button onClick={handlePdfDownload} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600" >
                                <HiDownload size={20} />
                                Download Report
                            </button>
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


                        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row my-3">
                            <div className="flex flex-col items-center gap-4 sm:flex-row">
                                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-brand-800 text-lg font-medium text-brand-800 `} > {safeText(data?.output_score) || 0} </div>
                                <div className="flex flex-col ">
                                    <div className="flex flex-wrap gap-2">

                                        {data?.finding_counts?.map((item: any, index: number) => (
                                            <Badge key={index} color={item?.color}>
                                                {item?.count} {item?.severity}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-base text-red-700 ">
                                        ⚠ Vulnerabilities Not Fixed : <b>{safeText(data?.output_score) || 0}</b>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex-1 flex justify-end">
                                <VulnerabilityChart data={data?.finding_counts || []} />
                            </div> */}
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
                                Publicly available registration and server details. Understanding your domain's footprint is essential for identifying potential attack surfaces.
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
