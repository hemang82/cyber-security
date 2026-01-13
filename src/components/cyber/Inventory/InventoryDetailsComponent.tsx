"use client";

import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
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

const severityColor = (severity: string) => {
    switch (severity) {
        case "Warning":
            return "bg-yellow-100 text-yellow-700";
        case "Medium":
            return "bg-orange-100 text-orange-700";
        case "Info":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

/* ---------- Page ---------- */
export default function InventoryDetailsComponent() {
    const [data, setData] = useState<any>(null);
    const [scanDate, setScanDate] = useState<string>("");

    useEffect(() => {
        fetch("/api/inventoryDetails").then((res) => res.json()).then((res) => setData(res.data));
    }, []);

    useEffect(() => {
        if (data?.scanned_at) {
            setScanDate(formatDate(data.scanned_at, DATE_FORMAT.FULL_DAY_MONTH_YEAR));
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

    return (<>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">

            {/* Left Section */}
            <div className="flex flex-col gap-2.5 divide-gray-300 sm:flex-row sm:divide-x dark:divide-gray-700">
                <div className="flex items-center gap-2 sm:pr-3">
                    <span className="text-base font-medium text-gray-700 dark:text-gray-400">
                        Website : {data?.target}
                    </span>

                    <span className="inline-flex items-center justify-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-medium text-red-600 dark:bg-success-500/15 dark:text-success-500">
                        {data?.risk_level}
                    </span>
                </div>

                <p className="text-sm text-gray-500 sm:pl-3 dark:text-gray-400">
                    Scan Date : <span className="font-medium">{scanDate}</span>
                </p>
            </div>

            {/* Right Section */}
            <div className="flex gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">
                    Download
                </button>

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
                        <Badge color="error">{data?.findings?.length || 0} Critical</Badge>
                        <Badge color="gray">0 High</Badge>
                        <Badge color="gray">0 Medium</Badge>
                        <Badge color="gray">0 Low</Badge>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    ⚠ Vulnerabilities Not Fixed : <b>{data?.findings?.length || 0} / {data?.findings?.length || 0}</b>
                </div>
            </Card>


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
                            {data?.scan_context}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Asset Type
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.asset_type || "Web Site"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Created at
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {scanDate}
                        </span>
                    </li>

                </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">

                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Website Security Headers
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(
                        data?.website_security?.security_headers ?? {}
                    ).map(([key, value]: any) => (
                        <li key={key} className="flex items-start gap-5 py-2.5">

                            <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400 overflow-hidden ">
                                {key.replaceAll("-", " ")}
                            </span>

                            <div className="flex gap-2 w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                    {value?.status || "N/A"}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(value?.severity || "Info")}`} >
                                    {value?.severity || "Info"}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                    Network Information
                </h2>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            DNS Records
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.network_info?.dns_records?.A[0] || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Host
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.network_info?.host || "N/A"}
                        </span>
                    </li>

                    {data?.network_info?.open_ports?.map((portItem: any, i: number) => (
                        <li key={i} className="flex items-start gap-5 py-2.5">
                            <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                                Port : {i + 1}
                            </span>
                            <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                                {portItem?.port ?? "N/A"} ({portItem?.status ?? "Unknown"})
                            </span>
                        </li>
                    ))}

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Registrar
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.network_info?.whois?.registrar || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Expiry
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.network_info?.whois?.expiry} {/* {formatDate(data?.network_info?.whois?.expiry, DATE_FORMAT.FULL_DAY_MONTH_YEAR) || "N/A"} */}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Server
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.technologies[0] || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            Technologies
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.technologies[1] || "N/A"}
                        </span>
                    </li>

                    <li className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400">
                            SSL Certificate
                        </span>
                        <span className="w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400">
                            {data?.website_security?.ssl_certificate?.valid ? data?.website_security?.ssl_certificate?.days_remaining + " Days Valid" : "Invalid"}
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <DynamicTable columns={columns} data={data?.route_scans?.length > 0 ? data?.route_scans : []} />
            
    </>);
}
