"use client"

import { formatDate, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { CODES } from "@/common/constant";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
//   description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };

export default function DominComponent({ resDomainList }: any) {
    // State for domains list, initialized from props
    const [domains, setDomains] = useState(resDomainList);

    // Router hook (currently unused but kept if needed for navigation)
    const router = useRouter();

    // State to track which domain is currently refreshing to show spinner
    const [refreshingId, setRefreshingId] = useState<number | null>(null);

    // Status badge styling map
    const statusClasses: any = {
        pending: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    // Pagination state
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    // --- Pagination Logic ---
    // Calculate start index for the current page
    const startIndex = (page - 1) * perPage;

    // Sequential ID = (Page Index * Items Per Page) + Current Index + 1
    const currentData = domains?.slice(startIndex, startIndex + perPage).map((item: any, index: number) => ({
        ...item,
        displayId: startIndex + index + 1
    })) || [];


    // --- Table Columns Definition ---
    const columns = [
        {
            key: "displayId",
            title: "Id",
            className: "min-w-[70px]",
        },
        {
            key: "domain",
            title: "Domain",
            className: "min-w-[200px]",
            render: (row: any) => (
                // Truncate domain if too long
                <span title={row?.domain} className="block w-full max-w-[200px] truncate">
                    {row?.domain || "-"}
                </span>
            ),
        },
        {
            key: "txt_value",
            title: "TXT record",
            className: "min-w-[300px]",
            render: (row: any) => (
                // Truncate TXT record if too long
                <span title={row?.txt_value} className="block w-full max-w-[300px] truncate">
                    {row?.txt_value || "-"}
                </span>
            ),
        },
        {
            key: "status",
            title: "Status",
            className: "min-w-[150px]",
            render: (row: any) => {
                const isVerified = row.status?.toLowerCase() == "verified";
                const isRefreshing = refreshingId === row.id;

                return (
                    <div className="flex items-center gap-3">
                        {/* Status badge with conditional styling */}
                        <span
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium capitalize
            ${statusClasses[row.status?.toLowerCase()] || "bg-gray-100 text-gray-700"}
          `}
                        >
                            {row.status}
                        </span>

                        {/* Refresh button: Disabled if verified or currently refreshing */}
                        <button
                            type="button"
                            disabled={isVerified || isRefreshing}
                            title={
                                isVerified
                                    ? "Status verified"
                                    : "Refresh status"
                            }
                            onClick={() => handleRefresh(row)}
                            className={`
            p-1 rounded-full transition
            ${isVerified
                                    ? "cursor-not-allowed text-gray-300"
                                    : "cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50"}
          `}
                        >
                            <IoMdRefresh
                                size={18}
                                className={isRefreshing ? "animate-spin" : ""}
                            />
                        </button>
                    </div>
                );
            },
        },
        {
            key: "created_at", title: "Created",
            className: "min-w-[150px]",
            render: (row: any) => (
                <span>{formatDate(row.created_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
            ),
        },
    ];

    // --- Refresh Status Handler ---
    // Calls API to refresh domain status and updates local state
    const handleRefresh = async (row: any) => {
        try {

            // Prevent multiple clicks
            if (refreshingId === row.id) return;

            setRefreshingId(row.id);

            const response = await fetch("/api/domain/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ domain: row?.domain, token: row?.token }),
            });

            const res: any = await response.json();

            if (res?.code == CODES?.SUCCESS) {
                // Update the specific domain's status in the local state
                setDomains((prev: any[]) =>
                    prev.map(item =>
                        item.id === row.id
                            ? { ...item, status: res?.data?.status }
                            : item
                    )
                );
                TOAST_SUCCESS("Status refresh successfully");
            } else {
                TOAST_ERROR("Something went wrong")
            }
        } catch (error: any) {
            TOAST_ERROR(error.message || "Something went wrong");
        } finally {
            // Reset refreshing state
            setRefreshingId(null);
        }
    };

    // Sync state if props change
    useEffect(() => {
        setDomains(resDomainList);
    }, [resDomainList]);

    return (
        <>
            <DynamicTable columns={columns} data={currentData} className="min-w-[1000px]" />

            {/* Pagination Info & Controls */}
            <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {domains?.length > 0 ? startIndex + 1 : 0} to{" "}
                    {Math.min(startIndex + perPage, domains?.length || 0)} of {domains?.length || 0} entries
                </div>

                <Pagination
                    currentPage={page}
                    perPage={perPage}
                    totalCount={domains?.length || 0}
                    onChange={(newPage, newPerPage) => {
                        setPage(newPage);
                        setPerPage(newPerPage);
                    }}
                />
            </div>
        </>
    );
}
