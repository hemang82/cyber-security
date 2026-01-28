"use client";

import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import { FormProvider, useForm } from "react-hook-form";
import { useInventoryStore } from "@/store";
import { useEffect } from "react";
import { ASSETS_INPUTS } from "./AddAssets";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { assets } from "./AssetsTypes";
// import { getInventoryDetails } from "@/lib/server/ServerApiCall";


export default function PreviewPage({ resDomainList }: any) {

    console.log('resDomainList', resDomainList);

    const router = useRouter();
    const { assets_type, assets_details, credentials, owners, finel_validate_data, setFinelValidateData, setLoader } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const onSubmit = async (data: any) => {

        setFinelValidateData({
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
                finel_validate_data,
            }),
        });

        const res = await inventoryData.json()

        if (res.code == CODES?.SUCCESS) {
            TOAST_SUCCESS(res?.message)
            // return
            setLoader(true)
            router.push(`/Inventory-details?url=${encodeURIComponent(resDomainList?.length > 0 && resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain || '')}`);
        } else {
            TOAST_ERROR(res?.message)
        }
    };

    useEffect(() => {
        console.log("credentials store data 👉", finel_validate_data);
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, finel_validate_data?.value?.[ASSETS_INPUTS.WEBSITE_URL.name] || '');
    }, [methods]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>

                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                Preview
                            </h4>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">

                                {
                                    [
                                        {
                                            title: "Assets Type",
                                            value: assets.find((item) => item?.key === assets_type?.value)?.title
                                        },
                                        {
                                            title: "Assets Name",
                                            value: assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name]
                                        },
                                        {
                                            title: "Website URL",
                                            value: resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.domain : "N/A"

                                        },
                                        {
                                            title: "Name",
                                            value: assets_details?.value?.[ASSETS_INPUTS.NAME.name]
                                        },
                                        {
                                            title: "Email",
                                            value: assets_details?.value?.[ASSETS_INPUTS.EMAIL.name]
                                        },
                                        {
                                            title: "Phone Number",
                                            value: assets_details?.value?.[ASSETS_INPUTS.PHONE_NUMBER.name]
                                        },
                                        // {
                                        //     title: "Credentials - Website URL",
                                        //     value: credentials?.value?.[ASSETS_INPUTS.WEBSITE_URL.name]
                                        // },
                                        {
                                            title: "Owners - Name",
                                            value: owners?.value?.[ASSETS_INPUTS.OWNER.name]
                                        },
                                    ].map((data, index) => {
                                        return <div key={index}>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                {data.title}
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {data.value}
                                            </p>
                                        </div>
                                    })
                                }

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