"use client"

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import Image from "next/image";

import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import DatePicker from "../../form/date-picker";
import BasicTableOne from "../../tables/BasicTableOne";
import Select from "../../form/Select";
import { ChevronDownIcon } from "@/icons";
import { FormProvider, useForm } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";

interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    projectName: string;
    team: {
        images: string[];
    };
    status: string;
    budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
    {
        id: 1,
        user: {
            image: "/images/user/user-17.jpg",
            name: "Lindsey Curtis",
            role: "Web Designer",
        },
        projectName: "Agency Website",
        team: {
            images: [
                "/images/user/user-22.jpg",
                "/images/user/user-23.jpg",
                "/images/user/user-24.jpg",
            ],
        },
        budget: "3.9K",
        status: "Active",
    },
    {
        id: 2,
        user: {
            image: "/images/user/user-18.jpg",
            name: "Kaiya George",
            role: "Project Manager",
        },
        projectName: "Technology",
        team: {
            images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
        },
        budget: "24.9K",
        status: "Pending",
    },
    {
        id: 3,
        user: {
            image: "/images/user/user-17.jpg",
            name: "Zain Geidt",
            role: "Content Writing",
        },
        projectName: "Blog Writing",
        team: {
            images: ["/images/user/user-27.jpg"],
        },
        budget: "12.7K",
        status: "Active",
    },
    {
        id: 4,
        user: {
            image: "/images/user/user-20.jpg",
            name: "Abram Schleifer",
            role: "Digital Marketer",
        },
        projectName: "Social Media",
        team: {
            images: [
                "/images/user/user-28.jpg",
                "/images/user/user-29.jpg",
                "/images/user/user-30.jpg",
            ],
        },
        budget: "2.8K",
        status: "Cancel",
    },
    {
        id: 5,
        user: {
            image: "/images/user/user-21.jpg",
            name: "Carla George",
            role: "Front-end Developer",
        },
        projectName: "Website",
        team: {
            images: [
                "/images/user/user-31.jpg",
                "/images/user/user-32.jpg",
                "/images/user/user-33.jpg",
            ],
        },
        budget: "4.5K",
        status: "Active",
    },
];

type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export const ACCOUNT_INPUTS = {
    NAME: {
        placeholder: "Enter name",
        name: "name",
        validation: "Enter name.",
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
    GST_NO: {
        placeholder: "Enter GST number",
        name: "gst_number",
        validation: "Enter GST number.",
    },
    PAN_NO: {
        placeholder: "Enter PAN number",
        name: "pan_number",
        validation: "Enter PAN number.",
    },
    ADDITIONL_INFO: {
        placeholder: "Enter additional info",
        name: "additional_info",
        validation: "Enter additional info.",
    },

}

export default function AddPartiesComponent() {

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const [products, setProducts] = useState<Product[]>([
        { name: "Macbook Pro 13”", price: 1200, quantity: 1, discount: 0 },
        { name: "Apple Watch Ultra", price: 300, quantity: 1, discount: 50 },
        { name: "iPhone 15 Pro Max", price: 800, quantity: 2, discount: 0 },
        { name: "iPad Pro 3rd Gen", price: 900, quantity: 1, discount: 0 },
    ]);

    const [form, setForm] = useState<Product>({
        name: "",
        price: 0,
        quantity: 1,
        discount: 0,
    });

    const addProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setProducts([...products, form]);
        setForm({ name: "", price: 0, quantity: 1, discount: 0 });
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const subtotal = products.reduce((sum, p) => {
        const discountAmount = (p.price * p.discount) / 100;
        return sum + (p.price - discountAmount) * p.quantity;
    }, 0);

    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
    };

    return (
        <>
            <FormProvider {...methods}>
                <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800 bg-white">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Customer Name */}
                            <div>
                                <Label>Parties Name</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ACCOUNT_INPUTS.NAME.placeholder}
                                    name={ACCOUNT_INPUTS.NAME.name}
                                    rules={{
                                        required: ACCOUNT_INPUTS.NAME.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.NAME.pattern,
                                            message: INPUT_PATTERN.NAME.message,
                                        },
                                    }}
                                />
                            </div>

                             {/* Phone */}
                            <div className="col-span-1">
                                <Label>Phone Number</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}

                                    placeholder={ACCOUNT_INPUTS.PHONE_NUMBER.placeholder}
                                    name={ACCOUNT_INPUTS.PHONE_NUMBER.name}
                                    rules={{
                                        required: ACCOUNT_INPUTS.PHONE_NUMBER.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.MOBILE.pattern,
                                            message: INPUT_PATTERN.MOBILE.message,
                                        },
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div className="col-span-1">
                                <Label>Email</Label>
                                <Input
                                    type={INPUT_TYPE.EMAIL}
                                    placeholder={ACCOUNT_INPUTS.EMAIL.placeholder}
                                    name={ACCOUNT_INPUTS.EMAIL.name}
                                    rules={{
                                        // required: ACCOUNT_INPUTS.EMAIL.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.EMAIL.pattern,
                                            message: INPUT_PATTERN.EMAIL.message,
                                        },
                                    }}
                                />
                            </div>

 {/* GST */}
                            <div className="col-span-1">
                                <Label>GST Number</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ACCOUNT_INPUTS.GST_NO.placeholder}
                                    name={ACCOUNT_INPUTS.GST_NO.name}
                                // rules={{
                                //     required: ACCOUNT_INPUTS.GST_NO.validation,
                                // }}
                                />
                            </div>

                            {/* Address */}
                            <div className="col-span-1">
                                <Label>Customer Address</Label>
                                <TextArea
                                    placeholder={ACCOUNT_INPUTS.ADDITIONL_INFO.placeholder}
                                    name={ACCOUNT_INPUTS.ADDITIONL_INFO.name}
                                    rules={{
                                        // required: ACCOUNT_INPUTS.ADDITIONL_INFO.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.PAN_NUMBER.pattern,
                                            message: INPUT_PATTERN.PAN_NUMBER.message,
                                        },
                                    }} />
                            </div>

                            {/* PAN */}
                            <div className="col-span-1">
                                <Label>PAN Card Number</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={ACCOUNT_INPUTS.PAN_NO.placeholder}
                                    name={ACCOUNT_INPUTS.PAN_NO.name}
                                    rules={{
                                        // required: ACCOUNT_INPUTS.PAN_NO.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.PAN_NUMBER.pattern,
                                            message: INPUT_PATTERN.PAN_NUMBER.message,
                                        },
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-center m-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white rounded px-6 py-2" >
                            Submit
                        </button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}
