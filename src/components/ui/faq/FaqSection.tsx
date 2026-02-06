"use client";

import { safeText } from "@/common/commonFunction";
import { severityColor } from "@/components/cyber/Inventory/InventoryDetailsComponent";
import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

export function RoutesScanned({ data }: any) {

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="rounded-xl shadow-xs bg-white py-8 md:py-10 border border-gray-200">
            <div className="container mx-auto px-4">

                {/* Heading */}
                <div className="mx-auto mb-6">
                    <h2 className="mb-4 text-3xl font-semibold">
                        Routes Scanned
                    </h2>

                    <p className="mx-auto text-gray-500 text-base">
                        We scanned your routes for security issues. Detected
                        vulnerabilities are shown below along with their severity,
                        affected endpoints, and recommended fixes to help you secure
                        your application.
                    </p>
                </div>

                <div className="mx-auto w-full space-y-3">

                    {(data || []).map((item: any, i: number) => {
                        const vulCount = item?.vulnerabilities?.length || 0;

                        return (
                            <div
                                key={i}
                                className="rounded-xl border border-gray-200"
                            >
                                <button
                                    onClick={() => {
                                        if (vulCount > 0) toggle(i);
                                    }}
                                    disabled={vulCount === 0}
                                    className={`flex w-full justify-between px-6 py-5 text-left text-lg font-medium ${vulCount === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                        }`}
                                >
                                    {safeText(item?.url)}

                                    <div className="flex gap-10 items-center">
                                        <span className="text-gray-500 text-base sm:block hidden">
                                            Vulnerabilities: {vulCount}
                                        </span>

                                        {vulCount > 0 && (
                                            <span
                                                className={`transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""
                                                    }`}
                                            >
                                                <RiArrowDownSLine size={25} />
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {/* Accordion */}
                                <div
                                    className={`grid transition-all duration-300 ${openIndex === i
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <hr />

                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                {(item?.vulnerabilities || []).map(
                                                    (vul: any, vi: number) => (
                                                        <div
                                                            key={vi}
                                                            className="bg-white border rounded-lg p-4 shadow-sm space-y-2"
                                                        >
                                                            {/* Header */}
                                                            <div className="flex justify-between items-center">

                                                                <h3 className="font-semibold text-lg text-red-600">
                                                                    {safeText(vul?.owasp)}
                                                                </h3>

                                                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${severityColor(vul?.severity) || "bg-gray-100 text-gray-600"}`} >
                                                                    {safeText(vul?.severity)}
                                                                </span>
                                                            </div>

                                                            {/* Type */}
                                                            <p className="text-gray-800 font-medium">
                                                                Type: {safeText(vul?.type)}
                                                            </p>

                                                            {/* Detail */}
                                                            <p className="text-gray-600">
                                                                {safeText(vul?.detail)}
                                                            </p>

                                                            {/* Evidence */}
                                                            <div className="bg-gray-100 p-2 rounded text-base text-gray-700 break-all">
                                                                <strong>Evidence:</strong>{" "}
                                                                {safeText(vul?.evidence)}
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}

export function VurnabilitiesFindings({ data }: any) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="rounded-xl shadow-xs bg-white py-8 md:py-10 border border-gray-200">
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="mx-auto mb-6  ">
                    <h2 className="mb-4 text-3xl font-semibold">
                        Vurnabilities Findings
                    </h2>
                    <p className="mx-auto text-gray-500 text-base">
                        We analyzed your application routes for security risks. Any vulnerabilities found are listed below with their severity, affected areas, and suggested fixes to help keep your application secure.
                    </p>
                </div>

                <div className="mx-auto w-full space-y-3">
                    <div className="mx-auto w-full">
                        <hr className="mb-4" />
                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data?.map((vul: any, i: number) => (
                                    <div key={i} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition space-y-3" >
                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg text-gray-800">
                                                {vul.type}
                                            </h3>

                                            <span className={`px-3 py-1  text-base rounded-full font-medium ${vul.severity === "High" ? "bg-red-100 text-red-600" : vul.severity === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"}`} >
                                                {vul.severity}
                                            </span>
                                        </div>

                                        {/* OWASP (optional) */}
                                        {vul.owasp && (
                                            <p className=" text-base text-purple-600 font-medium">
                                                {vul.owasp}
                                            </p>
                                        )}

                                        {/* Detail */}
                                        <p className="text-gray-600  text-base leading-relaxed">
                                            {vul.detail}
                                        </p>

                                        {/* Evidence (optional) */}
                                        {vul.evidence && (
                                            <div className="bg-gray-100 p-2 rounded  text-base text-gray-700 break-all">
                                                <strong>Evidence:</strong> {vul.evidence}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default function OwaspReport({ data }: any) {

    const [open, setOpen] = useState<number | null>(null);

    const entries = Object.entries(data || {});
    return (<section className="rounded-xl shadow-xs bg-white py-8 md:py-10 border border-gray-200">
        <div className="container mx-auto px-4">

            {/* Heading */}
            <div className="mx-auto mb-6">

                <h2 className="mb-4 text-3xl font-semibold">
                    Top 10 Security Risks
                </h2>

                <p className="mx-auto text-gray-500 text-base">
                    We scanned your routes for security issues. Detected
                    vulnerabilities are shown below along with their severity,
                    affected endpoints, and recommended fixes to help you secure
                    your application.
                </p>
            </div>

            <div className="space-y-6">
                {entries.map(([category, value]: any, i) => {
                    const isPassed = value === "Passed";
                    return (
                        <div key={i} className="border rounded-xl bg-white shadow-sm overflow-hidden" >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100"
                            >
                                <h2 className="font-semibold text-lg">
                                    {safeText(category)}
                                </h2>

                                {isPassed ? (
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                        ✅ Passed
                                    </span>
                                ) : (
                                    <span className={`transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                                    >
                                        <RiArrowDownSLine size={25} />
                                    </span>
                                )}
                            </button>

                            {/* CONTENT */}
                            {!isPassed && open === i && (
                                <div className="p-5 grid md:grid-cols-2 gap-4">
                                    {Array.isArray(value) &&
                                        value.map((vul: any, idx: number) => {
                                            // Crypto special
                                            if (vul?.["Cryptographic-WASC-13"]) {
                                                const crypto = vul["Cryptographic-WASC-13"];

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="border rounded-lg p-4 bg-blue-50"
                                                    >
                                                        <h3 className="font-semibold text-blue-700">
                                                            Cryptographic Assessment
                                                        </h3>

                                                        <p>
                                                            Status:{" "}
                                                            {safeText(crypto?.overallAssessment)}
                                                        </p>

                                                        {crypto?.testResults?.map(
                                                            (t: any, ti: number) => (
                                                                <p
                                                                    key={ti}
                                                                    className="text-base text-gray-600"
                                                                >
                                                                    {safeText(t?.test)} →{" "}
                                                                    {safeText(t?.status)} (
                                                                    {safeText(t?.evidence)})
                                                                </p>
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={idx}
                                                    className="border rounded-lg p-4 space-y-2 hover:shadow-md"
                                                >
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">
                                                            {safeText(vul?.type)}
                                                        </h3>

                                                        <span
                                                            className={`px-2 py-1 text-sm rounded-full ${severityColor(vul?.severity) ||
                                                                "bg-gray-100 text-gray-600"
                                                                }`}
                                                        >
                                                            {safeText(vul?.severity)}
                                                        </span>
                                                    </div>

                                                    {vul?.owasp && (
                                                        <p className="text-base text-blue-600">
                                                            {safeText(vul?.owasp)}
                                                        </p>
                                                    )}

                                                    <p className="text-base text-gray-600">
                                                        {safeText(vul?.detail)}
                                                    </p>

                                                    {vul?.evidence && (
                                                        <p className="text-base bg-gray-100 p-2 rounded break-all">
                                                            <strong>Evidence:</strong>{" "}
                                                            {safeText(vul?.evidence)}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </section >
    );
}