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
import { ASSETS_KEYS } from "./AssetsTypes";

type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export const ASSETS_INPUTS = {
    ASSETS_NAME: {
        placeholder: "Enter assets name ",
        name: "assets_name",
        validation: "Enter assets name.",
    },
    WEBSITE_URL: {
        placeholder: "Enter website URL",
        name: "website_url",
        validation: "Enter website URL.",
    },
    DESCRIPTION: {
        placeholder: "Enter description",
        name: "description",
        validation: "Enter description.",
    },
    NAME: {
        placeholder: "Enter name",
        name: "name",
        validation: "Enter name.",
    },
    COMPANY_NAME: {
        placeholder: "Enter company name",
        name: "company_name",
        validation: "Enter company name.",
    },
    EMAIL: {
        placeholder: "Enter email",
        name: "email",
        validation: "Enter email.",
    },
    PHONE_NUMBER: {
        placeholder: "Enter phone number",
        name: "phone_number",
        validation: "Enter phone number.",
    },
    OWNER: {
        placeholder: "Enter owner",
        name: "owner",
        validation: "Select owner.",
    },
    PASSWORD: {
        placeholder: "Enter password",
        name: "password",
        validation: "Enter password.",
    },
    PROVIDER: {
        placeholder: "Enter provider",
        name: "provider",
        validation: "Enter provider.",
    },
    ACCESS_KEY: {
        placeholder: "Enter access key",
        name: "access_key",
        validation: "Enter access key.",
    },
    SECRET_KEY: {
        placeholder: "Enter secret key",
        name: "secret_key",
        validation: "Enter secret key.",
    },
    REGION: {
        placeholder: "Enter region",
        name: "region",
        validation: "Enter region.",
    },
    CLIENT_ID: {
        placeholder: "Enter client id",
        name: "client_id",
        validation: "Enter client id.",
    },
    CLIENT_SECRET: {
        placeholder: "Enter client secret",
        name: "client_secret",
        validation: "Enter client secret.",
    },
    TENANT_ID: {
        placeholder: "Enter tenant id",
        name: "tenant_id",
        validation: "Enter tenant id.",
    },
    SUBSCRIPTION_ID: {
        placeholder: "Enter subscription id",
        name: "subscription_id",
        validation: "Enter subscription id.",
    },
    PROJECT_ID: {
        placeholder: "Enter project id",
        name: "project_id",
        validation: "Enter project id.",
    },
    KEY_FILENAME: {
        placeholder: "Enter key filename",
        name: "key_filename",
        validation: "Enter key filename.",
    },
}

export enum PROVIDER_KEY {
    AWS = 'aws',
    AZURE = 'azure',
    GCP = 'gcp',
}
export const ALL_PROVIDER_LIST = [
    { value: PROVIDER_KEY.AWS, label: 'AWS' },
    { value: PROVIDER_KEY.AZURE, label: 'Azure' },
    { value: PROVIDER_KEY.GCP, label: 'GCP' },
];

export default function AddAssets({ resDomainList }: any) {

    const { assets_type, assets_details, setAssetsDetails, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    // Explicitly watch the provider to trigger re-renders
    const selectedProvider = methods.watch(ASSETS_INPUTS.PROVIDER.name);

    const [products, setProducts] = useState<Product[]>([
        { name: "Macbook Pro 13”", price: 1200, quantity: 1, discount: 0 },
        { name: "Apple Watch Ultra", price: 300, quantity: 1, discount: 50 },
        { name: "iPhone 15 Pro Max", price: 800, quantity: 2, discount: 0 },
        { name: "iPad Pro 3rd Gen", price: 900, quantity: 1, discount: 0 },
    ]);

    const subtotal = products.reduce((sum, p) => {
        const discountAmount = (p.price * p.discount) / 100;
        return sum + (p.price - discountAmount) * p.quantity;
    }, 0);

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
        setAssetsDetails({
            value: data,
            is_valid: true,
        });
        setActiveTab(TAB_KEY.OWNERS);
    };

    useEffect(() => {
        const val = assets_details?.value;

        methods.setValue(ASSETS_INPUTS.ASSETS_NAME.name, val?.[ASSETS_INPUTS.ASSETS_NAME.name] || '');
        methods.setValue(ASSETS_INPUTS.DESCRIPTION.name, val?.[ASSETS_INPUTS.DESCRIPTION.name] || '');
        methods.setValue(ASSETS_INPUTS.NAME.name, val?.[ASSETS_INPUTS.NAME.name] || '');
        methods.setValue(ASSETS_INPUTS.EMAIL.name, val?.[ASSETS_INPUTS.EMAIL.name] || '');
        methods.setValue(ASSETS_INPUTS.PHONE_NUMBER.name, val?.[ASSETS_INPUTS.PHONE_NUMBER.name] || '');

        if (assets_type?.value === ASSETS_KEYS.web) {
            const urlId = val?.[ASSETS_INPUTS.WEBSITE_URL.name];
            const match = resDomainList?.find((item: any) => item.id == urlId);
            methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, match?.id || '');
        }

        if (assets_type?.value === ASSETS_KEYS.cloud) {
            methods.setValue(ASSETS_INPUTS.PROVIDER.name, val?.[ASSETS_INPUTS.PROVIDER.name] || '');
            methods.setValue(ASSETS_INPUTS.ACCESS_KEY.name, val?.[ASSETS_INPUTS.ACCESS_KEY.name] || '');
            methods.setValue(ASSETS_INPUTS.SECRET_KEY.name, val?.[ASSETS_INPUTS.SECRET_KEY.name] || '');
            methods.setValue(ASSETS_INPUTS.REGION.name, val?.[ASSETS_INPUTS.REGION.name] || '');
        }

        // if (assets_type?.value === ASSETS_KEYS.api) {
        //     const urlId = val?.[ASSETS_INPUTS.WEBSITE_URL.name];
        //     const match = resDomainList?.find((item: any) => item.id == urlId);
        //     methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, match?.id || '');
        // }

    }, [methods, assets_details, resDomainList, assets_type?.value]);

    const selectList = useMemo(() => {
        return resDomainList?.map((item: any) => ({
            value: item.id,
            label: item.domain || item.name || item.url,
            status: item.status
        })) || [];
    }, [resDomainList]);

    console.log('methods', selectedProvider, "PROVIDER_KEY", PROVIDER_KEY.AWS);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="Add Assets">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Assets Name */}
                            <div>
                                <Label>Assets Name <span className="text-error-500">*</span></Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ASSETS_INPUTS.ASSETS_NAME.placeholder}
                                    name={ASSETS_INPUTS.ASSETS_NAME.name}
                                    rules={{
                                        required: ASSETS_INPUTS.ASSETS_NAME.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.NAME.pattern,
                                            message: INPUT_PATTERN.NAME.message,
                                        },
                                    }}
                                />
                            </div>

                            {
                                (assets_type?.value === ASSETS_KEYS?.web) ? (
                                    <div>
                                        <Label>Website URL<span className="text-gray-500">(Note : Domain verified after selection)</span> </Label>
                                        <Controller
                                            control={methods.control}
                                            name={ASSETS_INPUTS?.WEBSITE_URL.name}
                                            rules={{ required: ASSETS_INPUTS.WEBSITE_URL.validation }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={selectList}
                                                    placeholder="Select Option"
                                                />
                                            )}
                                        />
                                    </div>
                                ) : assets_type?.value === ASSETS_KEYS?.cloud ? (
                                    <>
                                        <div>
                                            <Label>Provider <span className="text-error-500">*</span> </Label>
                                            <Controller
                                                control={methods.control}
                                                name={ASSETS_INPUTS?.PROVIDER.name}
                                                rules={{ required: ASSETS_INPUTS.PROVIDER.validation }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={ALL_PROVIDER_LIST}
                                                        placeholder={ASSETS_INPUTS.PROVIDER.placeholder}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* AWS Specific Fields */}
                                        {selectedProvider == PROVIDER_KEY.AWS && (
                                            <>
                                                <div>
                                                    <Label>Access ID <span className="text-error-500">*</span></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Access ID"
                                                        name={ASSETS_INPUTS.ACCESS_KEY.name}
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
                        </div>
                    </TabContent>
                    {/* </form> */}
                </div >

                <div className="border-gray-200 p-2 sm:p-4 bg-white  ">
                    <TabContent title="Contact Details">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Name */}
                            <div>
                                <Label>Name </Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ASSETS_INPUTS.NAME.placeholder}
                                    name={ASSETS_INPUTS.NAME.name}
                                // rules={{
                                //     required: ASSETS_INPUTS.NAME.validation,
                                //     pattern: {
                                //         value: INPUT_PATTERN.NAME.pattern,
                                //         message: INPUT_PATTERN.NAME.message,
                                //     },
                                // }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email </Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.EMAIL.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.EMAIL.name}
                                // rules={{
                                //     required: ASSETS_INPUTS.EMAIL.validation,
                                //     pattern: {
                                //         value: INPUT_PATTERN.EMAIL.pattern,
                                //         message: INPUT_PATTERN.EMAIL.message,
                                //     },
                                // }}
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label>Phone Number </Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.PHONE_NUMBER.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.PHONE_NUMBER.name}
                                // rules={{
                                //     required: ASSETS_INPUTS.PHONE_NUMBER.validation,
                                //     pattern: {
                                //         value: INPUT_PATTERN.MOBILE.pattern,
                                //         message: INPUT_PATTERN.MOBILE.message,
                                //     },
                                // }}
                                />
                            </div>

                        </div>
                    </TabContent>
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