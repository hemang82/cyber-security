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

export default function AddBankAccount() {

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

    return (
        <>
            <FormProvider {...methods}>
                <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800 bg-white">

                    <form className="space-y-6">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/*Bank Name */}
                            <div>
                                <Label>Bank Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Bank Name"
                                    name="bank_name1"
                                    rules={{
                                        required: "Bank Name is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>

                            {/*Branch */}
                            <div>
                                <Label>Branch</Label>
                                <Input
                                    type="text"
                                    placeholder="Branch"
                                    name="bank_name2"
                                    rules={{
                                        required: "Branch is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>

                            {/*Account Holder Name */}
                            <div>
                                <Label>Account Holder Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Account Holder Name"
                                    name="bank_name3"
                                    rules={{
                                        required: "Account Holder Name name is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>
                            {/*Account Number */}
                            <div>
                                <Label>Account Number</Label>
                                <Input
                                    type="text"
                                    placeholder="Account Number"
                                    name="bank_name4"
                                    rules={{
                                        required: "Account Number is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>

                            {/*IFSC Code */}
                            <div>
                                <Label>IFSC Code</Label>
                                <Input
                                    type="text"
                                    placeholder="IFSC Code"
                                    name="bank_name5"
                                    rules={{
                                        required: "IFSC Code is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </FormProvider>
        </>
    );
}
