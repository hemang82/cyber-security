"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { ASSETS_INPUTS } from "../Inventory/Assets/AddAssets";

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

    const methods = useForm({ mode: "onBlur" });

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

    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
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
                        <div>
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
                        </div>

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