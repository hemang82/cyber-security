"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { formatDate, safeText, TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { ASSETS, ASSETS_KEYS } from "../Assets/AssetsTypes";
import { ASSETS_INPUTS, PROVIDER_KEY, SCAN_PURPOSE, SCAN_TYPE } from "./AddAssets";
import { getApplicationDetails, getCloudScanDetails, getWebsiteDetails } from "@/lib/clientApi";
import { BoltIcon, CalenderIcon, InfoIcon, TimeIcon } from "@/icons";
import { DATE_FORMAT, TAB_KEY } from "@/common/commonVariable";

export default function PreviewPage({ resInventoryList }: any) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { assets_type, setLoader, assets_details, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });

    const onSubmit = async () => {
        setLoading(true);
        setLoader(true);
        try {
            const previewValue = assets_details?.value || {};
            const data = previewValue.data || {};
            let response;

            if (assets_type?.value === ASSETS_KEYS?.cloud) {
                const provider = data[ASSETS_INPUTS.PROVIDER.name];
                let scanCredentials: any = {};

                if (provider === PROVIDER_KEY.AWS) {
                    scanCredentials = {
                        accessKeyId: data[ASSETS_INPUTS.ACCESS_KEY.name],
                        secretAccessKey: data[ASSETS_INPUTS.SECRET_KEY.name],
                        region: data[ASSETS_INPUTS.REGION.name]
                    };
                } else if (provider === PROVIDER_KEY.AZURE) {
                    scanCredentials = {
                        clientId: data[ASSETS_INPUTS.CLIENT_ID.name],
                        clientSecret: data[ASSETS_INPUTS.CLIENT_SECRET.name],
                        tenantId: data[ASSETS_INPUTS.TENANT_ID.name],
                        subscriptionId: data[ASSETS_INPUTS.SUBSCRIPTION_ID.name]
                    };
                } else if (provider === PROVIDER_KEY.GCP) {
                    scanCredentials = {
                        projectId: data[ASSETS_INPUTS.PROJECT_ID.name],
                        keyFilename: data[ASSETS_INPUTS.KEY_FILENAME.name]
                    };
                }

                response = await getCloudScanDetails({
                    provider,
                    assetId: data.inventory_id,
                    credentials: scanCredentials,
                    purpose: data.purpose,
                    scan_type: data.scan_type,
                    time_slot: data.purpose === SCAN_PURPOSE.AUTOMATED ? formatDate(data.time_slot, DATE_FORMAT?.FULL_DAY_MONTH_YEAR) : null
                });

            } else if (assets_type?.value === ASSETS_KEYS?.web) {
                response = await getWebsiteDetails({
                    url: data[ASSETS_INPUTS.WEBSITE_URL.name],
                    assetId: data.inventory_id,
                    purpose: data.purpose,
                    scan_type: data.scan_type,
                    time_slot: data.purpose === SCAN_PURPOSE.AUTOMATED ? data.time_slot : null
                });

            } else if (assets_type?.value === ASSETS_KEYS?.app) {
                response = await getApplicationDetails({
                    assetId: data.inventory_id,
                    purpose: data.purpose,
                    scan_type: data.scan_type,
                    time_slot: data.purpose === SCAN_PURPOSE.AUTOMATED ? data.time_slot : null
                });
            }

            if (response && response.code === CODES?.SUCCESS) {
                TOAST_SUCCESS(response?.message || "Scan initiated successfully");
                setTimeout(() => {
                    window.location.replace("/scan");
                }, 500);
            } else {
                throw new Error(response?.message || "Scan processing failed");
            }

        } catch (error: any) {
            console.error("Submission Error:", error);
            TOAST_ERROR(error?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setLoader(false);
        }
    };

    const previewData = assets_details?.value?.data || {};
    const assetMetadata = assets_details?.value?.selectedOption?.full_data || {};

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
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Scan Summary & Confirmation
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
                                                <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Asset Name</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                    {safeText(assetMetadata?.name || "N/A")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-brand-600">
                                                <BoltIcon className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Asset Type</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
                                                    {safeText(ASSETS.find((item) => item?.key === assets_type?.value)?.title || "Website ")}
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
                                                        <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Website URL</p>
                                                        <p className="text-sm font-semibold text-blue-600 truncate break-all">
                                                            {safeText(assetMetadata?.url || previewData?.website_url || "N/A")}
                                                        </p>
                                                    </>
                                                )}
                                                {assets_type?.value === ASSETS_KEYS?.app && (
                                                    <>
                                                        <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Platform</p>
                                                        <p className="text-sm font-semibold text-blue-600 truncate capitalize">
                                                            {safeText(assetMetadata?.tags || "N/A")}
                                                        </p>
                                                    </>
                                                )}
                                                {assets_type?.value === ASSETS_KEYS?.cloud && (
                                                    <>
                                                        <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Cloud Provider</p>
                                                        <p className="text-sm font-semibold text-blue-600 truncate capitalize">
                                                            {safeText(assetMetadata?.metadata?.credentials?.provider || "N/A")}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Part 2: Scan Configuration */}
                                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 h-full">
                                    <h5 className="text-[12px] uppercase tracking-widest text-blue-500 font-bold mb-6 border-b border-blue-100/50 dark:border-blue-800/20 pb-2">Scan Config</h5>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-theme-xs border border-blue-100 dark:border-blue-800 flex items-center gap-3 w-full">
                                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                    {previewData.purpose === SCAN_PURPOSE.AUTOMATED ? <CalenderIcon className="size-5 text-amber-500" /> : <BoltIcon className="size-5 text-green-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase font-semibold text-gray-400">Strategy</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">{safeText(previewData.purpose?.replace('_', ' ') || "Manual Scan")}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-theme-xs border border-blue-100 dark:border-blue-800 flex items-center gap-3 w-full">
                                                <div className="p-1 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[11px] font-black uppercase">
                                                    {safeText(previewData.scan_type?.split('_')[0] || "Quick")}
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase font-semibold text-gray-400">Analysis Type</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">{safeText(previewData.scan_type?.replace('_', ' ') || "Quick Scan")}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-theme-xs border border-blue-100 dark:border-blue-800 flex items-center gap-3 w-full">
                                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                                    <TimeIcon className="size-5 opacity-80" />
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase font-semibold text-gray-400">Scheduled At</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                        {previewData.purpose === SCAN_PURPOSE.AUTOMATED ? safeText(previewData.time_slot) : "Now"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Part 3: Contact Details */}
                                <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 h-full">

                                    <h5 className="text-[12px] uppercase tracking-widest text-blue-500 font-bold mb-6  border-b border-blue-100/50 dark:border-blue-800/20 pb-2">Contact Details</h5>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-semibold border border-indigo-100 dark:border-indigo-800">
                                                {safeText(assetMetadata?.contact_name || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-semibold text-gray-400 mb-0.5">Contact Person</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                    {safeText(assetMetadata?.contact_name || "Unassigned")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <p className="text-sm font-medium truncate">
                                                {safeText(assetMetadata?.contact_email || "N/A")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            <p className="text-sm font-medium">
                                                {safeText(assetMetadata?.contact_phone || "N/A")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8 gap-4">

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-10 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50`}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)
}
