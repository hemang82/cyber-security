"use client"

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import DatePicker from "../form/date-picker";
import BasicTableOne from "../tables/BasicTableOne";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

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

export default function AddSalesComponent() {

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
            <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800 bg-white  ">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Invoice Number */}
                        <div>
                            <Label>Invoice Number</Label>
                            <Input type="text" placeholder="Invoice Number" />
                        </div>

                        {/* Customer Name */}
                        <div>
                            <Label>Customer Name</Label>
                            <Input type="text" placeholder="Customer Name" />
                        </div>

                        {/* Issue Date */}
                        <div>
                            <DatePicker
                                id="date-picker"
                                label="Date Picker"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                }}
                            />
                        </div>

                        {/* Due Date */}
                        <div>
                            <DatePicker
                                id="date-picker"
                                label="Due Date"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    // Handle your logic
                                    console.log({ dates, currentDateString });
                                }}
                            />
                        </div>

                        {/* Address */}
                        <div className="col-span-full">
                            <Label>Customer Address</Label>
                            <TextArea placeholder="Customer Address" />
                        </div>

                        {/* Additional Info */}
                        <div className="col-span-full">
                            <Label>Additional Info</Label>
                            <TextArea placeholder="Additional Info" />
                        </div>

                    </div>
                </form>
            </div>

            <div className="border-b border-gray-200 p-4 sm:p-8 bg-white  ">

                <BasicTableOne />

                {/* ADD PRODUCT */}
                <form onSubmit={addProduct} className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded-xl">
                    {/* <input
                        required
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border rounded px-3 py-2 md:col-span-2"
                    /> */}
                    <Input type="text" placeholder="Product Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />


                    <Input type="number" placeholder="Price" onChange={(e) => setForm({ ...form, name: e.target.value })} />

                    <Input type="number" placeholder="Quantity" onChange={(e) => setForm({ ...form, name: e.target.value })} />

                    <div>
                        <div className="relative">
                            <Select
                                options={[
                                    { value: "0", label: "0%" },
                                    { value: "10", label: "20%" },
                                    { value: "50", label: "50%" },
                                ]}
                                placeholder="GST Rate"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition  cursor-pointer"
                    >
                        Save
                    </button>
                </form>

                {/* SUMMARY */}
                <div className="mt-6 max-w-sm ml-auto space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Sub Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT (10%)</span>
                        <span>${vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
