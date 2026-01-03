"use client"

import React, { useState } from "react";
import AddAssets from "./Assets/AddAssets";
import AssetsType from "./Assets/AssetsTypes";
import Credentials from "./Assets/Credentials";
import Owners from "./Assets/Owners";

/* Reusable content component */
export function TabContent({ title, children }: {
    title: string; children: React.ReactNode;
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800 dark:text-white/90 border-b border-gray-300 pb-2">
                {title}
            </h3>

            {/* IMPORTANT FIX */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {children}
            </div>
        </div>
    );
}

export default function AddInventory() {

    type TabKey = "assetstype" | "assetsdetails" | "credentials" | "owners" | "preview";

    const [activeTab, setActiveTab] = useState<TabKey>("assetstype");

    const tabClass = (tab: TabKey) => `inline-flex items-center border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200
    ${activeTab === tab ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`;

    return (
        <>
            <div className="border-gray-100 dark:border-gray-800">
                <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <nav className="-mb-px flex space-x-2 overflow-x-auto">
                            <button className={tabClass("assetstype")} onClick={() => setActiveTab("assetstype")}>
                                Assets Type
                            </button>
                            <button className={tabClass("assetsdetails")} onClick={() => setActiveTab("assetsdetails")}>
                                Assets Details
                            </button>
                            <button className={tabClass("credentials")} onClick={() => setActiveTab("credentials")}>
                                Credentials
                            </button>
                            <button className={tabClass("owners")} onClick={() => setActiveTab("owners")}>
                                Owners
                            </button>
                            <button className={tabClass("preview")} onClick={() => setActiveTab("preview")}>
                                Preview
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="pt-4">
                        {activeTab === "assetstype" && (
                            <AssetsType />
                        )}

                        {activeTab === "assetsdetails" && (
                            <AddAssets />
                        )}

                        {activeTab === "credentials" && (
                            <Credentials />
                        )}

                        {activeTab === "owners" && (
                            <Owners />
                        )}

                        {activeTab === "preview" && (
                            <TabContent title="Preview">
                                Customers ipsum dolor sit amet consectetur. Non vitae facilisis urna tortor placerat egestas donec.
                            </TabContent>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}
