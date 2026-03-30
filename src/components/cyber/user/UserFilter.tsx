"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiSearch, FiFilter } from "react-icons/fi";
import { USER_ROLE } from "@/common/commonVariable";

export default function UserFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [role, setRole] = useState(searchParams.get("role") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");

    const updateFilters = (newFilters: Record<string, string>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        params.set("page", "1"); // Reset to first page
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchTerm });
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="w-full lg:flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <FiSearch size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm outline-none shadow-sm"
                />
            </form>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        updateFilters({ role: e.target.value });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all select-none min-w-[130px] shadow-sm"
                >
                    <option value="">All Roles</option>
                    <option value={USER_ROLE.ADMIN}>Admin</option>
                    <option value={USER_ROLE.USER}>User</option>
                </select> */}

                {/* <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        updateFilters({ status: e.target.value });
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all select-none min-w-[130px] shadow-sm"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select> */}

                {/* <button
                    onClick={() => {
                        setSearchTerm("");
                        setRole("");
                        setStatus("");
                        router.push(pathname);
                    }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 font-bold transition-colors"
                >
                    Reset
                </button> */}
            </div>
        </div>
    );
}
