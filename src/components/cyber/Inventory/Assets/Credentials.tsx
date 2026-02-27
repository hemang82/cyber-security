"use client";

import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import Input from "@/components/form/input/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { ASSETS_INPUTS } from "./AddAssets";
import { INPUT_PATTERN, TAB_KEY } from "@/common/commonVariable";
import { useInventoryStore } from "@/store";
import { useEffect } from "react";


export default function Credentials() {

    const { credentials, setCredentials, setActiveTab } = useInventoryStore();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
        // return
        setCredentials({
            value: data,
            is_valid: true,
        })
        setActiveTab(TAB_KEY.OWNERS);
    };

    useEffect(() => {
        console.log("credentials store data 👉", credentials);
        methods.setValue(ASSETS_INPUTS.PROVIDER.name, credentials?.value?.[ASSETS_INPUTS.PROVIDER.name] || '');
        methods.setValue(ASSETS_INPUTS.ACCESS_KEY.name, credentials?.value?.[ASSETS_INPUTS.ACCESS_KEY.name] || '');
        methods.setValue(ASSETS_INPUTS.SECRET_KEY.name, credentials?.value?.[ASSETS_INPUTS.SECRET_KEY.name] || '');
        methods.setValue(ASSETS_INPUTS.REGION.name, credentials?.value?.[ASSETS_INPUTS.REGION.name] || '');
    }, [methods, credentials]);

    return (<>
        <FormProvider {...methods}>
            <form className=" " onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    {/* <form className="space-y-6"> */}
                    <TabContent title="">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <Label>Provider</Label>
                                <Input type="text"
                                    placeholder="Provider"
                                    name={ASSETS_INPUTS.PROVIDER.name}
                                    rules={{
                                        required: ASSETS_INPUTS.PROVIDER.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.NAME.pattern,
                                        //     message: INPUT_PATTERN.NAME.message,
                                        // },
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Access ID</Label>
                                <Input type="text"
                                    placeholder="Access ID"
                                    name={ASSETS_INPUTS.ACCESS_KEY.name}
                                    rules={{
                                        required: ASSETS_INPUTS.ACCESS_KEY.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.NAME.pattern,
                                        //     message: INPUT_PATTERN.NAME.message,
                                        // },
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Secret Key</Label>
                                <Input type="text"
                                    placeholder="Secret Key"
                                    name={ASSETS_INPUTS.SECRET_KEY.name}
                                    rules={{
                                        required: ASSETS_INPUTS.SECRET_KEY.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.NAME.pattern,
                                        //     message: INPUT_PATTERN.NAME.message,
                                        // },
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Region</Label>
                                <Input type="text"
                                    placeholder="Region"
                                    name={ASSETS_INPUTS.REGION.name}
                                    rules={{
                                        required: ASSETS_INPUTS.REGION.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.NAME.pattern,
                                        //     message: INPUT_PATTERN.NAME.message,
                                        // },
                                    }}
                                />
                            </div>
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