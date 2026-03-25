"use client"

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { INPUT_PATTERN, INPUT_TYPE, USER_ROLE } from "@/common/commonVariable";
import { TOAST_SUCCESS, TOAST_ERROR } from "@/common/commonFunction";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { BoltIcon, InfoIcon, UserIcon } from "@/icons";
import { ASSETS_INPUTS } from "../Inventory/Assets/AddAssets";
import { CODES } from "@/common/constant";

export default function AddUser() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const [loading, setLoading] = useState(false);

    // ✅ Track custom limit status for each asset type
    const [isCustom, setIsCustom] = useState<Record<string, boolean>>({
        website_limit: false,
        app_limit: false,
        cloud_limit: false
    });

    const methods = useForm({
        mode: "onBlur"
    });

    useEffect(() => {
        if (userId) {
            // Fetch user details for edit mode
            const fetchUserDetails = async () => {
                try {
                    const res = await fetch(`/api/user/details?id=${userId}`);
                    const result = await res.json();
                    if (result.code === CODES?.SUCCESS) {
                        methods.reset(result.data);
                        // ✅ Auto-enable customize toggle if limits > 5
                        const limits = {
                            website_limit: Number(result.data[ASSETS_INPUTS.WEBSITE_LIMIT.name]) > 5,
                            app_limit: Number(result.data[ASSETS_INPUTS.APP_LIMIT.name]) > 5,
                            cloud_limit: Number(result.data[ASSETS_INPUTS.CLOUD_LIMIT.name]) > 5,
                        };
                        setIsCustom(limits);
                    } else {
                        TOAST_ERROR(result.message || "Failed to fetch user details");
                    }

                } catch (err) {
                    TOAST_ERROR("Failed to fetch user details");
                }
            };
            fetchUserDetails();
        }
    }, [userId, methods]);

    const onSubmit = async (data: any) => {
        console.log("USER FORM DATA 👉", data);
        setLoading(true);
        try {
            const endpoint = userId ? "/api/user/update" : "/api/user/add";
            const res = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ ...data, id: userId }),
            });
            const result = await res.json();

            if (result.code === CODES?.SUCCESS) {
                TOAST_SUCCESS(userId ? "User updated successfully" : "User added successfully");
                router.push("/user");
                router.refresh();
            } else {
                TOAST_ERROR(result.message || "Something went wrong");
            }
        } catch (err) {
            TOAST_ERROR("Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-500 rounded-lg text-white shadow-lg shadow-brand-500/20">
                                <UserIcon className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {userId ? "Edit User Profile" : "Register New User"}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {userId ? "Update account information and permissions." : "Fill in the details to create a new system user."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="m-4 p-8 space-y-10">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <InfoIcon className="size-4 text-brand-600" />
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Basic Information</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        name={ASSETS_INPUTS.NAME.name}
                                        placeholder={ASSETS_INPUTS.NAME.placeholder}
                                        rules={{
                                            required: ASSETS_INPUTS.NAME.validation,
                                            pattern: ASSETS_INPUTS.NAME.pattern
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        name={ASSETS_INPUTS.EMAIL.name}
                                        placeholder={ASSETS_INPUTS.EMAIL.placeholder}
                                        rules={{
                                            required: ASSETS_INPUTS.EMAIL.validation,
                                            pattern: ASSETS_INPUTS.EMAIL.pattern
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        name={ASSETS_INPUTS.PASSWORD.name}
                                        type={INPUT_TYPE.PASSWORD}
                                        placeholder={ASSETS_INPUTS.PASSWORD.placeholder}
                                        rules={{
                                            required: !userId ? ASSETS_INPUTS.PASSWORD.validation : false,
                                            pattern: ASSETS_INPUTS.PASSWORD.pattern
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Phone Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        name={ASSETS_INPUTS.PHONE_NUMBER.name}
                                        placeholder={ASSETS_INPUTS.PHONE_NUMBER.placeholder}
                                        rules={{
                                            required: ASSETS_INPUTS.PHONE_NUMBER.validation,
                                            pattern: ASSETS_INPUTS.PHONE_NUMBER.pattern
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Company Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        name={ASSETS_INPUTS.COMPANY_NAME.name}
                                        placeholder={ASSETS_INPUTS.COMPANY_NAME.placeholder}
                                        rules={{
                                            required: ASSETS_INPUTS.COMPANY_NAME.validation
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Access & Status */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <BoltIcon className="size-4 text-brand-600" />
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Permissions & Status</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">User Role <span className="text-red-500">*</span></Label>
                                    <Select
                                        name={ASSETS_INPUTS.ROLE.name}
                                        rules={{ required: ASSETS_INPUTS.ROLE.validation }}
                                        options={[
                                            { value: USER_ROLE.ADMIN, label: "Admin" },
                                            { value: USER_ROLE.USER, label: "User" }
                                        ]}
                                        onChange={(e) => console.log(e)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Account Status</Label>
                                    <Select
                                        name={ASSETS_INPUTS.STATUS.name}
                                        defaultValue="active"
                                        options={[
                                            { value: "active", label: "Active" },
                                            { value: "inactive", label: "Inactive" }
                                        ]}
                                        onChange={(e) => console.log(e)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Asset Permissions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <div className="p-1 text-brand-600">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Asset Permissions</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { input: ASSETS_INPUTS.WEBSITE_LIMIT, label: 'Website Limit' },
                                    { input: ASSETS_INPUTS.APP_LIMIT, label: 'Application Limit' },
                                    { input: ASSETS_INPUTS.CLOUD_LIMIT, label: 'Cloud Limit' }
                                ].map(({ input, label }) => (
                                    <div key={input.name} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">{label} <span className="text-red-500">*</span></Label>
                                            <Switch
                                                label="Customize"
                                                defaultChecked={isCustom[input.name]}
                                                onChange={(checked) => {
                                                    setIsCustom(prev => ({ ...prev, [input.name]: checked }));
                                                    methods.setValue(input.name, "0"); // Reset when switching
                                                }}
                                            />
                                        </div>

                                        {isCustom[input.name] ? (
                                            <Input
                                                name={input.name}
                                                type={INPUT_TYPE.TEXT}
                                                placeholder={input.placeholder}
                                                rules={{
                                                    required: input.validation,
                                                    pattern: input.pattern,
                                                    maxLength: { value: 3, message: "Maximum 3 digits" }
                                                }}
                                            />
                                        ) : (
                                            <Select
                                                name={input.name}
                                                defaultValue="0"
                                                rules={{ required: input.validation }}
                                                options={[
                                                    { value: "0", label: "0" },
                                                    { value: "1", label: "1" },
                                                    { value: "2", label: "2" },
                                                    { value: "3", label: "3" },
                                                    { value: "4", label: "4" },
                                                    { value: "5", label: "5" },
                                                    { value: "unlimited", label: "No Limit" },
                                                ]}
                                                onChange={(e) => console.log(e)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Submit Section */}
                    <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-white dark:hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? "Processing..." : (userId ? "Update User" : "Create User")}
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
