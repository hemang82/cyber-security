"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { useEffect, useState } from "react";
import { ALL_PROVIDER_LIST, ASSETS_INPUTS, PROVIDER_KEY } from "./AddAssets";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { ASSETS, ASSETS_KEYS } from "./AssetsTypes";


export default function PreviewPage({ resDomainList }: any) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { assets_type, assets_details, credentials, owners, final_validate_data, setFinalValidateData, resetInventory } = useInventoryStore();

    const methods = useForm({
        mode: "onSubmit", // Trigger validation only on submit
        reValidateMode: "onChange" // Re-validate on change after first submission attempt
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
                formData.append("credentials", JSON.stringify(credentials));
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
                    credentials,
                    owners,
                    website_url: currentWebsiteUrl,
                    final_validate_data: { value: new Date(), is_valid: true },
                });
            }

            const inventoryData = await fetch("/api/inventory/add", { method: "POST", headers, body });
            const res = await inventoryData.json();

            if (res.code == CODES?.SUCCESS) {
                console.log("✅ Asset added successfully, ID:", res?.data?.id);

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

                        console.log("🚀 Starting file upload...");
                        setLoading(true); // Keep loading state until file is uploaded

                        try {
                            const uploadRes = await fetch("https://cyberapi.ipotrending.com/api/assets/upload-file", {
                                method: "POST",
                                body: uploadFormData,
                            });
                            const uploadResult = await uploadRes.json();
                            console.log("✅ File upload success:", uploadResult);
                        } catch (err) {
                            console.error("❌ File upload error:", err);
                        }
                    }
                }

                TOAST_SUCCESS(res?.message || "Asset added successfully");

                // Now safely reset and redirect
                resetInventory();
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

    useEffect(() => {
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, final_validate_data?.value?.[ASSETS_INPUTS.WEBSITE_URL.name] || '');
    }, [methods, final_validate_data]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                Preview
                            </h4>

                            <div className="space-y-8">
                                {/* Section 1: Asset Overview */}
                                <div>
                                    <h5 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        Asset Information
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Asset Type</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                {ASSETS.find((item) => item?.key === assets_type?.value)?.title || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Asset Name</p>
                                            <p className="text-md font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                {assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name] || "N/A"}
                                            </p>
                                        </div>
                                        {assets_type?.value === ASSETS_KEYS?.web && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Website URL</p>
                                                <p className="text-md font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-900/30 break-all">
                                                    {(() => {
                                                        const domainArr = Array.isArray(resDomainList) ? resDomainList : (Array.isArray(resDomainList?.data) ? resDomainList.data : []);
                                                        return domainArr.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain || "N/A";
                                                    })()}
                                                </p>
                                            </div>
                                        )}
                                        {assets_type?.value === ASSETS_KEYS?.app && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">App File</p>
                                                <p className="text-md font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                    {(() => {
                                                        const fileData = assets_details?.value?.[ASSETS_INPUTS.APP_FILE.name];
                                                        if (fileData instanceof FileList) {
                                                            return fileData[0]?.name || "N/A";
                                                        }
                                                        return fileData?.name || "N/A";
                                                    })()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section 2: Asset Metadata (Cloud Credentials) */}
                                {assets_type?.value === ASSETS_KEYS?.cloud && (
                                    <div>
                                        <h5 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                            Cloud Provider Details
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                                            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full uppercase">
                                                    {ALL_PROVIDER_LIST?.find((item: any) => item.value == assets_details?.value?.[ASSETS_INPUTS.PROVIDER.name])?.label || "Unknown Provider"}
                                                </span>
                                            </div>

                                            {/* AWS Fields */}
                                            {assets_details?.value?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.AWS && (
                                                <>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Access ID</p>
                                                        <p className="text-md font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.ACCESS_KEY.name] || "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Secret Key</p>
                                                        <p className="text-md font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            ********
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Region</p>
                                                        <p className="text-md font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.REGION.name] || "-"}
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Azure Fields */}
                                            {assets_details?.value?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.AZURE && (
                                                <>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Client ID</p>
                                                        <p className="text-md font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.CLIENT_ID.name] || "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Tenant ID</p>
                                                        <p className="text-md font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.TENANT_ID.name] || "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Subscription ID</p>
                                                        <p className="text-md font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.SUBSCRIPTION_ID.name] || "-"}
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* GCP Fields */}
                                            {assets_details?.value?.[ASSETS_INPUTS.PROVIDER.name] === PROVIDER_KEY?.GCP && (
                                                <>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Project ID</p>
                                                        <p className="text-md font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                            {assets_details?.value?.[ASSETS_INPUTS.PROJECT_ID.name] || "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Key Filename</p>
                                                        <p className="text-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 italic">
                                                            {assets_details?.value?.[ASSETS_INPUTS.KEY_FILENAME.name] || "-"}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Section 3: Contact & Ownership */}
                                <div>
                                    <h5 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                        Contact & Ownership
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Contact Name</p>
                                            <p className="text-md font-semibold text-gray-800 dark:text-white">
                                                {assets_details?.value?.[ASSETS_INPUTS.NAME.name] || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Contact Email</p>
                                            <p className="text-md font-semibold text-gray-800 dark:text-white">
                                                {assets_details?.value?.[ASSETS_INPUTS.EMAIL.name] || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Contact Phone</p>
                                            <p className="text-md font-semibold text-gray-800 dark:text-white">
                                                {assets_details?.value?.[ASSETS_INPUTS.PHONE_NUMBER.name] || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Account Owner</p>
                                            <p className="text-md font-semibold text-indigo-600 dark:text-indigo-400">
                                                {owners?.value?.[ASSETS_INPUTS.OWNER.name] || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center m-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-3 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{assets_type?.value === ASSETS_KEYS.app ? "Uploading..." : "Processing..."}</span>
                            </>
                        ) : (
                            "Confirm & Submit Asset"
                        )}
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)

}
