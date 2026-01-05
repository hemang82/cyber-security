"use client"

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useState } from "react";
import { TabContent } from "../AddInventory";
import { useForm, FormProvider } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";

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
    }
}

export default function AddAssets() {

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

    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
    };

    console.log('methods', methods.formState.errors);

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
                                <Label>Web URL</Label>
                                <Input
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
                                />
                            </div>

                            {/* Additional Info */}
                            <div className="col-span-full">
                                <Label>Additional Info</Label>
                                <TextArea placeholder="Additional Info" className="!w-1/2" />
                            </div>

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
                                <Input type="text" placeholder="Name" />
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input type="email" placeholder="Email" />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <Label>Phone Number</Label>
                                <Input type="text" placeholder="Phone Number" />
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