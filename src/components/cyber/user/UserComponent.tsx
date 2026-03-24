"use client"

import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText, TOAST_SUCCESS, TOAST_ERROR } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GoEye } from "react-icons/go";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export default function UserComponent({ userData }: { userData: any }) {
    const list = Array.isArray(userData?.users) ? userData.users : (Array.isArray(userData) ? userData : []);
    const totalCount = userData?.total_count || list.length;
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("page_size")) || 15;

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await fetch(`/api/user/delete`, {
                    method: "POST",
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                if (data.success) {
                    TOAST_SUCCESS("User deleted successfully");
                    router.refresh();
                } else {
                    TOAST_ERROR(data.message || "Failed to delete user");
                }
            } catch (err) {
                TOAST_ERROR("Something went wrong");
            }
        }
    }

    const columns = [
        {
            key: "displayId",
            title: "ID",
            className: "min-w-[70px]",
        },
        {
            key: "name",
            title: "Full Name",
            className: "min-w-[150px]",
            render: (row: User) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <span title={row?.name} className="font-medium text-gray-800 dark:text-gray-200">
                        {safeText(row?.name)}
                    </span>
                </div>
            ),
        },
        {
            key: "email",
            title: "Email Address",
            className: "min-w-[200px]",
            render: (row: User) => (
                <span className="text-gray-600 dark:text-gray-400 font-normal">
                    {safeText(row?.email)}
                </span>
            ),
        },
        {
            key: "role",
            title: "Role",
            className: "min-w-[120px]",
            render: (row: User) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                    {safeText(row?.role || "User")}
                </span>
            ),
        },
        {
            key: "status",
            title: "Status",
            className: "min-w-[120px]",
            render: (row: User) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                    {safeText(row?.status || "active")}
                </span>
            ),
        },
        {
            key: "created_at",
            title: "Date Joined",
            className: "min-w-[150px]",
            render: (row: User) => (
                <span className="text-gray-500 dark:text-gray-400">
                    {formatDate(row?.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY) || "-"}
                </span>
            ),
        },
        {
            key: "action",
            title: "Actions",
            className: "min-w-[150px] text-right",
            render: (row: User) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/user-details?id=${row.id}`}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        title="View Details"
                    >
                        <GoEye size={18} />
                    </Link>
                    <Link
                        href={`/add-user?id=${row.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit User"
                    >
                        <FiEdit size={16} />
                    </Link>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete User"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const startIndex = (page - 1) * perPage;

    const handlePageChange = (newPage: number, newPerPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        params.set("page_size", newPerPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    }

    const currentData = list?.map((item: any, index: number) => ({
        ...item,
        displayId: startIndex + index + 1
    })) || [];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <DynamicTable columns={columns} data={currentData} className="min-w-[1000px]" />

            <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row pb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Showing <span className="text-gray-900 dark:text-gray-100">{totalCount > 0 ? startIndex + 1 : 0}</span> to{" "}
                    <span className="text-gray-900 dark:text-gray-100">{Math.min(startIndex + perPage, totalCount)}</span> of{" "}
                    <span className="text-gray-900 dark:text-gray-100">{totalCount}</span> users
                </div>

                <Pagination
                    currentPage={page}
                    perPage={perPage}
                    totalCount={totalCount}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}
