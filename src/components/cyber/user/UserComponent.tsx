"use client"

import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText, TOAST_SUCCESS, TOAST_ERROR } from "@/common/commonFunction";
import { DATE_FORMAT, USER_ROLE, INPUT_TYPE } from "@/common/commonVariable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GoEye } from "react-icons/go";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiShieldLine } from "react-icons/ri";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import Switch from "@/components/form/switch/Switch";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { FormProvider, useForm } from "react-hook-form";
import { MdSecurity } from "react-icons/md";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    website_limit: string | number;
    app_limit: string | number;
    cloud_limit: string | number;
}

export default function UserComponent({ userData }: { userData: any }) {
    const list = Array.isArray(userData?.assets) ? userData.assets : (Array.isArray(userData) ? userData : []);
    const totalCount = userData?.total_count || list.length;

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loadingPerm, setLoadingPerm] = useState(false);
    const [isCustom, setIsCustom] = useState<Record<string, boolean>>({
        website_limit: false,
        app_limit: false,
        cloud_limit: false
    });

    const methods = useForm({ mode: "onBlur" });

    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("page_size")) || 15;

    const handleOpenPermissions = (user: User) => {
        setSelectedUser(user);
        methods.reset(user);
        // ✅ Pre-detect if current limits are > 5 to toggle custom mode
        setIsCustom({
            website_limit: Number(user.website_limit) > 5,
            app_limit: Number(user.app_limit) > 5,
            cloud_limit: Number(user.cloud_limit) > 5,
        });
        setIsPermissionModalOpen(true);
    };

    const handleSavePermissions = async (data: any) => {
        setLoadingPerm(true);
        try {
            const res = await fetch(`/api/user/update`, {
                method: "POST",
                body: JSON.stringify({ ...data, id: selectedUser?.id }),
            });
            const result = await res.json();
            if (result.success) {
                TOAST_SUCCESS("Permissions updated successfully");
                setIsPermissionModalOpen(false);
                router.refresh();
            } else {
                TOAST_ERROR(result.message || "Failed to update permissions");
            }
        } catch (err) {
            TOAST_ERROR("Something went wrong");
        } finally {
            setLoadingPerm(false);
        }
    };

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
            className: "min-w-[20px]",
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
            className: "min-w-[150px]",
            render: (row: User) => (
                <span className="text-gray-600 dark:text-gray-400 font-normal">
                    {safeText(row?.email || "demo@gmail.com")}
                </span>
            ),
        },
        {
            key: "role",
            title: "Role",
            className: "min-w-[100px]",
            render: (row: User) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.role === USER_ROLE.ADMIN
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
            className: "min-w-[100px]",
            render: (row: User) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${row.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 '
                    }`}>
                    {safeText(row?.status || "active")}
                </span>
            ),
        },
        {
            key: "created_at",
            title: "Date Joined",
            className: "min-w-[120px]",
            render: (row: User) => (
                <span className="text-gray-500 dark:text-gray-400">
                    {formatDate(row?.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY) || "-"}
                </span>
            ),
        },
        // {
        //     key: "permition",
        //     title: "Permition",
        //     className: "min-w-[120px] text-left",
        //     render: (row: User) => (
        //         <div className="flex items-center justify-start gap-1">
        //             <button
        //                 onClick={() => handleOpenPermissions(row)}
        //                 className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        //                 title="Asset Permissions"
        //             >
        //                 <RiShieldLine size={18} />
        //             </button>
        //         </div>
        //     ),
        // },
        {
            key: "action",
            title: "Actions",
            className: "min-w-[120px] text-left",
            render: (row: User) => (
                <div className="flex items-center justify-start gap-1">
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
                    <button
                        onClick={() => handleOpenPermissions(row)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Asset Permissions"
                    >
                        <MdSecurity size={18} />
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
        <div className="bg-white dark:bg-transparent">
            {/* Table Container with Horizontal Scroll */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800/60 overflow-hidden shadow-sm bg-white dark:bg-gray-900/50 transition-all duration-300">
                <div className="overflow-x-auto custom-scrollbar">
                    <DynamicTable columns={columns} data={currentData} className="min-w-[1000px]" />
                </div>
            </div>

            {/* Pagination / Info Bar Responsive */}
            <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-6 px-4 pb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium order-2 lg:order-1">
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors">
                        Showing <span className="text-gray-900 dark:text-white font-bold">{totalCount > 0 ? startIndex + 1 : 0}</span> to{" "}
                        <span className="text-gray-900 dark:text-white font-bold">{Math.min(startIndex + perPage, totalCount)}</span> of{" "}
                        <span className="text-gray-900 dark:text-white font-bold px-1">{totalCount}</span> system users
                    </div>
                </div>

                <div className="order-1 lg:order-2 w-full lg:w-auto flex justify-center">
                    <Pagination
                        currentPage={page}
                        perPage={perPage}
                        totalCount={totalCount}
                        onChange={handlePageChange}
                    />
                </div>
            </div>

            {/* 🔐 Asset Permissions Modal */}
            <Modal
                isOpen={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
                className="max-w-[1000px]"
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-brand-500 rounded-lg text-white shadow-lg shadow-brand-500/20">
                            <RiShieldLine size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Asset Permissions
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage website, app, and cloud limits for <span className="text-brand-600 font-bold">{selectedUser?.name}</span>.
                            </p>
                        </div>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSavePermissions)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: "website_limit", label: "Website Limit" },
                                    { name: "app_limit", label: "Application Limit" },
                                    { name: "cloud_limit", label: "Cloud Limit" }
                                ].map((asset) => (
                                    <div key={asset.name} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">{asset.label}</Label>
                                            <Switch
                                                label="Customize"
                                                defaultChecked={isCustom[asset.name]}
                                                onChange={(checked) => {
                                                    setIsCustom(prev => ({ ...prev, [asset.name]: checked }));
                                                    methods.setValue(asset.name, "0");
                                                }}
                                            />
                                        </div>

                                        {isCustom[asset.name] ? (
                                            <Input
                                                name={asset.name}
                                                type={INPUT_TYPE.TEXT}
                                                placeholder="1-100"
                                                rules={{
                                                    required: `${asset.label} is required`,
                                                    pattern: {
                                                        value: /^(?:[1-9][0-9]?|100)$/,
                                                        message: "Range 1-100"
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Select
                                                name={asset.name}
                                                defaultValue="0"
                                                rules={{ required: `${asset.label} is required` }}
                                                options={[
                                                    { value: "0", label: "0" },
                                                    { value: "1", label: "1" },
                                                    { value: "2", label: "2" },
                                                    { value: "3", label: "3" },
                                                    { value: "4", label: "4" },
                                                    { value: "5", label: "5" },
                                                    { value: "unlimited", label: "No Limit" },
                                                ]}
                                                onChange={(val) => console.log(val)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 mt-10">
                                <button
                                    type="button"
                                    onClick={() => setIsPermissionModalOpen(false)}
                                    className="px-6 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingPerm}
                                    className="px-8 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 transition-all"
                                >
                                    {loadingPerm ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </Modal>
        </div>
    );
}
