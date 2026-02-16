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
import { useRouter } from "next/navigation";

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
}

export default function AddAssets({ resDomainList }: any) {

    const { assets_details, setAssetsDetails, setActiveTab, setLoader } = useInventoryStore();
    const router = useRouter();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const [products, setProducts] = useState<Product[]>([
        { name: "Macbook Pro 13”", price: 1200, quantity: 1, discount: 0 },
        { name: "Apple Watch Ultra", price: 300, quantity: 1, discount: 50 },
        { name: "iPhone 15 Pro Max", price: 800, quantity: 2, discount: 0 },
        { name: "iPad Pro 3rd Gen", price: 900, quantity: 1, discount: 0 },
    ]);

    const [selectedOption, setSelectedOption] = useState<any>({});

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

        console.log('selectedOption', selectedOption);

        setLoader(true)
        // @ts-ignore
        router.push(selectedOption?.website_url ? `/asset-details?url=${encodeURIComponent(selectedOption?.website_url || 'N/A')}&inventory_id=${data?.inventory_id}` : '');
    };

    useEffect(() => {
        methods.setValue(ASSETS_INPUTS.ASSETS_NAME.name, assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name] || '');
        methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, resDomainList?.length > 0 ? resDomainList?.find((item: any) => item.id == assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])?.id : 0 || '');
        // methods.setValue(ASSETS_INPUTS.DESCRIPTION.name, assets_details?.value?.[ASSETS_INPUTS.DESCRIPTION.name] || '');
        // methods.setValue(ASSETS_INPUTS.NAME.name, assets_details?.value?.[ASSETS_INPUTS.NAME.name] || '');
        // methods.setValue(ASSETS_INPUTS.EMAIL.name, assets_details?.value?.[ASSETS_INPUTS.EMAIL.name] || '');
        // methods.setValue(ASSETS_INPUTS.PHONE_NUMBER.name, assets_details?.value?.[ASSETS_INPUTS.PHONE_NUMBER.name] || '');

    }, [methods, assets_details, resDomainList]);

    // const selectList = useMemo(() => {
    //     return resDomainList?.map((item: any) => ({
    //         value: item.id,
    //         label: item.name,
    //         // <>
    //         //     <p>{item.domain}
    //         //     {/* <Badge size="sm"  variant="light" color="success">
    //         //         {item.status || "Pending"}
    //         //     </Badge> */}
    //         // </>
    //     })) || [];
    // }, [resDomainList]);

    const selectList = useMemo(() => {
        return (resDomainList?.filter((item: any) => item.type === 'web_app').map((item: any) => ({
            value: item.id,
            inventory_id: item.id,
            website_url: item.url,
            label: item.name,
        })) || []
        );
    }, [resDomainList]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="Add Scan">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/*Assets Name */}
                            <div>
                                <Label>Assets Name</Label>
                                {/* <Controller
                                    control={methods.control}
                                    name={ASSETS_INPUTS?.ASSETS_NAME.name}
                                    rules={{ required: ASSETS_INPUTS.ASSETS_NAME.validation }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={selectList}
                                            // options={[
                                            //     { value: "admin", label: "Admin" },
                                            // ]}
                                            placeholder="Select Option"
                                            onChange={(value) => {
                                                console.log("value", value);
                                                methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, value);
                                                methods.setValue(ASSETS_INPUTS.WEBSITE_URL.name, inventory_id);

                                            }}
                                        />
                                    )}
                                /> */}
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
                                                    // 3️⃣ Set inventory_id from option
                                                    methods.setValue(
                                                        'inventory_id',
                                                        selectedOption.inventory_id
                                                    );
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {/* Assets Name */}
                            <div>
                                <Label>Website URL</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    disabled={true}
                                    placeholder={ASSETS_INPUTS.WEBSITE_URL.placeholder}
                                    name={ASSETS_INPUTS.WEBSITE_URL.name}
                                    rules={{
                                        required: ASSETS_INPUTS.WEBSITE_URL.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.URL.pattern,
                                        //     message: INPUT_PATTERN.NAME.message,
                                        // },
                                    }}
                                />
                            </div>

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

            </form>
        </FormProvider>
    </>)
}