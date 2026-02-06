"use client";

import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import OwaspReport, { RoutesScanned, VurnabilitiesFindings } from "@/components/ui/faq/FaqSection";
import { useInventoryStore } from "@/store";
import { useEffect, useState } from "react";
import { RiInformation2Line } from "react-icons/ri";
import { HiDownload } from "react-icons/hi";


/* ---------- UI Helpers ---------- */
const Badge = ({ color, children }: any) => {
    const map: any = {
        error: "bg-red-100 text-red-600",
        warning: "bg-orange-100 text-orange-600",
        success: "bg-green-100 text-green-600",
        info: "bg-blue-100 text-blue-600",
        gray: "bg-gray-100 text-gray-600",
    };
    return (
        <span className={`rounded-md px-2 py-1 text-base font-medium ${map[color]}`}>
            {children}
        </span>
    );
};

// const Card = ({ title, children }: any) => (
//     <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//         <h3 className="mb-4 text-base font-semibold text-gray-700 dark:text-gray-200">
//             {title}
//         </h3>
//         {children}
//     </div>
// );

const Card = ({ title, tooltip, children }: any) => (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-4 flex items-center gap-2 ">

            <h3 className=" text-xl font-semibold text-gray-800 dark:text-white/90">
                {title}
            </h3>

            {tooltip && (
                <div className="group relative cursor-pointer">
                    <span className="text-lg text-gray-700"><RiInformation2Line size={20} /></span>

                    <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-70 -translate-x-1/2 rounded-md bg-gray-100 px-3 py-2 text-base text-dark opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>

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

export default function InventoryDetailsComponent({ InventoryData }: any) {

    const { setLoader, resetInventory } = useInventoryStore();

    const [data, setData] = useState<any>(null);
    const [scanDate, setScanDate] = useState<string>("");

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

    const generateSecurityPDF = async (data: any) => {
        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;
        const pdf = new jsPDF("p", "mm", "a4");

        /* ---------------- COVER PAGE ---------------- */

        pdf.setFontSize(22);
        pdf.text("Website Security Report", 20, 30);

        pdf.setFontSize(12);
        pdf.text(`Target: ${safeText(data?.target)}`, 20, 50);
        pdf.text(`Scan Date: ${new Date().toLocaleDateString()}`, 20, 60);
        pdf.text(`Risk Level: ${safeText(data?.risk_level)}`, 20, 70);
        pdf.text(`Security Score: ${safeText(data?.summary?.score)}`, 20, 80);

        pdf.setFontSize(10);
        pdf.text(
            "Confidential – For authorized use only",
            20,
            270
        );

        pdf.addPage();

        /* ---------------- EXECUTIVE SUMMARY ---------------- */

        pdf.setFontSize(18);
        pdf.text("Executive Summary", 14, 20);

        pdf.setFontSize(11);
        pdf.text(
            "This automated scan analyzed the target for security weaknesses and misconfigurations.",
            14,
            30
        );

        autoTable(pdf, {
            startY: 40,
            head: [["Metric", "Value"]],
            body: [
                ["Total Findings", safeText(data?.findings?.length)],
                ["Risk Level", safeText(data?.risk_level)],
                ["Security Score", safeText(data?.summary?.score)],
                ["Blacklisted", data?.summary?.blacklisted ? "Yes" : "No"],
            ],
        });

        /* ---------------- VULNERABILITIES ---------------- */

        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("Vulnerability Findings", 14, 20);

        const findings =
            data?.findings?.map((f: any) => [
                safeText(f?.type),
                safeText(f?.severity),
                safeText(f?.detail),
                safeText(f?.evidence),
            ]) || [];

        autoTable(pdf, {
            startY: 30,
            head: [["Type", "Severity", "Description", "Evidence"]],
            body: findings,
            styles: { fontSize: 9 },
        });

        /* ---------------- DOMAIN INFO ---------------- */

        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("Domain Information", 14, 20);

        autoTable(pdf, {
            startY: 30,
            head: [["Field", "Value"]],
            body: [
                ["Registrar", safeText(data?.network_info?.whois?.registrar)],
                ["Expiry", safeText(data?.network_info?.whois?.expiry)],
                ["Host", safeText(data?.network_info?.host)],
                [
                    "IP Address",
                    safeText(data?.network_info?.dns_records?.A?.join(", ")),
                ],
            ],
        });

        /* ---------------- SECURITY HEADERS ---------------- */

        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("Security Headers", 14, 20);

        const headers = Object.entries(
            data?.website_security?.security_headers ?? {}
        ).map(([k, v]: any) => [
            k,
            safeText(v?.status),
            safeText(v?.severity),
        ]);

        autoTable(pdf, {
            startY: 30,
            head: [["Header", "Status", "Severity"]],
            body: headers,
        });

        /* ---------------- PERFORMANCE ---------------- */

        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text("Performance Metrics", 14, 20);

        autoTable(pdf, {
            startY: 30,
            head: [["Metric", "Value"]],
            body: [
                ["Load Time", `${safeText(data?.performance?.load_time_ms)} ms`],
                ["Page Size", safeText(data?.performance?.page_size_kb)],
                ["Status", safeText(data?.performance?.status)],
            ],
        });

        /* ---------------- FOOTER ---------------- */

        const pageCount = pdf.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.text(
                `Page ${i} of ${pageCount}`,
                180,
                290
            );
        }

        /* ---------------- SAVE ---------------- */

        pdf.save(
            `Security_Report_${safeText(data?.target)}_${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`
        );
    };

    const columns = [
        {
            key: "url",
            title: "Routes Scanned",
            render: (row: any) => (
                <span className="text-base">{row?.url || 0}</span>
            ),
        },
        {
            key: "url",
            title: "Vulnerabilities",
            render: (row: any) => (
                <span className="text-base">{row?.vulnerabilities?.length || 0}</span>
            ),
        },
    ];

    const columns2 = [
        {
            key: "type",
            title: "Vulnerabilities Find",
            render: (row: any) => (
                <span className="text-base">{row?.type || 0}</span>
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
        {
            key: "details",
            title: "Description",
            render: (row: any) => (
                <span className="text-base">{safeText(row?.detail) || "-"}</span>
            ),
        },
    ];

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

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">

            {/* Header Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Info */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

                    {/* Website */}
                    <span className="text-base sm:text-base font-medium text-gray-700 dark:text-gray-400 break-all">
                        Website: {safeText(data?.target)}
                    </span>

                    {/* Risk Badge */}
                    <span className="inline-flex w-fit items-center justify-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs sm:text-base font-medium text-red-600 dark:bg-success-500/15 dark:text-success-500">
                        {safeText(data?.risk_level) || "Unknown"}
                    </span>
                </div>

                {/* Scan Date */}
                <p className="text-xs sm:text-base text-gray-500 dark:text-gray-400">
                    Scan Date:{" "}
                    <span className="font-medium">
                        {safeText(scanDate)}
                    </span>
                </p>
            </div>

            {/* Right Section */}
            <div className="flex gap-3">
                <button
                    onClick={() => generateSecurityPDF(data)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-base font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                    <HiDownload size={20} />
                    Download
                </button>
            </div>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Vulnerabilities */}
            <Card title="Vulnerabilities" tooltip={<>
                <h1 className="mb-1 ">How Security Score Is Calculated ?</h1>  &nbsp;
                <p>The security score is calculated based on the total number of vulnerabilities, their severity level, and compliance with security best practices.
                    High-risk issues significantly reduce the overall score.</p>
            </>}>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-red-500 text-lg font-bold">
                        {data?.findings?.length || 0}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge color="error">{safeText(data?.findings?.length) || 0} {safeText(data?.risk_level)}</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length) / 2 || 0} High</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length) / 4 || 0} Medium</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length) / 6 || 0} Low</Badge>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-red-50 p-3 text-base text-red-700 ">
                    ⚠ Vulnerabilities Not Fixed : <b>{safeText(data?.findings?.length) || 0} / {data?.findings?.length || 0}</b>
                </div>

                <div className="my-3">
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 ">What Does High Risk Mean?</h3>
                    <p className="text-gray-500 text-base mt-2">High-risk vulnerabilities can allow attackers to gain unauthorized access, steal sensitive data, or completely compromise the website.
                        These issues should be fixed on priority to reduce business, legal, and reputation risk.</p>
                </div>

            </Card>

            {/* Scan Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">

                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Scan Details
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Asset Name
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.scan_context)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Asset Type
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {"Web Site"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Risk Level
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.summary?.risk_level)}
                        </span>
                    </li>


                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Security Score
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.summary?.score)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Scan Method
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            Automated
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Created at
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(scanDate)}
                        </span>
                    </li>

                </ul>
            </div>

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
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Registrar
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.whois?.registrar)}
                        </span>
                    </li>

                    {/* Expiry */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Expiry
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(formatDate(data?.network_info?.whois?.expiry, DATE_FORMAT?.FULL_DAY_MONTH_YEAR))}
                        </span>
                    </li>

                    {/* Server */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Server
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.website_security?.technologies?.[0])}
                        </span>
                    </li>

                    {/* SSL */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            SSL Certificate
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.ssl_certificate?.valid
                                ? `${data.website_security.ssl_certificate.days_remaining} Days Valid`
                                : "Not Found"}
                        </span>
                    </li>

                    {/* A Record */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            A Record
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.A)}
                        </span>
                    </li>

                    {/* MX Records */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            MX Records
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {
                                data?.network_info?.dns_records?.MX?.length > 0 &&
                                    Array.isArray(data?.network_info?.dns_records?.MX)
                                    ? data?.network_info?.dns_records.MX.map((mx: any) => `${mx.exchange} (Priority ${mx.priority})`).join(",\n") : "N/A"}
                        </span>
                    </li>

                    {/* TXT Records */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            TXT Records
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400 break-all whitespace-pre-line">
                            {safeJoin(data?.network_info?.dns_records?.TXT)}
                        </span>
                    </li>
                    {/* Name Servers */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Name Server
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.NS)}
                        </span>
                    </li>

                    {/* DNSSEC */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            DNSSEC
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.dns_records?.dnssec)}
                        </span>
                    </li>

                    {/* Whois */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Whois
                        </span>
                        <pre className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.whois?.raw_partial)}
                        </pre>
                    </li>

                </ul>
            </Card>

            {/* Performance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Performance
                </h2>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Load Time
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.load_time_ms)} ms
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Page Size
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.page_size_kb) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Status
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.status) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Inline script count
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.script_analysis?.inline_script_count) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            External Script Count
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.script_analysis?.external_script_count) || "-"}
                        </span>
                    </li>


                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Sitemap
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.seo_check?.sitemap_xml) || "0"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Robot TXT File
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.seo_check?.robots_txt) || "0"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Website BlackList
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.summary?.blacklisted ? "Blacklisted Webiste" : "Not Blacklist"}
                        </span>
                    </li>

                </ul>
            </div>

            {/* Website Security Headers */}
            <Card title=" Website Security Headers" tooltip={<>
                <h1 className="mb-1">Why Security Headers Matter</h1>  &nbsp;
                <p>Security headers protect the website from common attacks such as cross-site scripting, clickjacking, and data injection.
                    Missing or misconfigured headers weaken browser-level protection.</p>
            </>}>

                {/* <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Website Security Headers
                </h2> */}

                {/* <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(
                        data?.website_security?.security_headers ?? {}
                    ).map(([key, value]: any) => (
                        <li key={key} className="flex items-start gap-5 py-2.5">

                            <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400 overflow-hidden ">
                                {key?.replaceAll("-", " ")}
                            </span>

                            <div className="flex gap-2 w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                    {safeText(value?.status) || "N/A"}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(value?.severity || "Info")}`} >
                                    {safeText(value?.severity) || "Info"}
                                </span>
                            </div>
                        </li>
                    ))}

                </ul> */}

                <DynamicTable columns={column3} data={Object.entries(data?.website_security?.security_headers ?? {}).map(([key, value]: any) => ({
                    key: key.replaceAll("-", " "),
                    status: value?.status ?? "N/A",
                    severity: value?.severity ?? "Info",
                })
                ) || []} className={"min-w-[400px]"} />

            </Card>

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
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 ">Attack Surface Overview</h3>
                    <p className="text-gray-500 text-base mt-2">The attack surface represents all publicly accessible entry points that attackers can target.
                        Reducing exposed services and endpoints minimizes the risk of exploitation.</p>
                </div> */}

                <ul className="divide-y divide-gray-100 dark:divide-gray-800 mb-4 border-b pb-4">

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Host
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400 break-all">
                            {safeText(data?.network_info?.host) || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            IP Address
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.A)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Technologies
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.website_security?.technologies)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">

                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Open Ports
                        </span>

                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
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
                        <span className="w-1/2 text-base text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Technologies
                        </span>
                        <span className="w-1/2 text-base text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.technologies[1] || "N/A"}
                        </span>
                    </li> */}

                </ul>

                <div className="pt-4">
                    {data?.network_info?.findings?.length > 0 && <DynamicTable columns={column4} data={data?.network_info?.findings?.length > 0 ? data?.network_info?.findings : []} className={"min-w-[600px] "} />}
                </div>

            </Card>

        </div>

        <RoutesScanned data={data?.route_scans?.length > 0 ? data?.route_scans : []} />

        <OwaspReport data={data?.compliance?.owasp_top_10 ? data?.compliance?.owasp_top_10 : {}} />

        {/* <VurnabilitiesFindings data={data?.findings?.length > 0 ? data?.findings : []} /> */}


        {/* {data?.route_scans?.length > 0 && <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} className={"min-w-[500px]"} />} */}

        {/* {data?.findings?.length > 0 && <DynamicTable columns={columns2} data={data?.findings?.length > 0 ? data?.findings : []} className={"min-w-[600px]"} />} */}

    </>);
}
