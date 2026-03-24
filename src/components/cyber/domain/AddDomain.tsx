"use client"

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { useRouter } from "next/navigation";
import { CODES } from "@/common/constant";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { Skeleton } from "@/components/common/Skeleton";

export const DOMAIN_INPUTS = {
    DOMAIN_URL: {
        placeholder: "Enter domain url",
        name: "domain_url",
        validation: "Enter domain url.",
    },
}

export default function AddDomain({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const methods = useForm({ mode: "onBlur" });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/domain/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    domain: data[DOMAIN_INPUTS.DOMAIN_URL.name]
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const res: any = await response.json();

            if (res?.code === CODES?.SUCCESS) {
                TOAST_SUCCESS("Domain added successfully");
                if (onSuccess) {
                    onSuccess();
                }
                router.refresh();
            } else {
                TOAST_ERROR(res?.message || "Something went wrong");
            }

        } catch (error: any) {
            console.error("Add domain error:", error);
            TOAST_ERROR(error?.message || "Request failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="flex justify-center mt-10">
                    <button type="submit" className="px-10 py-3 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-xl shadow-brand-500/20 transition-all flex items-center gap-2" >
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className=" dark:border-gray-800 bg-white  ">
                    <div className="grid grid-cols-1 gap-5 ">
                        <div>
                            <Label>Add Domain <span className="text-red-500">*</span></Label>
                            <Input
                                type={INPUT_TYPE.TEXT}
                                placeholder={DOMAIN_INPUTS.DOMAIN_URL.placeholder}
                                name={DOMAIN_INPUTS.DOMAIN_URL.name}
                                rules={{
                                    required: DOMAIN_INPUTS.DOMAIN_URL.validation,
                                    pattern: {
                                        value: INPUT_PATTERN.WEBSITE.pattern,
                                        message: INPUT_PATTERN.WEBSITE.message,
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div >

                <div className="flex justify-center mt-10">
                    <button type="submit" className="px-10 py-3 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-xl shadow-brand-500/20 transition-all flex items-center gap-2" >
                        Submit
                    </button>
                </div>
            </form>
        </FormProvider >
    );
}