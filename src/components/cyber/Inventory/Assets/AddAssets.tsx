"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useEffect, useMemo, useState } from "react";
import { TabContent } from "../AddInventory";
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE, TAB_KEY } from "@/common/commonVariable";
import { useInventoryStore } from "@/store";

import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import { ASSETS_KEYS } from "./AssetsTypes";
import FileInput from "@/components/form/input/FileInput";

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
    APP_FILE: {
        placeholder: "Upload app file (.apk, .ipa)",
        name: "app_file",
        validation: "Upload app file.",
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
        mode: "onSubmit", // Trigger validation only on submit
        reValidateMode: "onChange" // Re-validate on change after first submission attempt
    });

    const selectedProvider = useWatch({
        control: methods.control,
        name: ASSETS_INPUTS.PROVIDER.name,
    });

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

        if (assets_type?.value === ASSETS_KEYS.app) {
            methods.setValue(ASSETS_INPUTS.APP_FILE.name, val?.[ASSETS_INPUTS.APP_FILE.name] || null);
            methods.setValue("platform", val?.platform || '');
        }

    }, [methods, assets_details, resDomainList, assets_type?.value]);

    const selectList = useMemo(() => {
        return resDomainList?.map((item: any) => ({
            value: item.id,
            label: item.domain || item.name || item.url,
            status: item.status
        })) || [];
    }, [resDomainList]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    <TabContent title="Add Assets">
                        {/* Platform Selection - Professional UI Integration */}
                        {assets_type?.value === ASSETS_KEYS?.app && (
                            <div className="mb-0 p-0">
                                <div className="space-y-4">
                                    {/* <div className="flex items-center "> */}
                                    {/* <div className="h-4 w-1 bg-brand-500 rounded-full" /> */}
                                    <Label className="text-[11px] font-bold uppercase text-gray-400 block">
                                        Choose Your Platform <span className="text-error-500">*</span>
                                    </Label>
                                    {/* </div> */}
                                    <div className="flex  bg-gray-100/30 dark:bg-gray-800/50 rounded-xl w-fit border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-inner transition-all hover:border-brand-200">
                                        <label className={`flex items-center gap-2.5 px-6 py-2 rounded-lg cursor-pointer transition-all duration-500 group ${methods.watch("platform") === 'android' ? 'bg-white shadow-md text-brand-600' : 'text-gray-400 hover:text-brand-500 hover:bg-white/50'}`}>
                                            <input type="radio" value="android" {...methods.register("platform", { required: "Please select platform first" })} className="hidden" />
                                            {/* Premium Android Icon with Glow */}
                                            <div className={`transition-transform duration-500 ${methods.watch("platform") === 'android' ? 'scale-110 ' : 'group-hover:scale-110'}`}>
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M176.4 468.1h-43.2l-.2-65.7h43.4v65.7zm159.2 0h-43.2l-.2-65.7h43.4v65.7zM89.1 213.6c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zm333.8 0c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zM113.3 170.4h285.4v187.7c0 23.9-19.3 43.1-43.2 43.1H156.5c-23.9 0-43.2-19.3-43.2-43.1V170.4zm228-76.3l31.5-39.3c5.3-6.6 4.3-16.3-2.3-21.6-6.6-5.3-16.3-4.3-21.6 2.3l-34.5 43c-18.7-7.8-39.4-12.1-61.2-12.1s-42.5 4.3-61.2 12.1l-34.5-43c-5.3-6.6-15-7.6-21.6-2.3-6.6 5.3-7.6 15-2.3 21.6l31.5 39.3c-28.5 17.1-48.4 46.5-52.6 81.1h281.3c-4.1-34.5-24-64-52.5-81.1z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-bold">Android</span>
                                        </label>

                                        <label className={`flex items-center gap-2.5 px-6 py-2 rounded-lg cursor-pointer transition-all duration-500 group ${methods.watch("platform") === 'ios' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-brand-500 hover:bg-white/50'}`}>
                                            <input type="radio" value="ios" {...methods.register("platform")} className="hidden" />
                                            {/* Premium Apple/iOS Icon with Glow */}
                                            <div className={`transition-transform duration-500 ${methods.watch("platform") === 'ios' ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]' : 'group-hover:scale-110'}`}>
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-bold">iOS</span>
                                        </label>
                                    </div>
                                    {/* Platform Validation Message - Directly Below Toggle */}
                                    {!methods.watch("platform") && (
                                        <p className="text-[11px] text-error-500 mt-2 font-bold animate-pulse flex items-center gap-1.5 ml-1">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M449.07 399.08L278.64 103.96c-4.42-7.67-12.64-12.42-21.49-12.42s-17.07 4.75-21.49 12.42L64.23 399.08c-4.42 7.67-4.42 17.16 0 24.83 4.42 7.67 12.64 12.42 21.49 12.42h340.85c8.85 0 17.07-4.75 21.49-12.42 4.42-7.67 4.42-17.16 0-24.83zm-192.42-30.34c-13.71 0-24.83-11.12-24.83-24.83s11.12-24.83 24.83-24.83 24.83 11.12 24.83 24.83-11.12 24.83-24.83 24.83zm24.83-100.17c0 13.71-11.12 24.83-24.83 24.83s-24.83-11.12-24.83-24.83V169.5c0-13.71 11.12-24.83 24.83-24.83s24.83 11.12 24.83 24.83v99.24z"></path></svg>
                                            Required: Please choose a platform to enable file upload
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
                            {
                                assets_type?.value === ASSETS_KEYS?.app ? (
                                    <>
                                        {/* Left Side: Upload (For App) */}
                                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                            <div className="relative group">
                                                <Label className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-2 block">
                                                    {methods.watch("platform") === 'android'
                                                        ? 'Upload Android APK'
                                                        : methods.watch("platform") === 'ios'
                                                            ? 'Upload iOS IPA'
                                                            : 'Upload App File'}

                                                    <span className="text-error-500"> *</span>
                                                </Label>
                                                <div className={`flex items-start gap-3 transition-all duration-300 ${methods.watch("platform") ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}>
                                                    <div className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-500 mt-1 ${methods.watch("platform") ? 'bg-brand-500 text-white ' : 'bg-gray-100 text-gray-400'}`}>
                                                        <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 16L12 8" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 11L12 8L15 11" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 16L16 16" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <FileInput
                                                            disabled={!methods.watch("platform")}
                                                            name={ASSETS_INPUTS.APP_FILE.name}
                                                            accept={methods.watch("platform") === 'android' ? ".apk" : ".ipa"}
                                                            rules={{
                                                                required: ASSETS_INPUTS.APP_FILE.validation,
                                                                validate: (value: any) => {
                                                                    if (!value || (value instanceof FileList && value.length === 0)) return true;
                                                                    const file = value instanceof FileList ? value[0] : value;
                                                                    if (!file) return true;
                                                                    const extension = file.name.split('.').pop()?.toLowerCase();
                                                                    const allowed = methods.watch("platform") === 'android' ? ['apk'] : ['ipa'];
                                                                    if (!allowed.includes(extension || '')) {
                                                                        return `Support .${allowed[0]} only`;
                                                                    }
                                                                    return true;
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Asset Name (For App) */}
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                            <Label className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-2 block">
                                                Asset Name <span className="text-error-500"> *</span>
                                            </Label>
                                            <div className="space-y-4">
                                                <div>
                                                    {/* <Label className="text-gray-600 font-semibold mb-2 block">Assets Name <span className="text-error-500">*</span></Label> */}
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
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Default Layout for Web/Cloud */}
                                        <div>
                                            <Label className="text-gray-600 font-semibold mb-2 block">Assets Name <span className="text-error-500">*</span></Label>
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

                                        {assets_type?.value === ASSETS_KEYS?.web ? (
                                            <div>
                                                <Label>Website URL <span className="text-gray-500">(Note: Domain verified after selection)</span> </Label>
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

                                                {selectedProvider == PROVIDER_KEY.AWS && (
                                                    <>
                                                        <div>
                                                            <Label>Access ID <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Access ID"
                                                                name={ASSETS_INPUTS.ACCESS_KEY.name}
                                                                rules={{ required: ASSETS_INPUTS.ACCESS_KEY.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Secret Key <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Secret Key"
                                                                name={ASSETS_INPUTS.SECRET_KEY.name}
                                                                rules={{ required: ASSETS_INPUTS.SECRET_KEY.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Region <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Region"
                                                                name={ASSETS_INPUTS.REGION.name}
                                                                rules={{ required: ASSETS_INPUTS.REGION.validation }}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {selectedProvider == PROVIDER_KEY.AZURE && (
                                                    <>
                                                        <div>
                                                            <Label>Client ID <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Client ID"
                                                                name={ASSETS_INPUTS.CLIENT_ID.name}
                                                                rules={{ required: ASSETS_INPUTS.CLIENT_ID.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Client Secret <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Client Secret"
                                                                name={ASSETS_INPUTS.CLIENT_SECRET.name}
                                                                rules={{ required: ASSETS_INPUTS.CLIENT_SECRET.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Tenant ID <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Tenant ID"
                                                                name={ASSETS_INPUTS.TENANT_ID.name}
                                                                rules={{ required: ASSETS_INPUTS.TENANT_ID.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Subscription ID <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Subscription ID"
                                                                name={ASSETS_INPUTS.SUBSCRIPTION_ID.name}
                                                                rules={{ required: ASSETS_INPUTS.SUBSCRIPTION_ID.validation }}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {selectedProvider == PROVIDER_KEY.GCP && (
                                                    <>
                                                        <div>
                                                            <Label>Project ID <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Project ID"
                                                                name={ASSETS_INPUTS.PROJECT_ID.name}
                                                                rules={{ required: ASSETS_INPUTS.PROJECT_ID.validation }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Key Filename <span className="text-error-500">*</span></Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Key Filename"
                                                                name={ASSETS_INPUTS.KEY_FILENAME.name}
                                                                rules={{ required: ASSETS_INPUTS.KEY_FILENAME.validation }}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                    </>
                                )
                            }
                        </div>
                    </TabContent>
                </div>

                <div className="border-gray-200 p-2 sm:p-4 bg-white  ">
                    <TabContent title="Contact Details">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <Label>Name </Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ASSETS_INPUTS.NAME.placeholder}
                                    name={ASSETS_INPUTS.NAME.name}
                                />
                            </div>
                            <div>
                                <Label>Email </Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.EMAIL.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.EMAIL.name}
                                />
                            </div>
                            <div>
                                <Label>Phone Number </Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.PHONE_NUMBER.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.PHONE_NUMBER.name}
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