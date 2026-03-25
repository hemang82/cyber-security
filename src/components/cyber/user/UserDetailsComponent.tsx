"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate, safeText, TOAST_ERROR } from "@/common/commonFunction";
import { DATE_FORMAT, USER_ROLE } from "@/common/commonVariable";
import { FiArrowLeft, FiMail, FiPhone, FiHome, FiCalendar, FiShield, FiBriefcase } from "react-icons/fi";
import { RiShieldLine } from "react-icons/ri";
import { CODES } from "@/common/constant";
import UserDetailsSkeleton from "./UserDetailsSkeleton";

interface UserDetails {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    company_name: string;
    role: string;
    status: string;
    created_at: string;
    website_limit: string | number;
    app_limit: string | number;
    cloud_limit: string | number;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserDetailsComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            router.push("/user");
            return;
        }

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/details?id=${userId}`);
                const result = await res.json();

                if (result.code === CODES?.SUCCESS) {
                    setUser(result.data);
                } else {
                    TOAST_ERROR(result.message || "Failed to fetch user details");
                }
            } catch (err) {
                TOAST_ERROR("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [userId, router]);

    if (loading) return <UserDetailsSkeleton />;

    const displayUser = user || {
        id: userId || "",
        name: "User",
        email: "-",
        phone_number: "-",
        company_name: "-",
        role: "User",
        status: "inactive",
        created_at: "",
        website_limit: 0,
        app_limit: 0,
        cloud_limit: 0
    };

    return (
        <div className=" mx-auto space-y-8 pb-10">
            {/* Action Bar */}
            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold text-sm"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    User Directory
                </button>
                <button
                    onClick={() => router.push(`/add-user?id=${displayUser.id}`)}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm"
                >
                    Edit User Profile
                </button>
            </div> */}

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Header Row */}
                <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div className="h-28 w-28 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-gray-50 dark:border-gray-900">
                                <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                                    {(displayUser.name || "U").charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Name & Badges */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${displayUser.role === USER_ROLE.ADMIN ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                        {safeText(displayUser.role)}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${displayUser.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                        {safeText(displayUser.status)}
                                    </span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                    {safeText(displayUser.name)}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mt-2">
                                    <FiBriefcase className="shrink-0" />
                                    {safeText(displayUser.company_name)}
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-10 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 pt-8 lg:pt-0 lg:pl-10">
                            {[
                                { label: 'Websites', val: displayUser.website_limit },
                                { label: 'Mobile Apps', val: displayUser.app_limit },
                                { label: 'Cloud Units', val: displayUser.cloud_limit },
                            ].map((stat) => (
                                <div key={stat.label} className="space-y-1">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.val === 'unlimited' ? '∞' : safeText(stat.val)}
                                    </div>
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 lg:grid-cols-2">
                    {/* Account Info */}
                    <div className="p-8 lg:p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <FiShield className="text-gray-400" size={18} />
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-[0.1em]">Verified Account Information</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            {[
                                { label: 'Email Address', val: displayUser.email, icon: <FiMail /> },
                                { label: 'Contact Number', val: displayUser.phone_number, icon: <FiPhone /> },
                                { label: 'Organization', val: displayUser.company_name, icon: <FiHome /> },
                                { label: 'Registration Date', val: displayUser.created_at ? formatDate(displayUser.created_at, DATE_FORMAT.DASH_DD_MM_YYYY) : "-", icon: <FiCalendar /> }
                            ].map((field) => (
                                <div key={field.label} className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                        {field.icon}
                                        {field.label}
                                    </label>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{safeText(field.val)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quota Block */}
                    <div className="p-8 lg:p-12 space-y-8 bg-gray-50/30 dark:bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <RiShieldLine className="text-gray-400" size={18} />
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-[0.1em]">Security Asset Quotas</h4>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Website Management', val: displayUser.website_limit, color: 'bg-indigo-600 dark:bg-indigo-500' },
                                { label: 'Mobile App Scanning', val: displayUser.app_limit, color: 'bg-emerald-600 dark:bg-emerald-500' },
                                { label: 'Cloud Infrastructure Integrity', val: displayUser.cloud_limit, color: 'bg-gray-600 dark:bg-gray-400' }
                            ].map((item) => {
                                const percentage = item.val === 'unlimited' ? 100 : Math.min(100, (Number(item.val || 0) / 100) * 100);
                                return (
                                    <div key={item.label} className="space-y-3">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">{item.label}</span>
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                {item.val === 'unlimited' ? 'No Limit' : `${safeText(item.val)} / 100 Units`}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.color} transition-all duration-700 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
