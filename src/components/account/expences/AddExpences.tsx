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
import { Controller, FormProvider, useForm } from "react-hook-form";
import { INPUT_PATTERN, INPUT_TYPE } from "@/common/commonVariable";
import { TOAST_SUCCESS } from "@/common/commonFunction";
import { useRouter } from "next/navigation";
import { addExpenseAPI, editExpenseAPI } from "@/lib/apiManager/APICalling/AccountAPI";

export interface SubmitExpenseRequest {
    invoice_number: string;
    date: string;              // consider Date type if you parse it
    vc_type: string;
    vc_number: string;
    document_number: string;
    document_date: string;     // consider Date type if you parse it
    taxable: number;           // numeric field
    IGST: number;              // numeric field
    CGST: number;              // numeric field
    SGST: number;              // numeric field
    TAX: number;               // numeric field
    party: string;             // party id or name
    expense_id?: string;       // optional, only for edit
}

type Product = {
    name: string;
    price: number;
    quantity: number;
    discount: number;
};

export const EXPENCE_INPUTS = {
    INVOICE_NUMBER: {
        placeholder: "Enter invoice number",
        name: "invoice_number",
        validation: "Invoice number is required.",
    },
    DATE: {
        placeholder: "Select date",
        name: "date",
        validation: "Date is required.",
    },
    VC_TYPE: {
        placeholder: "Enter voucher type",
        name: "vc_type",
        validation: "Voucher type is required.",
    },
    VC_NUMBER: {
        placeholder: "Enter voucher number",
        name: "vc_number",
        validation: "Voucher number is required.",
    },
    DOCUMENT_NUMBER: {
        placeholder: "Enter document number",
        name: "document_number",
        validation: "Document number is required.",
    },
    DOCUMENT_DATE: {
        placeholder: "Select document date",
        name: "document_date",
        validation: "Document date is required.",
    },
    TAXABLE: {
        placeholder: "Enter taxable amount",
        name: "taxable",
        validation: "Taxable amount is required.",
    },
    IGST: {
        placeholder: "Enter IGST amount",
        name: "IGST",
        validation: "IGST amount is required.",
    },
    CGST: {
        placeholder: "Enter CGST amount",
        name: "CGST",
        validation: "CGST amount is required.",
    },
    SGST: {
        placeholder: "Enter SGST amount",
        name: "SGST",
        validation: "SGST amount is required.",
    },
    TAX: {
        placeholder: "Enter total tax",
        name: "TAX",
        validation: "Total tax is required.",
    },
    PARTY: {
        placeholder: "Select Party",
        name: "party",
        validation: "Party is required.",
    },
};

export default function AddExpences({ partyList }: any) {

    const router = useRouter();

    const methods = useForm({
        mode: "onBlur", // validation timing
    });

    const vcTypes = [
        { value: "sales", label: "Sales" },
        { value: "purchase", label: "Purchase " },
        { value: "service", label: "Service" },
    ]

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

    const onSubmit = async (data: any) => {
        console.log("FORM DATA 👉", data);

        let submitReq: SubmitExpenseRequest = {
            invoice_number: data[EXPENCE_INPUTS.INVOICE_NUMBER.name],
            date: data[EXPENCE_INPUTS.DATE.name],
            vc_type: data[EXPENCE_INPUTS.VC_TYPE.name],
            vc_number: data[EXPENCE_INPUTS.VC_NUMBER.name],
            document_number: data[EXPENCE_INPUTS.DOCUMENT_NUMBER.name],
            document_date: data[EXPENCE_INPUTS.DOCUMENT_DATE.name],
            taxable: data[EXPENCE_INPUTS.TAXABLE.name],
            IGST: data[EXPENCE_INPUTS.IGST.name],
            CGST: data[EXPENCE_INPUTS.CGST.name],
            SGST: data[EXPENCE_INPUTS.SGST.name],
            TAX: data[EXPENCE_INPUTS.TAX.name],
            party: data[EXPENCE_INPUTS.PARTY.name],
        };

        if (data?.is_edit == "true") {
            submitReq.expense_id = "30"; // or dynamic id
            const response = await editExpenseAPI(submitReq);
            TOAST_SUCCESS("Expense edit success.");
            router.push("/expenses");
        } else {
            const response = await addExpenseAPI(submitReq);
            TOAST_SUCCESS("Expense add success.");
            router.push("/expenses");
        }
    };

    return (
        <>
            <FormProvider {...methods}>
                <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="border-b border-gray-200 p-4 sm:p-8 dark:border-gray-800 bg-white">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Invoice Number */}
                            <div className="flex flex-row gap-2">
                                <div className="w-full">
                                    <Label>Invoice Number</Label>
                                    <Input
                                        type={INPUT_TYPE.TEXT}
                                        placeholder={EXPENCE_INPUTS.INVOICE_NUMBER.placeholder}
                                        name={EXPENCE_INPUTS.INVOICE_NUMBER.name}
                                        rules={{
                                            required: EXPENCE_INPUTS.INVOICE_NUMBER.validation,
                                            // pattern: {
                                            //     value: INPUT_PATTERN.NAME.pattern,
                                            //     message: INPUT_PATTERN.NAME.message,
                                            // },
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

                            {/*Payment Mode */}
                            <div>
                                <Label>Select Party</Label>
                                <div className="relative">
                                    <Controller
                                        control={methods.control}
                                        name={EXPENCE_INPUTS.PARTY.name}
                                        rules={{ required: EXPENCE_INPUTS.PARTY.validation }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={partyList?.map((party: any) => ({
                                                    value: party.id,   // adjust property names based on your data
                                                    label: `${party.name} (${party.gst_number})`,
                                                }))}
                                                placeholder={EXPENCE_INPUTS.PARTY.placeholder}
                                            />
                                        )}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            {/*Payment Mode */}
                            <div>
                                <Label>Voucher Type</Label>
                                <div className="relative">
                                    <Controller
                                        control={methods.control}
                                        name={EXPENCE_INPUTS.VC_TYPE.name}
                                        rules={{ required: EXPENCE_INPUTS.VC_TYPE.validation }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={vcTypes?.map((vcType: any) => ({
                                                    value: vcType.value,   // adjust property names based on your data
                                                    label: `${vcType.label}`,
                                                }))}
                                                placeholder={EXPENCE_INPUTS.PARTY.placeholder}
                                            />
                                        )}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            {/*Document Number */}
                            <div className="w-full">
                                <Label>Document Number</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.DOCUMENT_NUMBER.placeholder}
                                    name={EXPENCE_INPUTS.DOCUMENT_NUMBER.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.DOCUMENT_NUMBER.validation,
                                        pattern: {
                                            value: INPUT_PATTERN.MOBILE.pattern,
                                            message: INPUT_PATTERN.MOBILE.message,
                                        },
                                    }}
                                />
                            </div>

                            {/*Document Date */}
                            <div className="w-full">
                                <Label>Document Date</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.DOCUMENT_DATE.placeholder}
                                    name={EXPENCE_INPUTS.DOCUMENT_DATE.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.DOCUMENT_DATE.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/*Taxable*/}
                            <div className="w-full">
                                <Label>Taxable</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.TAXABLE.placeholder}
                                    name={EXPENCE_INPUTS.TAXABLE.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.TAXABLE.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/*IGST*/}
                            <div className="w-full">
                                <Label>IGST</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.IGST.placeholder}
                                    name={EXPENCE_INPUTS.IGST.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.IGST.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/*CGST*/}
                            <div className="w-full">
                                <Label>CGST</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.CGST.placeholder}
                                    name={EXPENCE_INPUTS.CGST.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.CGST.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/*SGST*/}
                            <div className="w-full">
                                <Label>SGST</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.SGST.placeholder}
                                    name={EXPENCE_INPUTS.SGST.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.SGST.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/*TAX*/}
                            <div className="w-full">
                                <Label>TAX</Label>
                                <Input
                                    type={INPUT_TYPE.TEXT}
                                    placeholder={EXPENCE_INPUTS.TAX.placeholder}
                                    name={EXPENCE_INPUTS.TAX.name}
                                    rules={{
                                        required: EXPENCE_INPUTS.TAX.validation,
                                        // pattern: {
                                        //     value: INPUT_PATTERN.MOBILE.pattern,
                                        //     message: INPUT_PATTERN.MOBILE.message,
                                        // },
                                    }}
                                />
                            </div>

                            {/* Additional Info
                            <div className="col-span-1">
                                <Label>Additional Info</Label>
                                <TextArea placeholder="Additional Info" name="invoice_number" />
                            </div> */}

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
