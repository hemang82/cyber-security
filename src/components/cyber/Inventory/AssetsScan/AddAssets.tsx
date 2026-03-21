"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useEffect, useMemo, useState } from "react";
import { TabContent } from "../AddInventory";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE, TAB_KEY } from "@/common/commonVariable";
import { useInventoryStore } from "@/store";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";
import { ASSETS_KEYS } from "../Assets/AssetsTypes";
import { ALL_PROVIDER_LIST, ASSETS_INPUTS, PROVIDER_KEY } from "../Assets/AddAssets";
export { ALL_PROVIDER_LIST, ASSETS_INPUTS, PROVIDER_KEY };
import { getApplicationDetails, getCloudScanDetails, getWebsiteDetails } from "@/lib/clientApi";
import { CODES } from "@/common/constant";
import { TOAST_ERROR } from "@/common/commonFunction";


export default function AddAssets({ resInventoryList }: any) {

    const { assets_type, assets_details, setAssetsDetails, setActiveTab, setLoader, resetInventory } = useInventoryStore();
    const router = useRouter();
    const methods = useForm({
        mode: "onSubmit", // Trigger validation only on submit
        reValidateMode: "onChange" // Re-validate on change after first submission attempt
    });
    const selectedProvider = methods.watch(ASSETS_INPUTS.PROVIDER.name);

    const [selectedOption, setSelectedOption] = useState<any>({});

    //     const onSubmit = async (data: any) => {

    //         setAssetsDetails({
    //             value: data,
    //             is_valid: true,
    //         });

    //         setLoader(true);

    //         try {

    //             if (assets_type?.value == ASSETS_KEYS?.cloud) {

    //                 const provider = data[ASSETS_INPUTS.PROVIDER.name];
    //                 let credentials: any = {};

    //                 if (provider === PROVIDER_KEY.AWS) {
    //                     credentials = {
    //                         accessKeyId: data[ASSETS_INPUTS.ACCESS_KEY.name],
    //                         secretAccessKey: data[ASSETS_INPUTS.SECRET_KEY.name],
    //                         region: data[ASSETS_INPUTS.REGION.name]
    //                     };
    //                 }
    //                 else if (provider === PROVIDER_KEY.AZURE) {
    //                     credentials = {
    //                         clientId: data[ASSETS_INPUTS.CLIENT_ID.name],
    //                         clientSecret: data[ASSETS_INPUTS.CLIENT_SECRET.name],
    //                         tenantId: data[ASSETS_INPUTS.TENANT_ID.name],
    //                         subscriptionId: data[ASSETS_INPUTS.SUBSCRIPTION_ID.name]
    //                     };
    //                 }
    //                 else if (provider === PROVIDER_KEY.GCP) {
    //                     credentials = {
    //                         projectId: data[ASSETS_INPUTS.PROJECT_ID.name],
    //                         keyFilename: data[ASSETS_INPUTS.KEY_FILENAME.name]
    //                     };
    //                 }

    //                 console.log('Cloud Payload 👉', {
    //                     provider,
    //                     assetId: data.inventory_id,
    //                     credentials
    //                 });

    //                 const response = await getCloudScanDetails({
    //                     provider,
    //                     assetId: data.inventory_id,
    //                     credentials
    //                 });

    //                 if (response?.code !== CODES?.SUCCESS) {
    //                     throw new Error(response?.message || "Cloud scan failed");
    //                 }

    //             } else if (assets_type?.value == ASSETS_KEYS?.web) {
    //                 const websiteUrl = data[ASSETS_INPUTS.WEBSITE_URL.name];

    //                 const response = await getWebsiteDetails({
    //                     url: websiteUrl,
    //                     assetId: data.inventory_id,
    //                 });

    //                 if (response?.code !== CODES?.SUCCESS) {
    //                     throw new Error(response?.message || "Website scan failed");
    //                 }
    //             } else if (assets_type?.value == ASSETS_KEYS?.app) {

    //                 const response = await getApplicationDetails({
    //                     assetId: data.inventory_id,
    //                 });

    //                 if (response?.code !== CODES?.SUCCESS) {
    //                     throw new Error(response?.message || "Website scan failed");
    //                 }
    //             } else {
    //                 console.log("Asset Type is required")
    //                 console.log("assets_type?.value == ASSETS_KEYS?.app", assets_type?.value, 'ASSETS_KEYS?.app', ASSETS_KEYS?.app)
    //                 TOAST_ERROR("Asset Type is required")
    //             }
    //             // router.push(`/scan`);

    //   window.location.replace("/scan");
    //             resetInventory();

    //         } catch (error: any) {

    //             console.error("Submit Error 👉", error);
    //             TOAST_ERROR(error?.message || "Something went wrong. Please try again later.");

    //         } finally {
    //             setLoader(false); // ✅ Always stop loader
    //         }
    //     };

    const onSubmit = async (data: any) => {
        setAssetsDetails({
            value: data,
            is_valid: true,
        });

        setLoader(true);

        try {
            let response;

            if (assets_type?.value == ASSETS_KEYS?.cloud) {
                const provider = data[ASSETS_INPUTS.PROVIDER.name];
                let credentials: any = {};

                if (provider === PROVIDER_KEY.AWS) {
                    credentials = {
                        accessKeyId: data[ASSETS_INPUTS.ACCESS_KEY.name],
                        secretAccessKey: data[ASSETS_INPUTS.SECRET_KEY.name],
                        region: data[ASSETS_INPUTS.REGION.name]
                    };
                } else if (provider === PROVIDER_KEY.AZURE) {
                    credentials = {
                        clientId: data[ASSETS_INPUTS.CLIENT_ID.name],
                        clientSecret: data[ASSETS_INPUTS.CLIENT_SECRET.name],
                        tenantId: data[ASSETS_INPUTS.TENANT_ID.name],
                        subscriptionId: data[ASSETS_INPUTS.SUBSCRIPTION_ID.name]
                    };
                } else if (provider === PROVIDER_KEY.GCP) {
                    credentials = {
                        projectId: data[ASSETS_INPUTS.PROJECT_ID.name],
                        keyFilename: data[ASSETS_INPUTS.KEY_FILENAME.name]
                    };
                }

                response = await getCloudScanDetails({
                    provider,
                    assetId: data.inventory_id,
                    credentials
                });

            } else if (assets_type?.value == ASSETS_KEYS?.web) {
                response = await getWebsiteDetails({
                    url: data[ASSETS_INPUTS.WEBSITE_URL.name],
                    assetId: data.inventory_id,
                });

            } else if (assets_type?.value == ASSETS_KEYS?.app) {
                response = await getApplicationDetails({
                    assetId: data.inventory_id,
                });

            } else {
                TOAST_ERROR("Asset Type is required");
                return;
            }

            // ✅ Check response AFTER API complete
            if (response?.code !== CODES?.SUCCESS) {
                throw new Error(response?.message || "Scan failed");
            }



            // ✅ Small delay to ensure state update (important)
            setTimeout(() => {
                // ✅ Reset state first
                window.location.replace("/scan");
            }, 100);

        } catch (error: any) {
            console.error("Submit Error 👉", error);
            TOAST_ERROR(error?.message || "Something went wrong. Please try again later.");
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        methods.setValue(ASSETS_INPUTS.ASSETS_NAME.name, assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name] || '');

        const urlValue = assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name];
        const inventoryArr = Array.isArray(resInventoryList)
            ? resInventoryList
            : (Array.isArray(resInventoryList?.assets) ? resInventoryList.assets : []);

        const match = inventoryArr.find((item: any) => item.id == urlValue || item.url == urlValue);
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, (match?.url || urlValue) || '');
    }, [methods, assets_details, resInventoryList]);

    const selectList = useMemo(() => {
        const inventoryArr = Array.isArray(resInventoryList)
            ? resInventoryList
            : (Array.isArray(resInventoryList?.assets) ? resInventoryList.assets : []);

        return (
            inventoryArr
                ?.filter((item: any) => item.type === assets_type?.value)
                ?.map((item: any) => {
                    const metadata = item?.metadata || {};
                    const platform = metadata?.platform;
                    const fileName = metadata?.app_file_name; // Assuming the filename is stored in metadata after upload

                    let label = item.name;
                    if (item.type === ASSETS_KEYS.app && platform) {
                        label = `${item.name} (${platform.toUpperCase()}${fileName ? ` - ${fileName}` : ""})`;
                    }

                    return {
                        value: item.id,
                        inventory_id: item.id,
                        website_url: item.url,
                        label: label,
                        status: metadata?.upload_status,
                        full_data: item
                    };
                }) || []
        );

    }, [assets_type?.value, resInventoryList]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="Add Scan">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/*Assets Name */}
                            <div>
                                <Label>Assets Name <span className="text-error-500">*</span></Label>
                                <Controller
                                    control={methods.control}
                                    name={ASSETS_INPUTS.ASSETS_NAME.name}
                                    rules={{ required: ASSETS_INPUTS.ASSETS_NAME.validation }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={selectList}
                                            placeholder="Select Option"
                                            value={field.value}
                                            onChange={(value: any) => {
                                                console.log('selected value', value);
                                                const selectedOption = selectList.find((opt: any) => opt.value == value);
                                                console.log('selected option', selectedOption);
                                                // 1️⃣ MUST: update Controller field
                                                field.onChange(value);
                                                setSelectedOption(selectedOption)
                                                // 2️⃣ Set WEBSITE_URL based on selected option label
                                                if (selectedOption) {
                                                    methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, selectedOption.website_url);
                                                    methods.setValue('inventory_id', selectedOption.inventory_id);

                                                    // Parse metadata if it's a string
                                                    let metadata = selectedOption?.full_data?.metadata;

                                                    const credentials = metadata?.credentials || {};
                                                    const provider = credentials.provider || null;

                                                    methods.setValue(ASSETS_INPUTS.PROVIDER.name, provider);

                                                    if (provider === PROVIDER_KEY.AWS) {
                                                        methods.setValue(ASSETS_INPUTS.ACCESS_KEY.name, credentials.access_key || credentials.accessKeyId);
                                                        methods.setValue(ASSETS_INPUTS.SECRET_KEY.name, credentials.secret_key || credentials.secretAccessKey);
                                                        methods.setValue(ASSETS_INPUTS.REGION.name, credentials.region);
                                                    } else if (provider === PROVIDER_KEY.AZURE) {
                                                        methods.setValue(ASSETS_INPUTS.CLIENT_ID.name, credentials.client_id);
                                                        methods.setValue(ASSETS_INPUTS.CLIENT_SECRET.name, credentials.client_secret);
                                                        methods.setValue(ASSETS_INPUTS.TENANT_ID.name, credentials.tenant_id);
                                                        methods.setValue(ASSETS_INPUTS.SUBSCRIPTION_ID.name, credentials.subscription_id);
                                                    } else if (provider === PROVIDER_KEY.GCP) {
                                                        methods.setValue(ASSETS_INPUTS.PROJECT_ID.name, credentials.project_id);
                                                        methods.setValue(ASSETS_INPUTS.KEY_FILENAME.name, credentials.key_filename);
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {
                                (assets_type?.value === ASSETS_KEYS?.web) ? (
                                    <div>
                                        <Label>Website URL<span className="text-gray-500">(Note : Domain verified after selection)</span> </Label>
                                        <Input
                                            disabled={true}
                                            placeholder={ASSETS_INPUTS.WEBSITE_URL.placeholder}
                                            name={ASSETS_INPUTS.WEBSITE_URL.name}
                                        />
                                    </div>
                                ) : assets_type?.value === ASSETS_KEYS?.cloud ? (
                                    <>
                                        {
                                            methods.watch(ASSETS_INPUTS.ASSETS_NAME.name) && (
                                                <div>
                                                    <Label>Provider <span className="text-error-500">*</span> </Label>
                                                    <Controller
                                                        control={methods.control}
                                                        name={ASSETS_INPUTS?.PROVIDER.name}
                                                        rules={{ required: ASSETS_INPUTS.PROVIDER.validation }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                disabled={true}
                                                                options={ALL_PROVIDER_LIST}
                                                                placeholder={ASSETS_INPUTS.PROVIDER.placeholder}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )
                                        }

                                        {/* AWS Specific Fields */}
                                        {selectedProvider == PROVIDER_KEY.AWS && (
                                            <>
                                                <div>
                                                    <Label>Access ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Access ID"
                                                        name={ASSETS_INPUTS.ACCESS_KEY.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.ACCESS_KEY.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Secret Key <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Secret Key"
                                                        disabled
                                                        name={ASSETS_INPUTS.SECRET_KEY.name}
                                                        rules={{
                                                            required: ASSETS_INPUTS.SECRET_KEY.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Region <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Region"
                                                        name={ASSETS_INPUTS.REGION.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.REGION.validation,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Azure Specific Fields */}
                                        {selectedProvider == PROVIDER_KEY.AZURE && (
                                            <>
                                                <div>
                                                    <Label>Client ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Client ID"
                                                        name={ASSETS_INPUTS.CLIENT_ID.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.CLIENT_ID.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Client Secret <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Client Secret"
                                                        name={ASSETS_INPUTS.CLIENT_SECRET.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.CLIENT_SECRET.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Tenant ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Tenant ID"
                                                        name={ASSETS_INPUTS.TENANT_ID.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.TENANT_ID.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Subscription ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Subscription ID"
                                                        name={ASSETS_INPUTS.SUBSCRIPTION_ID.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.SUBSCRIPTION_ID.validation,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* GCP Specific Fields */}
                                        {selectedProvider == PROVIDER_KEY.GCP && (
                                            <>
                                                <div>
                                                    <Label>Project ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Project ID"
                                                        name={ASSETS_INPUTS.PROJECT_ID.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.PROJECT_ID.validation,
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Key Filename <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Key Filename"
                                                        name={ASSETS_INPUTS.KEY_FILENAME.name}
                                                        disabled
                                                        rules={{
                                                            required: ASSETS_INPUTS.KEY_FILENAME.validation,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : assets_type?.value === ASSETS_KEYS?.app ? (
                                    <>
                                        <div>
                                            <Label>Platform</Label>
                                            <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                {selectedOption?.full_data?.metadata?.platform === 'android' ? (
                                                    <svg viewBox="0 0 512 512" height="16" width="16" className="text-brand-600"><path fill="currentColor" d="M176.4 468.1h-43.2l-.2-65.7h43.4v65.7zm159.2 0h-43.2l-.2-65.7h43.4v65.7zM89.1 213.6c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zm333.8 0c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zM113.3 170.4h285.4v187.7c0 23.9-19.3 43.1-43.2 43.1H156.5c-23.9 0-43.2-19.3-43.2-43.1V170.4zm228-76.3l31.5-39.3c5.3-6.6 4.3-16.3-2.3-21.6-6.6-5.3-16.3-4.3-21.6 2.3l-34.5 43c-18.7-7.8-39.4-12.1-61.2-12.1s-42.5 4.3-61.2 12.1l-34.5-43c-5.3-6.6-15-7.6-21.6-2.3-6.6 5.3-7.6 15-2.3 21.6l31.5 39.3c-28.5 17.1-48.4 46.5-52.6 81.1h281.3c-4.1-34.5-24-64-52.5-81.1z" /></svg>
                                                ) : (
                                                    <svg viewBox="0 0 384 512" height="16" width="16" className="text-black"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                                                )}
                                                <span className="text-md font-semibold text-gray-800 dark:text-white capitalize">
                                                    {selectedOption?.full_data?.metadata?.platform || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>App File</Label>
                                            <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                <span className="text-md font-semibold text-gray-800 dark:text-white truncate block">
                                                    {selectedOption?.full_data?.metadata?.app_file_name || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : null
                            }

                            {/* Additional Info */}
                            {/* <div className="col-span-full">
                                <Label>Description</Label>
                                <TextArea
                                    className="!w-1/2"
                                    placeholder={ASSETS_INPUTS.DESCRIPTION.placeholder}
                                    name={ASSETS_INPUTS.DESCRIPTION.name}
                                // rules={{
                                //     required: ASSETS_INPUTS.DESCRIPTION.validation
                                // }}
                                // value={methods.watch(ASSETS_INPUTS.DESCRIPTION.name) || ""}
                                />
                            </div> */}

                        </div>
                    </TabContent>
                    {/* </form> */}
                </div >

                <div className="flex justify-center m-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white rounded px-6 py-2" >
                        Submit
                    </button>
                </div>

            </form >
        </FormProvider >
    </>)
}