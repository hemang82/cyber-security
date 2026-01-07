"use client";

import Label from "@/components/form/Label";
import { TabContent } from "../AddInventory";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { FormProvider, useForm } from "react-hook-form";


export default function Owners() {

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    return (<>
        <FormProvider {...methods}>
            <form className=" ">
                <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                    <div className="relative w-1/2">
                        <Select
                            options={[
                                { value: "0", label: "1" },
                                { value: "10", label: "2" },
                                { value: "50", label: "3" },
                            ]}
                            placeholder="Select Option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900 "
                        />
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