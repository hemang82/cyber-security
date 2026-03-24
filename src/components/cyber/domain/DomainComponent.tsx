"use client"

import { formatDate, safeText, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { CODES } from "@/common/constant";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { IoCopyOutline, IoCheckmarkSharp } from "react-icons/io5";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import AddDomain from "./AddDomain";

export default function DomainComponent({ resDomainList }: any) {
    const list = Array.isArray(resDomainList?.domains) ? resDomainList.domains : (Array.isArray(resDomainList?.data) ? resDomainList.data : (Array.isArray(resDomainList) ? resDomainList : []));
    const totalCount = resDomainList?.total_count || list.length;

    const [domains, setDomains] = useState<any[]>(list);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { isOpen, openModal, closeModal } = useModal();
    const [refreshingId, setRefreshingId] = useState<number | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        TOAST_SUCCESS("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const statusClasses: any = {
        pending: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("page_size")) || 15;

    const startIndex = (page - 1) * perPage;

    // Use server-side data directly
    const currentData = domains?.map((item: any, index: number) => ({
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
                <div className="flex flex-col">
                    <span title={row?.domain} className="text-sm font-medium text-gray-900 dark:text-white max-w-[300px] truncate">
                        {safeText(row?.domain)}
                    </span>
                    {/* <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Token: {row?.token?.substring(0, 8)}...
                    </span> */}
                </div>
            ),
        },
        {
            key: "txt_value",
            title: "TXT record",
            className: "min-w-[400px]",
            render: (row: any) => (
                <div className="flex items-center gap-2 group">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono max-w-[320px] truncate" title={row?.txt_value}>
                        {safeText(row?.txt_value)}
                    </code>
                    {row?.txt_value && (
                        <button
                            onClick={() => handleCopy(row.txt_value, row.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-brand-500 transition-colors"
                            title="Copy TXT record"
                        >
                            {copiedId === row.id ? (
                                <IoCheckmarkSharp size={16} className="text-green-500" />
                            ) : (
                                <IoCopyOutline size={16} />
                            )}
                        </button>
                    )}
                </div>
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
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium capitalize
            ${statusClasses[row.status?.toLowerCase()] || "bg-gray-100 text-gray-700"}
          `}
                        >
                            {safeText(row.status)}
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
            key: "created_at", title: "Created At",
            className: "min-w-[150px]",
            render: (row: any) => (
                <span>{formatDate(row.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY)}</span>
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

            // if (res?.code == CODES?.SUCCESS) {
            // Update the specific domain's status in the local state
            setDomains((prev: any[]) =>
                prev.map(item =>
                    item.id === row.id
                        ? { ...item, status: res?.data?.status }
                        : item
                )
            );
            TOAST_SUCCESS("Status refresh successfully");
            // } else {
            //     TOAST_ERROR("Something went wrong")
            // }
        } catch (error: any) {
            TOAST_ERROR(error.message || "Something went wrong");
        } finally {
            // Reset refreshing state
            setRefreshingId(null);
        }
    };

    // Sync state if props change
    useEffect(() => {
        const newList = Array.isArray(resDomainList?.data) ? resDomainList.data : (Array.isArray(resDomainList) ? resDomainList : []);
        setDomains(newList);
    }, [resDomainList]);

    return (
        <>
            <ComponentCard
                title="All Domains"
                desc="Note: TXT records may take some time to appear. Please click the refresh button after a few minutes."
                buttonName={"Add Domain"}
                onClick={openModal}
            >

                <DynamicTable columns={columns} data={currentData} className="min-w-[1000px]" />

                <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {totalCount > 0 ? startIndex + 1 : 0} to{" "}
                        {Math.min(startIndex + perPage, totalCount)} of {totalCount} entries
                    </div>

                    <Pagination
                        currentPage={page}
                        perPage={perPage}
                        totalCount={totalCount}
                        onChange={(newPage, newPerPage) => {
                            const params = new URLSearchParams(searchParams);
                            params.set("page", newPage.toString());
                            params.set("page_size", newPerPage.toString());
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                    />
                </div>
            </ComponentCard>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
                <div className="relative w-full  overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-10">
                    <div className="mb-6">
                        <h4 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
                            🌐 Add New Domain
                        </h4>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                            Enter the domain URL you want to verify and manage.
                        </p>
                    </div>
                    <AddDomain onSuccess={() => {
                        closeModal();
                        // Optional: refresh data?
                    }} />
                </div>
            </Modal>
        </>
    );
}
