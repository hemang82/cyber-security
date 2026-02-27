"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import OwaspReport, { RoutesScanned, VurnabilitiesFindings } from "@/components/ui/faq/FaqSection";
import { useInventoryStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { RiInformation2Line, RiFileList3Line, RiGlobalLine, RiSpeedUpLine, RiServerLine, RiShieldCheckLine, RiPieChartLine, RiClipboardLine, RiLightbulbLine, RiBugLine } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";
import { toPng } from "html-to-image";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { PerformanceChart } from "@/components/charts/circular/PerformanceChart";
import { VulnerabilityChart } from "@/components/charts/circular/VulnerabilityChart";

import { GoEye } from "react-icons/go";
import CountUp from "react-countup";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "../assetsReport/CyberSecurityPDF";
import Drawer from "@/components/ui/drawer/Drawer";
import { Badge, Card, CyberColorClass, safeJoin, severityColor } from "./WebsiteDetails";
import { RiShieldFlashLine, RiLockPasswordLine, RiSearchEyeLine, RiAlarmWarningFill, RiCloudFill } from "react-icons/ri";
import { CloudReportPDF } from "../assetsReport/CloudReportPDF";

const StatCard = ({ title, value, icon: Icon, colorClass, subValue, trend }: any) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon size={22} className={colorClass.replace('bg-', 'text-').replace('-50', '-600').replace('-100', '-600')} />
            </div>
            {trend && <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{trend}</span>}
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</h3>
                {subValue && <span className="text-xs text-gray-400 font-medium">/ {subValue}</span>}
            </div>
        </div>
    </div>
);

export default function CloudDetails({ resAssetsDetails }: any) {

    const finalData = resAssetsDetails;

    console.log("resAssetsDetails Cloud ", finalData);

    const { setLoader, resetInventory } = useInventoryStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { isOpen, openModal, closeModal, modalData } = useModal();

    const [data, setData] = useState<any>(finalData);
    const [scanDate, setScanDate] = useState<string>("");
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [pdfMargins, setPdfMargins] = useState({ performance: 0, security: 0 });

    useEffect(() => {
        if (finalData) {
            setData(finalData)
            setLoader(false)
            resetInventory()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalData]);

    const [isGenerating, setIsGenerating] = useState(false);

    const handlePdfDownload = async () => {
        if (!data) return;
        setIsGenerating(true);
        try {
            const blob = await pdf(<CloudReportPDF data={data} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeText(data?.cloud_provider || 'Cloud')}-${safeText(data?.target || 'Audit')}-Report.pdf`;
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

    const complianceColumns = [
        {
            key: "check",
            title: "Security Check",
            render: (row: any) => (
                <span className="text-base font-medium">{safeText(row?.check)}</span>
            ),
        },
        {
            key: "category",
            title: "Category",
            render: (row: any) => (
                <span className="text-sm px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{safeText(row?.category)}</span>
            ),
        },
        {
            key: "status",
            title: "Status",
            render: (row: any) => {
                const status = String(row?.status || "").toUpperCase();
                let color = "Blue";
                if (status === "PASS") color = "Green";
                if (status === "FAIL") color = "Red";
                if (status === "WARN") color = "Orange";
                return <Badge color={color}>{status || "UNKNOWN"}</Badge>;
            },
        },
        {
            key: "detail",
            title: "Details",
            render: (row: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">{safeText(row?.detail)}</span>
            ),
        }
    ];

    const inventoryColumns = [
        {
            key: "name",
            title: "Resource Name",
            render: (row: any) => (
                <span className="text-base font-medium">{row?.name || "N/A"}</span>
            ),
        },
        {
            key: "type",
            title: "Type",
            render: (row: any) => (
                <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{safeText(row?.type)}</span>
            ),
        },
        {
            key: "resource_id",
            title: "Resource ID",
            render: (row: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400 break-all">{safeText(row?.resource_id)}</span>
            ),
        }
    ];

    const findingsColumns = [
        {
            key: "type",
            title: "Vulnerability",
            render: (row: any) => (
                <span className="text-base font-semibold">{safeText(row?.type)}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
        {
            key: "detail",
            title: "Description",
            render: (row: any) => (
                <span className="text-sm">{row?.detail || "N/A"}</span>
            ),
        },
        {
            key: "action",
            title: "Solution",
            render: (row: any) => (
                <button
                    className="shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-300 text-blue-500 hover:bg-blue-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    onClick={() => openModal(row)}
                >
                    <GoEye size={16} />
                </button>
            ),
        }
    ];

    const flattenedCompliance = data?.compliance ? Object.values(data.compliance).flat() : [];

    const getFindingCounts = () => {
        if (!data?.findings) return [];
        const counts: Record<string, number> = {};
        const colors: Record<string, string> = {
            Critical: "DarkRed",
            High: "Red",
            Medium: "Orange",
            Low: "Yellow",
            Info: "Blue"
        };

        data.findings.forEach((f: any) => {
            counts[f.severity] = (counts[f.severity] || 0) + 1;
        });

        return Object.keys(counts).map(severity => ({
            severity,
            count: counts[severity],
            color: colors[severity] || "Blue"
        }));
    };

    const findingCounts = getFindingCounts();

    return (<>

        <div className="p-3">
            <div id="pdf-section-1">
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">
                    {/* Header Details (Left) */}
                    <div className="flex flex-col gap-1 text-left">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            <RiCloudFill size={14} className="text-brand-600 dark:text-brand-400" />
                            Cloud Environment Analysis
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {safeText(data?.cloud_provider || "AWS")} Security Audit
                            </h2>
                            <Badge color={data?.risk_color || "Red"}>{data?.risk_level || "Critical"}</Badge>
                        </div>

                        <p className="text-sm text-gray-400 font-bold mt-1 tracking-tight">{data?.target || "Global Infrastructure"}</p>
                    </div>

                    {/* Action Button (Right) */}
                    {!isDownload && (
                        <div className="flex-shrink-0">
                            {isClient ? (
                                <PDFDownloadLink
                                    document={<CloudReportPDF data={data} />}
                                    fileName={`${safeText(data?.target)}-Report.pdf`}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600 cursor-pointer"
                                >
                                    {/* @ts-ignore */}
                                    {({ loading }) => (
                                        <>
                                            <HiDownload size={20} />
                                            <span>Download Report</span>
                                        </>
                                    )}
                                </PDFDownloadLink>
                            ) : (
                                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition opacity-50 cursor-not-allowed">
                                    <HiDownload size={20} />
                                    <span>Loading...</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-6">
                    <StatCard
                        title="Security Score"
                        value={safeText(data?.security_score ? `${data?.security_score}%` : "0%")}
                        icon={RiShieldFlashLine}
                        colorClass={data?.security_score > 70 ? "bg-green-100" : "bg-red-100"}
                        subValue="100"
                    />
                    <StatCard
                        title="Critical Issues"
                        value={safeText(data?.critical_issues)}
                        icon={RiAlarmWarningFill}
                        colorClass="bg-red-100"
                        trend={data?.critical_issues > 0 ? `+${data.critical_issues}` : ""}
                    />
                    <StatCard
                        title="Resources Scanned"
                        value={safeText(data?.summary?.resources_scanned)}
                        icon={RiSearchEyeLine}
                        colorClass="bg-blue-100"
                    />
                    <StatCard
                        title="Public Services"
                        value={safeText(data?.open_public_services)}
                        icon={RiLockPasswordLine}
                        colorClass="bg-orange-100"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mb-4">
                    {/* Vulnerabilities */}
                    <Card title={<div className="flex items-center gap-2 uppercase tracking-tight font-bold"><RiPieChartLine className="text-brand-600" /> Security Posture Analysis</div>} tooltip={<>
                        <h1 className="mb-1 uppercase font-bold text-xs">Score Methodology</h1> &nbsp;
                        <p>Our scoring algorithm considers IAM policies, resource exposure, and missing security defaults. Remediating High and Critical items will significantly improve this score.</p>
                    </>}>

                        <div className="flex flex-col xl:flex-row items-center justify-around gap-10">
                            {/* Score & Grade Section */}
                            <div className="flex flex-col items-center gap-8 sm:flex-row bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <div className="relative">
                                    <div className={`flex h-36 w-36 items-center justify-center rounded-full border-[8px] ${data?.security_score >= 80 ? 'border-green-500' : data?.security_score >= 60 ? 'border-yellow-400' : 'border-red-500'} bg-white dark:bg-gray-900 shadow-xl`}>
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white leading-none">
                                                <CountUp end={Number(safeText(data?.security_score)) || 0} duration={2} />
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
                                                {safeText(item?.count)} {safeText(item?.severity)}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="mt-5 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Insight</p>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Found <span className="text-red-600">{safeText(data?.critical_issues) || 0} Critical</span> architecture flaws that require immediate attention.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="flex-1 w-full max-w-sm min-h-[250px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl p-4">
                                <VulnerabilityChart data={findingCounts || []} />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase flex items-center gap-2 mb-2">
                                    <RiShieldCheckLine /> Strategic Overview
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                                    Your cloud environment is currently at <b>{safeText(data?.risk_level)}</b>. The primary drivers of this risk are <b>{safeText(data?.findings?.[0]?.type)}</b> and exposed public services. Improving your IAM posture should be the #1 priority.
                                </p>
                            </div>
                            <div className="p-5 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                <h3 className="text-sm font-bold text-orange-900 dark:text-orange-400 uppercase flex items-center gap-2 mb-2">
                                    <RiLightbulbLine /> Immediate Action
                                </h3>
                                <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed font-medium">
                                    We recommend starting with <b>Multi-Factor Authentication (MFA)</b> enforcement for all root and administrative accounts to prevent credential hijacking.
                                </p>
                            </div>
                        </div>

                    </Card>
                </div>

                <div className="grid grid-cols-1  md:grid-cols-1 ">
                    {/* Scan Details */}
                    <div className="mb-4">

                        <Card title={<div className="flex items-center gap-2"><RiFileList3Line />Scan Details</div>} tooltip={<>
                            <h1 className="mb-1">Scan Overview</h1> &nbsp;
                            <p>Overview of the target asset, including its risk classification and automated scan metadata.</p>
                        </>}>
                            <p className="mb-4 text-gray-700 text-base">
                                Key metadata about the security scan, including the target asset, risk scoring, and scan classification.
                            </p>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Asset Name
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700 break-all">
                                        {safeText(data?.scan_context)}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Asset Type
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700">
                                        {safeText(data?.cloud_provider) || "Cloud Service"}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Risk Level
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700">
                                        {safeText(data?.summary?.risk_level)}
                                    </span>
                                </li>


                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Security Score
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700">
                                        {safeText(data?.summary?.score)}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Scan Method
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700">
                                        Automated
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Resources Scanned
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700">
                                        {safeText(data?.summary?.resources_scanned)}
                                    </span>
                                </li>

                                <li className="flex flex-col sm:flex-row items-start gap-2 sm:gap-5 py-2.5">
                                    <span className="w-full text-base text-gray-700 sm:w-1/3 dark:text-gray-700">
                                        Open Public Services
                                    </span>
                                    <span className="w-full text-base text-gray-900 sm:w-2/3 dark:text-gray-700 text-red-600 font-bold">
                                        {safeText(data?.open_public_services)}
                                    </span>
                                </li>

                            </ul>
                        </Card>

                    </div>

                    {/* Compliance Information */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiShieldCheckLine /> Cloud Security Compliance</div>} tooltip={<>
                            <h1 className="mb-1">Compliance & Security Best Practices</h1>  &nbsp;
                            <p>This section evaluates your cloud environment against industry benchmarks (IAM, Storage, Network, Logging, etc.).</p>
                        </>}>
                            <p className="mb-4 text-gray-700 text-base">
                                Evaluation of cloud resources against security best practices. Green Indicates PASS, Orange for WARN, and Red for FAIL.
                            </p>
                            <div className="overflow-x-auto w-full">
                                <DynamicTable columns={complianceColumns} data={flattenedCompliance} className={"min-w-[600px]"} />
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Findings */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiBugLine /> Security Findings</div>} tooltip="Specific security vulnerabilities detected in the cloud environment.">
                            <p className="mb-4 text-gray-700 text-base">
                                List of detected vulnerabilities with their severity and recommended solutions.
                            </p>
                            <div className="overflow-x-auto w-full">
                                <DynamicTable columns={findingsColumns} data={data?.findings || []} className={"min-w-[600px]"} />
                            </div>
                        </Card>
                    </div>

                    {/* Cloud Inventory */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiServerLine /> Cloud Resource Inventory</div>} tooltip="A comprehensive list of all scanned cloud resources.">
                            <p className="mb-4 text-gray-700 text-base">
                                Inventory of storage buckets, security groups, IAM users, and other resources analyzed during the scan.
                            </p>
                            <div className="overflow-x-auto w-full">
                                <DynamicTable columns={inventoryColumns} data={data?.inventory || []} className={"min-w-[600px]"} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div id="pdf-section-2" className="hidden">
                {/* Hidden sections from old template as they don't apply to cloud */}
            </div>

            <div id="pdf-section-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiClipboardLine /> Compliance Overview</div>} tooltip="Basic compliance checks based on scan results.">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-700 dark:text-gray-400">Cloud Provider</span>
                                    <span className={`px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700`}>
                                        {data?.cloud_provider || "N/A"}
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-700 dark:text-gray-400">Scan Status</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-700">
                                        {data?.scan_status || "Complete"}
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-700 dark:text-gray-400">Inventory Status</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
                                        {data?.inventory?.length || 0} Resources
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 py-3">
                                    <span className="text-gray-700 dark:text-gray-400">Vulnerability Count</span>
                                    <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-700">
                                        {data?.findings?.length || 0} Issues
                                    </span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                    {/* Quick Actions / Recommendations Static */}
                    <div className="mb-4">
                        <Card title={<div className="flex items-center gap-2"><RiLightbulbLine /> Recommendations</div>} tooltip="Suggested actions based on findings.">
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-400">
                                <li>Remediate <b>{data?.critical_issues || 0} Critical</b> security issues to improve posture score.</li>
                                <li>Review <b>{data?.open_public_services || 0} Public Services</b> and ensure they are intended to be exposed.</li>
                                <li>Rotate <b>IAM Access Keys</b> older than 90 days.</li>
                                <li>Enable <b>CloudTrail</b> and <b>GuardDuty</b> in all regions for continuous monitoring.</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>

        </div>

        {/* <VurnabilitiesFindings data={data?.findings?.length > 0 ? data?.findings : []} /> */}

        {/* {data?.route_scans?.length > 0 && <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} className={"min-w-[500px]"} />} */}

        {/* {data?.findings?.length > 0 && <DynamicTable columns={columns2} data={data?.findings?.length > 0 ? data?.findings : []} className={"min-w-[600px]"} />} */}

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
                                <h6 className="font-medium text-gray-900 dark:text-white/90">
                                    ⚠️ Impact
                                </h6>
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                    {modalData?.impact}
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
                                        <li key={index}>{sol}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
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
