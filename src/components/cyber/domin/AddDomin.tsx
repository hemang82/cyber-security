"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { ASSETS_INPUTS } from "../Inventory/Assets/AddAssets";
import { useRouter } from "next/navigation";

import { CODES } from "@/common/constant";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { useInventoryStore } from "@/store";

type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export const DOMIN_INPUTS = {
    DOMIN_URL: {
        placeholder: "Enter domin url",
        name: "domin_url",
        validation: "Enter domin url.",
    },
    TXT_RECORD: {
        placeholder: "Enter TXT Record",
        name: "txt_record",
        validation: "Enter TXT Record.",
    }
}

export default function AddDomin() {
    const router = useRouter();

    const { setLoader } = useInventoryStore();

    const methods = useForm({ mode: "onBlur" });

    const onSubmit = async (data: any) => {
        setLoader(true);

        try {
            const response = await fetch("/api/domain/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    domain: data[DOMIN_INPUTS.DOMIN_URL.name]
                }),
            });

            // Optional: check HTTP status first
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const res: any = await response.json();

            if (res?.code === CODES?.SUCCESS) {
                TOAST_SUCCESS("Domain added successfully");
                router.push(`/domain`);
            } else {
                TOAST_ERROR(res?.message || "Something went wrong");
            }

        } catch (error: any) {
            console.error("Add domain error:", error);
            TOAST_ERROR(error?.message || "Request failed");
        } finally {
            setLoader(false);
        }
    };


    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Assets Name */}
                        <div>
                            <Label>Add Domin</Label>
                            <Input
                                type={INPUT_TYPE.TEXT}
                                placeholder={DOMIN_INPUTS.DOMIN_URL.placeholder}
                                name={DOMIN_INPUTS.DOMIN_URL.name}
                                rules={{
                                    required: DOMIN_INPUTS.DOMIN_URL.validation,
                                    pattern: {
                                        value: INPUT_PATTERN.WEBSITE.pattern,
                                        message: INPUT_PATTERN.WEBSITE.message,
                                    },
                                }}
                            />
                        </div>

                        {/* Web URL */}
                        {/* <div>
                            <Label>TXT Record (Auto Genrate)</Label>
                            <Input
                                type={INPUT_TYPE?.TEXT}
                                placeholder={DOMIN_INPUTS?.TXT_RECORD?.placeholder}
                                name={DOMIN_INPUTS.TXT_RECORD.name}
                                defaultValue={"asfghjkl1234567890qwertyuiop"}
                                rules={{
                                    required: DOMIN_INPUTS.TXT_RECORD.validation,
                                }}
                                disabled={true}
                            />
                        </div> */}

                    </div>
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