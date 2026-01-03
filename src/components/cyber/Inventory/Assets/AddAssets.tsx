"use client"

import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { ChevronDownIcon } from "@/icons";
import { useState } from "react";
import { TabContent } from "../AddInventory";

type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export default function AddAssets() {

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

    return (<>
        <form className=" ">

            <div className="p-2 sm:p-4 dark:border-gray-800 bg-white  ">
                {/* <form className="space-y-6"> */}
                <TabContent title="Add Assets">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Assets Name */}
                        <div>
                            <Label>Assets Name</Label>
                            <Input type="text" placeholder="Assets Name" />
                        </div>

                        {/* Web URL */}
                        <div>
                            <Label>Web URL</Label>
                            <Input type="text" placeholder="Web URL" />
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

    </>)
}