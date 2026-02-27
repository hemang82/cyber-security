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
import { getCloudScanDetails, getWebsiteDetails } from "@/lib/clientApi";
import { CODES } from "@/common/constant";
import { TOAST_ERROR } from "@/common/commonFunction";


export default function AddAssets({ resInventoryList }: any) {

    const { assets_type, assets_details, setAssetsDetails, setActiveTab, setLoader, resetInventory } = useInventoryStore();
    const router = useRouter();

    const methods = useForm({ mode: "onBlur", });
    const selectedProvider = methods.watch(ASSETS_INPUTS.PROVIDER.name);

    const [selectedOption, setSelectedOption] = useState<any>({});

    const onSubmit = async (data: any) => {

        console.log("FORM DATA 👉", data);

        setAssetsDetails({
            value: data,
            is_valid: true,
        });

        setLoader(true);

        try {

            if (assets_type?.value === ASSETS_KEYS?.cloud) {

                const provider = data[ASSETS_INPUTS.PROVIDER.name];
                let credentials: any = {};

                if (provider === PROVIDER_KEY.AWS) {
                    credentials = {
                        accessKeyId: data[ASSETS_INPUTS.ACCESS_KEY.name],
                        secretAccessKey: data[ASSETS_INPUTS.SECRET_KEY.name],
                        region: data[ASSETS_INPUTS.REGION.name]
                    };
                }
                else if (provider === PROVIDER_KEY.AZURE) {
                    credentials = {
                        clientId: data[ASSETS_INPUTS.CLIENT_ID.name],
                        clientSecret: data[ASSETS_INPUTS.CLIENT_SECRET.name],
                        tenantId: data[ASSETS_INPUTS.TENANT_ID.name],
                        subscriptionId: data[ASSETS_INPUTS.SUBSCRIPTION_ID.name]
                    };
                }
                else if (provider === PROVIDER_KEY.GCP) {
                    credentials = {
                        projectId: data[ASSETS_INPUTS.PROJECT_ID.name],
                        keyFilename: data[ASSETS_INPUTS.KEY_FILENAME.name]
                    };
                }

                console.log('Cloud Payload 👉', {
                    provider,
                    assetId: data.inventory_id,
                    credentials
                });

                const response = await getCloudScanDetails({
                    provider,
                    assetId: data.inventory_id,
                    credentials
                });

                if (response?.code !== CODES?.SUCCESS) {
                    throw new Error(response?.message || "Cloud scan failed");
                }

            } else {

                const websiteUrl = data[ASSETS_INPUTS.WEBSITE_URL.name];

                const response = await getWebsiteDetails({
                    url: websiteUrl,
                    assetId: data.inventory_id,
                });

                if (response?.code !== CODES?.SUCCESS) {
                    throw new Error(response?.message || "Website scan failed");
                }
            }

            // ✅ Common Success Flow
            router.push(`/scan`);
            resetInventory();

        } catch (error: any) {

            console.error("Submit Error 👉", error);
            TOAST_ERROR(error?.message || "Something went wrong. Please try again later.");

        } finally {

            setLoader(false); // ✅ Always stop loader
        }
    };

    useEffect(() => {
        methods.setValue(ASSETS_INPUTS.ASSETS_NAME.name, assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name] || '');

        const urlValue = assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name];
        const match = resInventoryList?.find((item: any) => item.id == urlValue || item.url == urlValue);
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, (match?.url || urlValue) || '');
    }, [methods, assets_details, resInventoryList]);

    const selectList = useMemo(() => {
        return (
            resInventoryList
                ?.filter((item: any) => item.type === assets_type?.value)
                ?.map((item: any) => ({
                    value: item.id,
                    inventory_id: item.id,
                    website_url: item.url,
                    label: item.name,
                    full_data: item   // 👈 Ahiya badho original object add kari didho
                })) || []
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