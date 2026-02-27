"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { useEffect } from "react";
import { ALL_PROVIDER_LIST, ASSETS_INPUTS, PROVIDER_KEY } from "./AddAssets";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { assets, ASSETS_KEYS } from "./AssetsTypes";


export default function PreviewPage({ resDomainList }: any) {

    const router = useRouter();
    const { assets_type, assets_details, credentials, owners, final_validate_data, setFinalValidateData, resetInventory } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const onSubmit = async () => {

        console.log('Changecode Submit', {
            assets_type,
            assets_details,
            credentials,
            owners,
            website_url: resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain : "N/A",
            final_validate_data,
        });

        setFinalValidateData({
            value: new Date(),
            is_valid: true,
        });

        const inventoryData = await fetch("/api/inventory/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                assets_type,
                assets_details,
                credentials,
                owners,
                website_url: resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain : "N/A",
                final_validate_data,
            }),
        });

        const res = await inventoryData.json()

        console.log('/api/inventory/add res', res);

        if (res.code == CODES?.SUCCESS) {
            TOAST_SUCCESS(res?.message)
            resetInventory()
            router.push(`/inventory`);
            // router.push(`/asset-details?url=${encodeURIComponent(resDomainList?.length > 0 && resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain || '')}`);
        } else {
            TOAST_ERROR(res?.message)
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
                                                {assets.find((item) => item?.key === assets_type?.value)?.title || "N/A"}
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
                                                    {resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain : "N/A"}
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
                    <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white rounded px-6 py-2" >
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)

}
