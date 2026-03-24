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
import { CODES } from "@/common/constant";
import { TOAST_ERROR } from "@/common/commonFunction";
import { BoltIcon, CalenderIcon, InfoIcon } from "@/icons";
import Radio from "@/components/form/input/Radio";
import DatePicker from "@/components/form/date-picker";
import MUIDatePicker from "@/components/common/MUIDatePicker";
import moment from "moment";

export const SCAN_PURPOSE = {
    MANUAL: "manual_scan",
    AUTOMATED: "automated_scan"
};

export const SCAN_TYPE = {
    QUICK: "quick_scan",
    DEEP: "deep_scan"
};

export const SCAN_PURPOSE_OPTIONS = [
    { label: "Manual Scan", value: SCAN_PURPOSE.MANUAL, icon: <BoltIcon className="size-4" /> },
    { label: "Automated Scan", value: SCAN_PURPOSE.AUTOMATED, icon: <CalenderIcon className="size-4" /> }
];

export const SCAN_TYPE_OPTIONS = [
    { label: "Quick Scan", value: SCAN_TYPE.QUICK },
    { label: "Deep Scan", value: SCAN_TYPE.DEEP }
];

export default function AddAssets({ resInventoryList }: any) {

    const { assets_type, assets_details, setAssetsDetails, setActiveTab, setLoader, resetInventory } = useInventoryStore();
    const router = useRouter();
    const methods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange"
    });
    const selectedProvider = methods.watch(ASSETS_INPUTS.PROVIDER.name);

    const [selectedOption, setSelectedOption] = useState<any>({});

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
                    const fileName = metadata?.app_file_name;

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

    const onSubmit = (data: any) => {
        setAssetsDetails({
            value: {
                data,
                selectedOption
            },
            is_valid: true,
        });

        // Pass to Preview tab instead of calling API directly
        setActiveTab(TAB_KEY.PREVIEW);
    };

    useEffect(() => {
        if (assets_details?.value?.data) {
            const formData = assets_details.value.data;

            // Restore all form fields
            Object.keys(formData).forEach(key => {
                methods.setValue(key, formData[key]);
            });

            // Restore selectedOption for UI metadata display
            const assetId = formData[ASSETS_INPUTS.ASSETS_NAME.name];
            if (assetId) {
                const match = selectList.find((opt: any) => opt.value == assetId);
                if (match) {
                    setSelectedOption(match);
                }
            }
        }
    }, [methods, assets_details, selectList]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    <TabContent >
                        <div className="flex flex-col gap-10">

                            {/* Section 2: Asset Assignment */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <div className="p-1.5 bg-brand-50 dark:bg-brand-900/20 rounded text-brand-600">
                                        <InfoIcon className="size-4" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">Asset Details</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-1 md:w-1/2">
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
                                                        const selectedOpt = selectList.find((opt: any) => opt.value == value);
                                                        field.onChange(value);
                                                        setSelectedOption(selectedOpt)
                                                        if (selectedOpt) {
                                                            methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, selectedOpt.website_url);
                                                            methods.setValue('inventory_id', selectedOpt.inventory_id);
                                                            let metadata = selectedOpt?.full_data?.metadata;
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

                                    {(assets_type?.value === ASSETS_KEYS?.web) ? (
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
                                            {methods.watch(ASSETS_INPUTS.ASSETS_NAME.name) && (
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
                                            )}
                                            {selectedProvider == PROVIDER_KEY.AWS && (
                                                <>
                                                    <div><Label>Access ID <span className="text-error-500">*</span></Label><Input type="text" placeholder="Access ID" name={ASSETS_INPUTS.ACCESS_KEY.name} disabled /></div>
                                                    <div><Label>Secret Key <span className="text-error-500">*</span></Label><Input type="text" placeholder="Secret Key" disabled name={ASSETS_INPUTS.SECRET_KEY.name} /></div>
                                                    <div><Label>Region <span className="text-error-500">*</span></Label><Input type="text" placeholder="Region" name={ASSETS_INPUTS.REGION.name} disabled /></div>
                                                </>
                                            )}
                                            {selectedProvider == PROVIDER_KEY.AZURE && (
                                                <>
                                                    <div><Label>Client ID <span className="text-error-500">*</span></Label><Input type="text" placeholder="Client ID" name={ASSETS_INPUTS.CLIENT_ID.name} disabled /></div>
                                                    <div><Label>Client Secret <span className="text-error-500">*</span></Label><Input type="text" placeholder="Client Secret" name={ASSETS_INPUTS.CLIENT_SECRET.name} disabled /></div>
                                                    <div><Label>Tenant ID <span className="text-error-500">*</span></Label><Input type="text" placeholder="Tenant ID" name={ASSETS_INPUTS.TENANT_ID.name} disabled /></div>
                                                    <div><Label>Subscription ID <span className="text-error-500">*</span></Label><Input type="text" placeholder="Subscription ID" name={ASSETS_INPUTS.SUBSCRIPTION_ID.name} disabled /></div>
                                                </>
                                            )}
                                            {selectedProvider == PROVIDER_KEY.GCP && (
                                                <>
                                                    <div><Label>Project ID <span className="text-error-500">*</span></Label><Input type="text" placeholder="Project ID" name={ASSETS_INPUTS.PROJECT_ID.name} disabled /></div>
                                                    <div><Label>Key Filename <span className="text-error-500">*</span></Label><Input type="text" placeholder="Key Filename" name={ASSETS_INPUTS.KEY_FILENAME.name} disabled /></div>
                                                </>
                                            )}
                                        </>
                                    ) : assets_type?.value === ASSETS_KEYS?.app ? (
                                        <>
                                            <div>
                                                <Label>Platform</Label>
                                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                    {(selectedOption?.full_data?.tags || selectedOption?.full_data?.platform) == 'android' ? (
                                                        <svg viewBox="0 0 512 512" height="16" width="16" className="text-brand-600"><path fill="currentColor" d="M176.4 468.1h-43.2l-.2-65.7h43.4v65.7zm159.2 0h-43.2l-.2-65.7h43.4v65.7zM89.1 213.6c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zm333.8 0c-23.9 0-43.2 19.3-43.2 43.1v100.8c0 23.9 19.3 43.1 43.2 43.1s43.2-19.3 43.2-43.1V256.7c0-23.8-19.3-43.1-43.2-43.1zM113.3 170.4h285.4v187.7c0 23.9-19.3 43.1-43.2 43.1H156.5c-23.9 0-43.2-19.3-43.2-43.1V170.4zm228-76.3l31.5-39.3c5.3-6.6 4.3-16.3-2.3-21.6-6.6-5.3-16.3-4.3-21.6 2.3l-34.5 43c-18.7-7.8-39.4-12.1-61.2-12.1s-42.5 4.3-61.2 12.1l-34.5-43c-5.3-6.6-15-7.6-21.6-2.3-6.6 5.3-7.6 15-2.3 21.6l31.5 39.3c-28.5 17.1-48.4 46.5-52.6 81.1h281.3c-4.1-34.5-24-64-52.5-81.1z" /></svg>
                                                    ) : (
                                                        <svg viewBox="0 0 384 512" height="16" width="16" className="text-black"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                                                    )}
                                                    <span className="text-md font-semibold text-gray-800 dark:text-white capitalize">
                                                        {selectedOption?.full_data?.tags || selectedOption?.full_data?.platform || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>App File</Label>
                                                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                                    <span className="text-md font-semibold text-gray-800 dark:text-white truncate block">
                                                        {selectedOption?.full_data?.metadata?.file_path || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>

                            {/* Section 1: Scan Strategy */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <div className="p-1.5 bg-brand-50 dark:bg-brand-900/20 rounded text-brand-600">
                                        <BoltIcon className="size-4" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">Scan Configuration
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-1 md:w-1/2">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-bold uppercase text-gray-400 block">Choose Scan Purpose</Label>
                                        <div className="flex flex-row gap-4">
                                            <Controller
                                                control={methods.control}
                                                name="purpose"
                                                defaultValue={SCAN_PURPOSE.MANUAL}
                                                render={({ field }) => (
                                                    <>
                                                        {SCAN_PURPOSE_OPTIONS.map((opt) => (
                                                            <div
                                                                key={opt.value}
                                                                onClick={() => field.onChange(opt.value)}
                                                                className={`cursor-pointer flex-1 p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${field.value === opt.value
                                                                    ? "border-brand-500 bg-brand-50/40 dark:bg-brand-900/10 shadow-lg shadow-brand-500/5 scale-[1.02]"
                                                                    : "border-transparent bg-gray-50/50 dark:bg-gray-800/10 hover:bg-gray-100/50 dark:hover:bg-gray-800/20"
                                                                    }`}
                                                            >
                                                                <div className={`p-2 rounded-xl border transition-all ${field.value === opt.value ? "bg-brand-500 text-white border-brand-400 shadow-sm" : "bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700"}`}>
                                                                    {opt.icon}
                                                                </div>
                                                                <div>
                                                                    <h5 className={`text-sm font-bold leading-tight ${field.value === opt.value ? "text-brand-700 dark:text-brand-300" : "text-gray-600 dark:text-gray-400"}`}>
                                                                        {opt.label.split(' ')[0]}
                                                                    </h5>
                                                                    <p className="text-[10px] text-gray-400 font-medium">Click to select</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-bold uppercase text-gray-400 block">Select Scan Depth</Label>
                                        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <Controller
                                                control={methods.control}
                                                name="scan_type"
                                                defaultValue={SCAN_TYPE.QUICK}
                                                render={({ field }) => (
                                                    <div className="flex flex-col gap-4">
                                                        {SCAN_TYPE_OPTIONS.map((opt) => (
                                                            <div key={opt.value} className="flex items-start gap-3 group cursor-pointer" onClick={() => field.onChange(opt.value)}>
                                                                <Radio
                                                                    id={opt.value}
                                                                    name="scan_type"
                                                                    value={opt.value}
                                                                    checked={field.value === opt.value}
                                                                    onChange={(val) => field.onChange(val)}
                                                                    label=""
                                                                />
                                                                <div className="flex-1 -mt-1">
                                                                    <h6 className={`text-sm font-bold transition-colors ${field.value === opt.value ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>{opt.label}</h6>
                                                                    <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-relaxed">
                                                                        {opt.value === SCAN_TYPE.QUICK
                                                                            ? "Focused on high-priority vulnerabilities."
                                                                            : "In-depth investigative scan for all vectors."}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {methods.watch("purpose") === SCAN_PURPOSE.AUTOMATED && (
                                        <div className="md:col-span-1 animate-fadeIn mt-2">
                                            {/* <div className="flex items-center gap-2 mb-3">
                                                <Label className="mb-0 text-sm font-bold text-gray-700 dark:text-gray-300">Schedule Start Time <span className="text-error-500">*</span></Label>
                                            </div> */}
                                            <Controller
                                                control={methods.control}
                                                name="time_slot"
                                                rules={{ required: "Time slot is required" }}
                                                render={({ field }) => (
                                                    <MUIDatePicker
                                                        label="Schedule Start Time"
                                                        value={field.value}
                                                        onChange={(formatted) => field.onChange(formatted)}
                                                        minDate={new Date()}
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>


                        </div>
                    </TabContent>
                </div>

                <div className="flex justify-center m-4 pb-10">
                    <button type="submit" className="px-10 py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-xl shadow-brand-500/20 transition-all flex items-center gap-2">
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider>
    </>)
}