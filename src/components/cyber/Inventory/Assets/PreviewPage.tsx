"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { useEffect, useState } from "react";
import { ALL_PROVIDER_LIST, ASSETS_INPUTS, PROVIDER_KEY } from "./AddAssets";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { safeText, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { ASSETS, ASSETS_KEYS } from "./AssetsTypes";
import { BoltIcon, InfoIcon, UserIcon } from "@/icons";
import { TAB_KEY } from "@/common/commonVariable";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { useAuthStore } from "@/store/authStore";

export default function PreviewPage({ resDomainList }: any) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { assets_type, assets_details, owners, final_validate_data, setFinalValidateData, setActiveTab } = useInventoryStore();

    const authData = useAuthStore((state) => state.authData);
    const { is_login, role, user } = authData ?? { is_login: false, role: "", user: null };

    const methods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
            const currentWebsiteUrl = (() => {
                const domainArr = Array.isArray(resDomainList) ? resDomainList : (Array.isArray(resDomainList?.data) ? resDomainList.data : []);
                return domainArr.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain || "N/A";
            })();

            setFinalValidateData({
                value: new Date(),
                is_valid: true,
            });

            let body: any;
            let headers: any = {};

            if (assets_type?.value == ASSETS_KEYS.app) {
                const formData = new FormData();
                formData.append("assets_type", JSON.stringify(assets_type));
                formData.append("owners", JSON.stringify(owners));
                formData.append("final_validate_data", JSON.stringify({ value: new Date(), is_valid: true }));
                formData.append("website_url", currentWebsiteUrl);

                const detailsValue = assets_details?.value || {};
                const appFileField = ASSETS_INPUTS.APP_FILE.name;

                // Append other details as JSON string
                const otherDetails = { ...detailsValue };
                delete otherDetails[appFileField];
                formData.append("assets_details", JSON.stringify({ ...assets_details, value: otherDetails }));

                body = formData;
            } else {
                headers["Content-Type"] = "application/json";
                body = JSON.stringify({
                    assets_type,
                    assets_details,
                    owners,
                    website_url: currentWebsiteUrl,
                    final_validate_data: { value: new Date(), is_valid: true },
                });
            }

            const inventoryData = await fetch("/api/inventory/add", { method: "POST", headers, body });
            const res = await inventoryData.json();

            if (res.code == CODES?.SUCCESS) {
                // Background file upload for apps
                if (assets_type?.value === ASSETS_KEYS.app) {
                    const detailsValue = assets_details?.value || {};
                    const appFileField = ASSETS_INPUTS.APP_FILE.name;
                    const appFile = detailsValue[appFileField];

                    if (appFile && res?.data?.id) {
                        const uploadFormData = new FormData();
                        uploadFormData.append("id", res?.data?.id);
                        if (appFile instanceof FileList && appFile.length > 0) {
                            uploadFormData.append("app_file", appFile[0]);
                        } else if (appFile instanceof File) {
                            uploadFormData.append("app_file", appFile);
                        }

                        try {
                            const uploadUrl = `/api/inventory/upload`; // Handled by our internal Next.js API

                            console.log("🚀 Uploading to internal API:", uploadUrl, "ID:", res?.data?.id);

                            const uploadRes = await fetch(uploadUrl, {
                                method: "POST",
                                body: uploadFormData
                                // No manual token here, it's handled by Next.js route from cookies!
                            });

                            const uploadData = await uploadRes.json();

                            if (uploadRes.ok) {
                                console.log("✅ File uploaded successfully");
                            } else {
                                console.error("❌ File upload failed:", uploadData);
                            }
                        } catch (err) {
                            console.error("❌ File upload error:", err);
                        }
                    }
                }

                TOAST_SUCCESS(res?.message || "Asset added successfully");
                window.location.replace("/inventory");
            } else {
                TOAST_ERROR(res?.message || "Failed to add asset");
            }

        } catch (error) {
            console.error("Submission Error:", error);
            TOAST_ERROR("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    console.log("ASSETS DETAILS 👉", assets_details);
    const details = assets_details?.value || {};
    const owner = owners?.value || {};

    return (<>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                                <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                    <InfoIcon className="size-5" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Asset Review & Confirmation
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Part 1: Asset Details */}
                                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 h-full">

                                    <h5 className="text-[12px] uppercase tracking-widest text-blue-500 font-bold mb-6  border-b border-blue-100/50 dark:border-blue-800/20 pb-2"> Asset Details</h5>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-blue-600">
                                                <InfoIcon className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Asset Name</p>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                                    {safeText(details?.[ASSETS_INPUTS.ASSETS_NAME.name] || "N/A")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-brand-600">
                                                <BoltIcon className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Asset Type</p>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 capitalize">
                                                    {safeText(ASSETS.find((item) => item?.key === assets_type?.value)?.title || "N/A")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-indigo-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828l-4.172-4.172" /></svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                {assets_type?.value === ASSETS_KEYS?.web && (
                                                    <>
                                                        <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Website URL</p>
                                                        <p className="text-sm font-bold text-blue-600 break-all">
                                                            {(() => {
                                                                const domainArr = Array.isArray(resDomainList) ? resDomainList : (Array.isArray(resDomainList?.data) ? resDomainList.data : []);
                                                                return safeText(domainArr.find((item: any) => item.id == details?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain || "N/A");
                                                            })()}
                                                        </p>
                                                    </>
                                                )}
                                                {assets_type?.value === ASSETS_KEYS?.app && (
                                                    <>
                                                        <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Platform</p>
                                                        <p className="text-sm font-bold text-blue-600 truncate capitalize flex items-center gap-2">
                                                            {details?.platform === 'android' ? (
                                                                <svg viewBox="0 0 512 512" height="14" width="14" className="text-brand-600"><path fill="currentColor" d="M176.4 468.1h-43.2l-.2-65.7h43.4v65.7zm159.2 0h-43.2l-.2-65.7h43.4v65.7zM89.1 213.6c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zm333.8 0c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zM113.3 170.4h285.4v187.7c0 23.9-19.3 43.1-43.2 43.1H156.5c-23.9 0-43.2-19.3-43.2-43.1V170.4zm228-76.3l31.5-39.3c5.3-6.6 4.3-16.3-2.3-21.6-6.6-5.3-16.3-4.3-21.6 2.3l-34.5 43c-18.7-7.8-39.4-12.1-61.2-12.1s-42.5 4.3-61.2 12.1l-34.5-43c-5.3-6.6-15-7.6-21.6-2.3-6.6 5.3-7.6 15-2.3 21.6l31.5 39.3c-28.5 17.1-48.4 46.5-52.6 81.1h281.3c-4.1-34.5-24-64-52.5-81.1z" /></svg>
                                                            ) : (
                                                                <svg viewBox="0 0 384 512" height="14" width="14" className="text-black dark:text-gray-300"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                                                            )}
                                                            {safeText(details?.platform || "N/A")}
                                                        </p>
                                                    </>
                                                )}
                                                {assets_type?.value === ASSETS_KEYS?.cloud && (
                                                    <>
                                                        <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Cloud Provider</p>
                                                        <p className="text-sm font-bold text-blue-600 truncate capitalize">
                                                            {safeText(ALL_PROVIDER_LIST?.find((item: any) => item.value == details?.[ASSETS_INPUTS.PROVIDER.name])?.label || "N/A")}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Part 3: Contact Details */}
                                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 h-full">

                                    <h5 className="text-[12px] uppercase tracking-widest text-blue-500 font-bold mb-6  border-b border-blue-100/50 dark:border-blue-800/20 pb-2">Contact Details</h5>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold border border-indigo-100 dark:border-indigo-800">
                                                {safeText(details?.[ASSETS_INPUTS.NAME.name] || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Contact Person</p>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                                    {safeText(details?.[ASSETS_INPUTS.NAME.name])}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <p className="text-sm font-medium break-all">
                                                {safeText(details?.[ASSETS_INPUTS.EMAIL.name])}
                                            </p>
                                        </div>

                                        {details?.[ASSETS_INPUTS.PHONE_NUMBER.name] && (
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                <p className="text-sm font-medium">
                                                    {safeText(details?.[ASSETS_INPUTS.PHONE_NUMBER.name])}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Account Owner</p>
                                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-bold capitalize">
                                                <UserIcon className="size-3" />
                                                <span className="break-all">{safeText(user?.name)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Part 2: Technical/Provider Details */}
                                {assets_type?.value !== ASSETS_KEYS?.app && <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 h-full">
                                    <h5 className="text-[12px] uppercase tracking-widest text-blue-500 font-bold mb-6  border-b border-blue-100/50 dark:border-blue-800/20 pb-2">
                                        {assets_type?.value === ASSETS_KEYS?.app ? "Application File" :
                                            assets_type?.value === ASSETS_KEYS?.cloud ? "Provider Details" : "Description"}
                                    </h5>

                                    <div className="space-y-6">
                                        {assets_type?.value === ASSETS_KEYS?.cloud ? (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-800">
                                                    <p className="text-xs uppercase font-bold text-gray-400 mb-0.5">Environment Details</p>
                                                    <div className="my-4 space-y-4">
                                                        {details?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.AWS && (
                                                            <>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Region:</span> <span className="text-sm font-bold text-blue-600 break-all">{safeText(details?.[ASSETS_INPUTS.REGION.name])}</span></div>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Access ID:</span> <span className="text-sm font-bold text-gray-700 dark:text-gray-300 break-all">{safeText(details?.[ASSETS_INPUTS.ACCESS_KEY.name])}</span></div>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Secret Key:</span> <span className="text-sm font-bold text-gray-700 dark:text-gray-300 break-all">{safeText(details?.[ASSETS_INPUTS.SECRET_KEY.name])}</span></div>
                                                            </>
                                                        )}
                                                        {details?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.AZURE && (
                                                            <>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Tenant:</span> <span className="text-sm font-bold text-blue-600 break-all">{safeText(details?.[ASSETS_INPUTS.TENANT_ID.name])}</span></div>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Subscription:</span> <span className="text-sm font-bold text-gray-700 dark:text-gray-300 break-all">{safeText(details?.[ASSETS_INPUTS.SUBSCRIPTION_ID.name])}</span></div>
                                                            </>
                                                        )}
                                                        {details?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.GCP && (
                                                            <>
                                                                <div className="flex flex-col gap-0.5"><span className="text-xs text-gray-400 uppercase font-bold">Project:</span> <span className="text-sm font-bold text-blue-600 break-all">{safeText(details?.[ASSETS_INPUTS.PROJECT_ID.name])}</span></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : assets_type?.value === ASSETS_KEYS?.app ? (
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-blue-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[9px] uppercase font-black text-gray-400">Application Bundle</p>
                                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                                                            {(() => {
                                                                const fileData = details?.[ASSETS_INPUTS.APP_FILE.name];
                                                                if (fileData instanceof FileList) return fileData[0]?.name || "N/A";
                                                                if (fileData instanceof File) return fileData.name;
                                                                return "N/A";
                                                            })()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-800">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-indigo-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase font-black text-gray-400">Description</p>
                                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                                            {safeText(details?.[ASSETS_INPUTS.DESCRIPTION.name] || "No description provided.")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8 gap-4 pb-6">
                    {/* <button
                        type="button"
                        onClick={() => setActiveTab(TAB_KEY.OWNERS)}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        Back
                    </button> */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-10 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)
}
