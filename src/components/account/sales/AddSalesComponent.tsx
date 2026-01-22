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



type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export default function AddSalesComponent() {

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
                <form className="space-y-6">
                    <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800 bg-white">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Invoice Number */}
                            <div className="flex flex-row gap-2">
                                <div className="w-full">
                                    <Label>Invoice Number</Label>
                                    <Input
                                        type="text"
                                        placeholder="Invoice Number"
                                        name="invoice_number"
                                        rules={{
                                            required: "Invoice number is required",
                                            pattern: {
                                                value: /^[A-Za-z0-9 ]{3,50}$/,
                                                message: "Only letters & numbers (3–50 chars)",
                                            },
                                        }}
                                    />
                                </div>
                                {/* Issue Date */}
                                <div className="w-full">
                                    <DatePicker
                                        id="date-picker"
                                        label="Date"
                                        placeholder="Select a date"
                                        onChange={(dates, currentDateString) => {
                                            // Handle your logic
                                            console.log({ dates, currentDateString });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Customer Name */}
                            <div>
                                <Label>Customer Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Customer Name"
                                    name="customer_name"
                                    rules={{
                                        required: "Customer name is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9 ]{3,50}$/,
                                            message: "Only letters & numbers (3–50 chars)",
                                        },
                                    }}
                                />
                            </div>

                            {/* Address */}
                            <div className="col-span-1">
                                <Label>Customer Address</Label>
                                <TextArea placeholder="Customer Address" name="address"  />
                            </div>

                            {/* Additional Info */}
                            <div className="col-span-1">
                                <Label>Additional Info</Label>
                                <TextArea placeholder="Additional Info"  name="additionl"/>
                            </div>

                        </div>
                        {/*  */}
                    </div>

                    <div className="border-b border-gray-200 p-4 sm:p-8 bg-white">
                        {/* TABLE */}
                        {/* <div className="overflow-x-auto rounded-xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {["S.No", "Product", "Qty", "Unit Cost", "Discount", "Total", ""].map(h => (
                                    <th key={h} className="px-5 py-3 text-left font-medium text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((p, i) => {
                                const discounted = p.price - (p.price * p.discount) / 100;
                                return (
                                    <tr key={i}>
                                        <td className="px-5 py-3">{i + 1}</td>
                                        <td className="px-5 py-3 font-medium">{p.name}</td>
                                        <td className="px-5 py-3">{p.quantity}</td>
                                        <td className="px-5 py-3">${p.price}</td>
                                        <td className="px-5 py-3">{p.discount}%</td>
                                        <td className="px-5 py-3">
                                            ${(discounted * p.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => removeProduct(i)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div> */}

                        <BasicTableOne />
                        {/* ADD PRODUCT */}
                        {/* <form onSubmit={addProduct} className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded-xl"> */}
                        <Input type="text" placeholder="Product Name" name="p_name" onChange={(e) => setForm({ ...form, name: e.target.value })} />


                        <Input type="number" placeholder="Price" name="p_price" onChange={(e) => setForm({ ...form, name: e.target.value })} />

                        <Input type="number" placeholder="Quantity" name="p_qty" onChange={(e) => setForm({ ...form, name: e.target.value })} />

                        <div>
                            <div className="relative">
                                <Select
                                    options={[
                                        { value: "0", label: "0%" },
                                        { value: "10", label: "20%" },
                                        { value: "50", label: "50%" },
                                    ]}
                                    name="gst"
                                    placeholder="Select GST Option"
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
                        {/* </form> */}

                        {/* SUMMARY */}
                        <div className="mt-6 max-w-sm ml-auto space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Sub Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Additional Charge</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (10%)</span>
                                <span>${vat.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Amount</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}
