"use client"

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { TOAST_SUCCESS, TOAST_ERROR } from "@/common/commonFunction";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/form/Select";
import { BoltIcon, InfoIcon, UserIcon } from "@/icons";

export default function AddUser() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const [loading, setLoading] = useState(false);

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
                    if (result.success) {
                        methods.reset(result.data);
                    }
                } catch (err) {
                    TOAST_ERROR("Failed to fetch user details");
                }
            };
            fetchUserDetails();
        }
    }, [userId, methods]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const endpoint = userId ? "/api/user/update" : "/api/user/add";
            const res = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ ...data, id: userId }),
            });
            const result = await res.json();

            if (result.success) {
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

                    <div className="p-8 space-y-10">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <InfoIcon className="size-4 text-brand-600" />
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Basic Information</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        name="name"
                                        placeholder="e.g. John Doe"
                                        rules={{
                                            required: "Name is required",
                                            pattern: { value: INPUT_PATTERN.NAME.pattern, message: INPUT_PATTERN.NAME.message }
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Email Address <span className="text-red-500">*</span></Label>
                                    <Input
                                        name="email"
                                        placeholder="john@example.com"
                                        rules={{
                                            required: "Email is required",
                                            pattern: { value: INPUT_PATTERN.EMAIL.pattern, message: INPUT_PATTERN.EMAIL.message }
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Phone Number</Label>
                                    <Input
                                        name="phone_number"
                                        placeholder="1234567890"
                                        rules={{
                                            pattern: { value: INPUT_PATTERN.MOBILE.pattern, message: INPUT_PATTERN.MOBILE.message }
                                        }}
                                    />
                                </div>
                                {!userId && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Password <span className="text-red-500">*</span></Label>
                                        <Input
                                            name="password"
                                            type={INPUT_TYPE.PASSWORD}
                                            placeholder="••••••••"
                                            rules={{
                                                required: "Password is required",
                                                pattern: { value: INPUT_PATTERN.PASSWORD.pattern, message: INPUT_PATTERN.PASSWORD.message }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Access & Status */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <BoltIcon className="size-4 text-brand-600" />
                                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Permissions & Status</h4>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">User Role <span className="text-red-500">*</span></Label>
                                    <Select
                                        name="role"
                                        rules={{ required: "Role is required" }}
                                        options={[
                                            { value: "admin", label: "Administrator" },
                                            { value: "user", label: "Standard User" }
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">Account Status</Label>
                                    <Select
                                        name="status"
                                        defaultValue="active"
                                        options={[
                                            { value: "active", label: "Active" },
                                            { value: "inactive", label: "Inactive" }
                                        ]}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Footer / Submit Section */}
                    <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
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
