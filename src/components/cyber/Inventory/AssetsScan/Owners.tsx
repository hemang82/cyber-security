"use client";

import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ASSETS_INPUTS } from "./AddAssets";
import { INPUT_PATTERN, TAB_KEY } from "@/common/commonVariable";
import { useInventoryStore } from "@/store";
import { useEffect } from "react";


export default function Owners() {

    const { owners, setOwners, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const onSubmit = (data: any) => {
        console.log("Owners FORM DATA 👉", data);
        setOwners({
            value: data,
            is_valid: true,
        })
        setActiveTab(TAB_KEY.PREVIEW);
    };

    useEffect(() => {
        if (owners?.value?.[ASSETS_INPUTS.OWNER.name]) {
            methods.reset({
                [ASSETS_INPUTS.OWNER.name]:
                    owners.value[ASSETS_INPUTS.OWNER.name],
            });
        }
    }, [owners, methods]);

    return (<>
        <FormProvider {...methods}>
            <form className="" onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    <div className="relative w-1/2">
                        <Controller
                            control={methods.control}
                            name={ASSETS_INPUTS.OWNER.name}
                            rules={{ required: ASSETS_INPUTS.OWNER.validation }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={[
                                        { value: "admin", label: "Admin" },
                                    ]}
                                    placeholder="Select Option"
                                />
                            )}
                        />

                        {/* <Select
                            options={[
                                { value: "0", label: "1" },
                                { value: "10", label: "2" },
                                { value: "50", label: "3" },
                            ]}
                            placeholder="Select Option"
                            className="dark:bg-dark-900 "
                            name={ASSETS_INPUTS.OWNER.name}
                            onChange={handleSelectChange}
                            rules={{
                                required: ASSETS_INPUTS.OWNER.validation,
                            }}

                        /> */}
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
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