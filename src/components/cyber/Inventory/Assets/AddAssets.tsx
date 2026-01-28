"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useEffect, useMemo, useState } from "react";
import { TabContent } from "../AddInventory";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE, TAB_KEY } from "@/common/commonVariable";
import { useInventoryStore } from "@/store";
import { watch } from "fs";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";

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
    ADDITIONL_INFO: {
        placeholder: "Enter additional info",
        name: "additional_info",
        validation: "Enter additional info.",
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
}

export default function AddAssets({ resDomainList }: any) {

    const { assets_details, setAssetsDetails, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
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
        methods.setValue(ASSETS_INPUTS.ASSETS_NAME.name, assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name] || '');
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.id : 0 || '');
        methods.setValue(ASSETS_INPUTS.ADDITIONL_INFO.name, assets_details?.value?.[ASSETS_INPUTS.ADDITIONL_INFO.name] || '');
        methods.setValue(ASSETS_INPUTS.NAME.name, assets_details?.value?.[ASSETS_INPUTS.NAME.name] || '');
        methods.setValue(ASSETS_INPUTS.EMAIL.name, assets_details?.value?.[ASSETS_INPUTS.EMAIL.name] || '');
        methods.setValue(ASSETS_INPUTS.PHONE_NUMBER.name, assets_details?.value?.[ASSETS_INPUTS.PHONE_NUMBER.name] || '');

    }, [methods]);

    const selectList = useMemo(() => {
        return resDomainList?.map((item: any) => ({
            value: item.id,
            label: item.domain,
            status: item.status
            // <>
            //     <p>{item.domain}
            //     {/* <Badge size="sm"  variant="light" color="success">
            //         {item.status || "Pending"}
            //     </Badge> */}
            // </>
        })) || [];
    }, [resDomainList]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="Add Assets">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Assets Name */}
                            <div>
                                <Label>Assets Name</Label>
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

                            {/* Web URL */}
                            <div>
                                <Label> Web URL <span className="text-gray-500">(Note : Verified after selection)</span> </Label>

                                {/* <Input
                                    type={INPUT_TYPE?.TEXT}
                                    placeholder={ASSETS_INPUTS?.WEBSITE_URL?.placeholder}
                                    name={ASSETS_INPUTS.WEBSITE_URL.name}
                                    rules={{
                                        required: ASSETS_INPUTS.WEBSITE_URL.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.WEBSITE.pattern,
                                            message: INPUT_PATTERN.WEBSITE.message,
                                        },
                                    }}
                                /> */}

                                <Controller
                                    control={methods.control}
                                    name={ASSETS_INPUTS?.WEBSITE_URL.name}
                                    rules={{ required: ASSETS_INPUTS.WEBSITE_URL.validation }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={selectList}
                                            // options={[
                                            //     { value: "admin", label: "Admin" },
                                            // ]}
                                            placeholder="Select Option"
                                        />
                                    )}
                                />
                            </div>

                            {/* Additional Info */}
                            {/* <div className="col-span-full">
                                <Label>Additional Info</Label>
                                <TextArea
                                    className="!w-1/2"
                                    placeholder={ASSETS_INPUTS.ADDITIONL_INFO.placeholder}
                                    name={ASSETS_INPUTS.ADDITIONL_INFO.name}
                                    rules={{
                                        required: ASSETS_INPUTS.ADDITIONL_INFO.validation
                                    }}
                                    value={methods.watch(ASSETS_INPUTS.ADDITIONL_INFO.name) || ""}
                                />
                            </div> */}

                        </div>
                    </TabContent>
                    {/* </form> */}
                </div >

                <div className="border-gray-200 p-2 sm:p-4 bg-white  ">
                    <TabContent title="Contact Details">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Name */}
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ASSETS_INPUTS.NAME.placeholder}
                                    name={ASSETS_INPUTS.NAME.name}
                                    rules={{
                                        required: ASSETS_INPUTS.NAME.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.NAME.pattern,
                                            message: INPUT_PATTERN.NAME.message,
                                        },
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.EMAIL.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.EMAIL.name}
                                    rules={{
                                        required: ASSETS_INPUTS.EMAIL.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.EMAIL.pattern,
                                            message: INPUT_PATTERN.EMAIL.message,
                                        },
                                    }}
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    placeholder={ASSETS_INPUTS.PHONE_NUMBER.placeholder}
                                    type={INPUT_TYPE.TEXT}
                                    name={ASSETS_INPUTS.PHONE_NUMBER.name}
                                    rules={{
                                        required: ASSETS_INPUTS.PHONE_NUMBER.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.MOBILE.pattern,
                                            message: INPUT_PATTERN.MOBILE.message,
                                        },
                                    }}
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