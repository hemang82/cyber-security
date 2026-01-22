"use client";

import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import { useInventoryStore } from "@/store";
import { useEffect, useState } from "react";

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
        <span className={`rounded-md px-2 py-1 text-xs font-medium ${map[color]}`}>
            {children}
        </span>
    );
};

const Card = ({ title, children }: any) => (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {title}
        </h3>
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

    const columns = [
        {
            key: "url",
            title: "Routes Scanned",
        },
        {
            key: "url",
            title: "Vulnerabilities",
            render: (row: any) => (
                <span>{row?.vulnerabilities?.length || 0}</span>
            ),
        },
    ];

    const columns2 = [
        {
            key: "type",
            title: "Vulnerabilities Find",
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
        {
            key: "details",
            title: "Description",
            render: (row: any) => (
                <span>{safeText(row?.detail) || "-"}</span>
            ),
        },
    ];

    const column3 = [
        {
            key: "key",
            title: "Header Name",
        },
        {
            key: "status",
            title: "Status",
            render: (row: any) => (
                <span>{row?.status || 0}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
    ];

    const column4 = [
        {
            key: "type",
            title: "Type",
        },
        {
            key: "detail",
            title: "Description",
            render: (row: any) => (
                <span>{safeText(row?.detail) || 0}</span>
            ),
        },
        {
            key: "severity",
            title: "Severity",
            render: (row: any) => (
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(row?.severity || "Info")}`} >
                    {safeText(row?.severity) || "Info"}
                </span>
            ),
        },
    ];

    const safeText = (value: any) => value === null || value === undefined || value === "" ? "N/A" : value;
    const safeJoin = (arr: any, separator = ",\n") => Array.isArray(arr) && arr.length > 0 ? arr.join(separator) : "N/A";

    return (<>
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">

            {/* Header Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Info */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

                    {/* Website */}
                    <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-400 break-all">
                        Website: {safeText(data?.target)}
                    </span>

                    {/* Risk Badge */}
                    <span className="inline-flex w-fit items-center justify-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs sm:text-sm font-medium text-red-600 dark:bg-success-500/15 dark:text-success-500">
                        {safeText(data?.risk_level) || "Unknown"}
                    </span>
                </div>

                {/* Scan Date */}
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Scan Date:{" "}
                    <span className="font-medium">
                        {safeText(scanDate)}
                    </span>
                </p>
            </div>

            {/* Right Section */}
            <div className="flex gap-3">
                {/* <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">
                    Download
                </button> */}

                {/* <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">
                    History
                </button> */}

            </div>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Vulnerabilities */}
            <Card title="Vulnerabilities">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-red-500 text-lg font-bold">
                        {data?.findings?.length || 0}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge color="error">{safeText(data?.findings?.length) || 0} {safeText(data?.risk_level)}</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length)/2 || 0} High</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length)/4 || 0} Medium</Badge>
                        <Badge color="gray">{safeText(data?.findings?.length)/6 || 0} Low</Badge>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    ⚠ Vulnerabilities Not Fixed : <b>{safeText(data?.findings?.length) || 0} / {data?.findings?.length || 0}</b>
                </div>
            </Card>

            {/* Scan Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">

                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Scan Details
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Scan Method
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            Manual
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Asset Name
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.scan_context)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Asset Type
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.asset_type) || "Web Site"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Created at
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(scanDate)}
                        </span>
                    </li>


                </ul>
            </div>

            {/*  Domain Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Domain Information
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                    {/* Registrar */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Registrar
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.whois?.registrar)}
                        </span>
                    </li>

                    {/* Expiry */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Expiry
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.whois?.expiry)}
                        </span>
                    </li>

                    {/* Server */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Server
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.website_security?.technologies?.[0])}
                        </span>
                    </li>

                    {/* SSL */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            SSL Certificate
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.ssl_certificate?.valid
                                ? `${data.website_security.ssl_certificate.days_remaining} Days Valid`
                                : "Not Found"}
                        </span>
                    </li>

                    {/* A Record */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            A Record
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.A)}
                        </span>
                    </li>

                    {/* MX Records */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            MX Records
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {
                                data?.network_info?.dns_records?.MX?.length > 0 &&
                                    Array.isArray(data?.network_info?.dns_records?.MX)
                                    ? data?.network_info?.dns_records.MX.map((mx: any) => `${mx.exchange} (Priority ${mx.priority})`).join(",\n") : "N/A"}
                        </span>
                    </li>

                    {/* TXT Records */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            TXT Records
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400 break-all whitespace-pre-line">
                            {safeJoin(data?.network_info?.dns_records?.TXT)}
                        </span>
                    </li>
                    {/* Name Servers */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Name Server
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.NS)}
                        </span>
                    </li>

                    {/* DNSSEC */}
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            DNSSEC
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.network_info?.dns_records?.dnssec)}
                        </span>
                    </li>

                </ul>
            </div>

            {/*  Performance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Performance
                </h2>
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Load Time
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.load_time_ms)} ms
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Page Size
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.page_size_kb) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Status
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.status) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Inline script count
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.script_analysis?.inline_script_count) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            External Script Count
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.script_analysis?.external_script_count) || "-"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            External Script Count
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.performance?.script_analysis?.large_files_count) || "0"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Sitemap
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.seo_check?.sitemap_xml) || "0"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Robot TXT File
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeText(data?.seo_check?.robots_txt) || "0"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Website BlackList
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.summary?.blacklisted ? "Blacklisted Webiste" : "Not Blacklist"}
                        </span>
                    </li>

                </ul>
            </div>

            {/*  Website Security Headers */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">

                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Website Security Headers
                </h2>

                {/* <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(
                        data?.website_security?.security_headers ?? {}
                    ).map(([key, value]: any) => (
                        <li key={key} className="flex items-start gap-5 py-2.5">

                            <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400 overflow-hidden ">
                                {key?.replaceAll("-", " ")}
                            </span>

                            <div className="flex gap-2 w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
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

            </div>

            {/*  Network Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Network Information
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800 mb-4 border-b pb-4">
                    {/* <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            DNS Records
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.network_info?.dns_records?.A[0] || "N/A"}
                        </span>
                    </li> */}

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Host
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400 break-all">
                            {safeText(data?.network_info?.host) || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            IP Address
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {safeJoin(data?.network_info?.dns_records?.A)}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">

                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Open Ports
                        </span>

                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
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
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Technologies
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.technologies[1] || "N/A"}
                        </span>
                    </li> */}

                </ul>

                <div className="pt-4">
                    {data?.network_info?.findings?.length > 0 && <DynamicTable columns={column4} data={data?.network_info?.findings?.length > 0 ? data?.network_info?.findings : []} className={"min-w-[600px] "} />}
                </div>
            </div>

        </div>

        {data?.route_scans?.length > 0 && <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} className={"min-w-[500px]"} />}

        {data?.findings?.length > 0 && <DynamicTable columns={columns2} data={data?.findings?.length > 0 ? data?.findings : []} className={"min-w-[600px]"} />}

    </>);
}
