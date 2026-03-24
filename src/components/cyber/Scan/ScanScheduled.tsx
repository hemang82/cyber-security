"use client";
import React from "react";
import moment from "moment";
import {
    RiCalendarLine,
    RiTimeLine,
    RiHistoryLine,
    RiSmartphoneLine,
    RiCloudLine,
    RiGlobalFill,
    RiInformationLine,
    RiLoader4Line
} from "react-icons/ri";
import ComponentCard from "@/components/common/ComponentCard";
import { formatDate, safeText } from "@/common/commonFunction";
import { ASSETS } from "../Inventory/Assets/AssetsTypes";
import { DATE_FORMAT } from "@/common/commonVariable";

export default function ScanScheduled({
    assetName,
    assetType,
    scheduledAt,
    scanType
}: {
    assetName: string,
    assetType?: string,
    scheduledAt?: string,
    scanType?: string
}) {
    const getAssetIcon = () => {
        switch (assetType?.toLowerCase()) {
            case "app": return <RiSmartphoneLine size={40} className="text-amber-500" />;
            case "cloud": return <RiCloudLine size={40} className="text-amber-500" />;
            default: return <RiGlobalFill size={40} className="text-amber-500" />;
        }
    };

    return (
        <ComponentCard title="" desc="" className="!p-0">
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Visual Status Indicator */}
                <div className="relative mb-10">
                    <div className="absolute inset-0 rounded-full bg-amber-500/5 scale-[2.5] opacity-20"></div>
                    <div className="relative z-10 w-40 h-40 rounded-full bg-white dark:bg-gray-800 border-4 border-amber-500/10 flex items-center justify-center shadow-md">
                        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-2 border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10 group overflow-hidden">
                            {/* Animated background rings */}
                            <div className="absolute inset-0 border border-amber-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-2 border border-amber-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="relative z-10">
                                {getAssetIcon()}
                            </div>
                        </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border-2 border-white dark:border-gray-800 z-20">
                        Scheduled
                    </div>
                </div>

                <div className="max-w-4xl w-full">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        Scan <span className="text-amber-500">Scheduled</span>
                    </h2>
                    <p className="text-base lg:text-lg font-bold text-gray-500 dark:text-gray-400 mb-10">
                        Preparation for: <span className="text-gray-900 dark:text-white underline underline-offset-8 decoration-amber-500/30 font-black">{assetName || "Current Asset"}</span>
                    </p>

                    {/* Schedule Details Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                        <div className="flex items-center gap-5 p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-900/5 border border-amber-100 dark:border-amber-900/20 shadow-sm">
                            <div className="flex-shrink-0 text-3xl text-amber-500 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-amber-50/50 dark:border-gray-700">
                                <RiCalendarLine />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-amber-600/60 uppercase tracking-widest mb-1">Target Date</p>
                                <p className="text-lg font-black text-gray-800 dark:text-white leading-tight">
                                    {scheduledAt ? formatDate(scheduledAt, DATE_FORMAT?.FULL_DAY_MONTH_YEAR) : "Time not specified"}
                                </p>
                                {scheduledAt && (
                                    <p className="text-xs font-bold text-amber-600 mt-1 animate-pulse">
                                        Starts {moment.utc(scheduledAt).local().fromNow()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-900/20 shadow-sm">
                            <div className="flex-shrink-0 text-3xl text-blue-500 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-blue-50/50 dark:border-gray-700">
                                <RiHistoryLine />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-blue-600/60 uppercase tracking-widest mb-1">Analysis Mode</p>
                                <p className="text-lg font-black text-gray-800 dark:text-white leading-tight capitalize">
                                    {safeText(scanType?.replace("_", " ") || "Full Scan")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-left relative overflow-hidden">
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <RiLoader4Line size={120} className="animate-[spin_20s_linear_infinite]" />
                        </div>

                        <h4 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                            <RiInformationLine className="text-lg text-amber-500" />
                            Next Steps & Deployment
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm font-black text-amber-500 shadow-sm border border-amber-100/50 dark:border-gray-700">01</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800 dark:text-white mb-1 uppercase tracking-wide">Environment Handshake</p>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                            The audit engine will initialize connection to <span className="text-brand-600 italic">{safeText(ASSETS.find((item) => item?.key == assetType)?.title || "Asset Environment")}</span>.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm font-black text-amber-500 shadow-sm border border-amber-100/50 dark:border-gray-700">02</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800 dark:text-white mb-1 uppercase tracking-wide">Automated Execution</p>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                            No user manual intervention is required; the process starts autonomously.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm font-black text-amber-500 shadow-sm border border-amber-100/50 dark:border-gray-700">03</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800 dark:text-white mb-1 uppercase tracking-wide">Notification System</p>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                            You will receive an alert once the security analysis is generated and ready.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm font-black text-amber-500 shadow-sm border border-amber-100/50 dark:border-gray-700">04</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800 dark:text-white mb-1 uppercase tracking-wide">Queue Persistence</p>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                                            This scheduled task is persistent across system reboots and updates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    );
}
