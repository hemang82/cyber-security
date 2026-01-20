"use client"

import React, { useState } from "react";
import AddAssets, { ASSETS_INPUTS } from "./Assets/AddAssets";
import AssetsType from "./Assets/AssetsTypes";
import Credentials from "./Assets/Credentials";
import Owners from "./Assets/Owners";
import PreviewPage from "./Assets/PreviewPage";
import { useInventoryStore } from "@/store";
import { TAB_KEY } from "@/common/commonVariable";

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

    const { active_tab, setActiveTab, assets_type, assets_details, credentials, owners, finel_validate_data } = useInventoryStore();

    type TabKey = TAB_KEY.ASSETS_TYPE | TAB_KEY.ASSETS_DETAILS | TAB_KEY.CREDENTIALS | TAB_KEY.OWNERS | TAB_KEY.PREVIEW;

    const tabClass = (tab: TabKey, data: any) => `${data?.is_valid && "text-green-900 border-green-900"} inline-flex items-center border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200
    ${active_tab === tab ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`;

    return (
        <>
            <div className="border-gray-100 dark:border-gray-800">
                <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <nav className="-mb-px flex space-x-2 overflow-x-auto">
                            <button className={tabClass(TAB_KEY.ASSETS_TYPE, assets_type)} onClick={() => { assets_type?.is_valid && setActiveTab(TAB_KEY.ASSETS_TYPE) }}>
                                Assets Type
                            </button>
                            <button className={tabClass(TAB_KEY.ASSETS_DETAILS, assets_details)} onClick={() => { assets_details?.is_valid && setActiveTab(TAB_KEY.ASSETS_DETAILS) }}>
                                Assets Details
                            </button>
                            {/* <button className={tabClass(TAB_KEY.CREDENTIALS, credentials)} onClick={() => { credentials?.is_valid && setActiveTab(TAB_KEY.CREDENTIALS) }}>
                                Credentials
                            </button> */}
                            <button className={tabClass(TAB_KEY.OWNERS, owners)} onClick={() => { owners?.is_valid && setActiveTab(TAB_KEY.OWNERS) }}>
                                Owners
                            </button>
                            <button className={tabClass(TAB_KEY.PREVIEW, finel_validate_data)} onClick={() => { finel_validate_data?.is_valid && setActiveTab(TAB_KEY.PREVIEW) }}>
                                Preview
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="pt-4">
                        {active_tab === TAB_KEY.ASSETS_TYPE && (
                            <AssetsType />
                        )}

                        {active_tab === TAB_KEY.ASSETS_DETAILS && (
                            <AddAssets />
                        )}

                        {/* {active_tab === TAB_KEY.CREDENTIALS && (
                            <Credentials />
                        )} */}

                        {active_tab === TAB_KEY.OWNERS && (
                            <Owners />
                        )}

                        {active_tab === TAB_KEY.PREVIEW && (
                            // <TabContent title="Preview">
                            <PreviewPage />
                            // </TabContent>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
