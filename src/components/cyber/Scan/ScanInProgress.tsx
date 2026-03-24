"use client";
import React, { useEffect, useState } from "react";
import {
    RiShieldFlashLine,
    RiRadarLine,
    RiSearchEyeLine,
    RiLockPasswordLine,
    RiServerLine,
    RiGlobalLine,
    RiArrowLeftLine,
    RiSmartphoneLine,
    RiCloudLine,
    RiGlobalFill
} from "react-icons/ri";
import Link from "next/link";
import ComponentCard from "@/components/common/ComponentCard";
import { safeText } from "@/common/commonFunction";
import { ASSETS } from "../Inventory/Assets/AssetsTypes";

const technicalSteps = [
    { icon: <RiLockPasswordLine />, text: "Analyzing encryption protocols..." },
    { icon: <RiGlobalLine />, text: "Reviewing DNS security configurations..." },
    { icon: <RiServerLine />, text: "Auditing server infrastructure headers..." },
    { icon: <RiRadarLine />, text: "Scanning for unauthorized network ports..." },
    { icon: <RiSearchEyeLine />, text: "Performing deep vulnerability inspection..." },
];

export default function ScanInProgress({ assetName, assetType }: { assetName: string, assetType?: string }) {
    const [currentStep, setCurrentStep] = useState(0);

    const getAssetIcon = () => {
        switch (assetType?.toLowerCase()) {
            case "app": return <RiSmartphoneLine size={40} className="text-brand-500" />;
            case "cloud": return <RiCloudLine size={40} className="text-brand-500" />;
            default: return <RiGlobalFill size={40} className="text-brand-500" />;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % technicalSteps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ComponentCard title="" desc="">
            <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                {/* Visual Status Indicator */}
                <div className="relative mb-8 ">
                    <div className="absolute inset-0 rounded-full bg-brand-500/10 animate-ping scale-[2.2] opacity-30"></div>
                    <div className="relative z-10 w-36 h-36 rounded-full bg-white dark:bg-gray-800 border-4 border-brand-500/10 flex items-center justify-center shadow-md">
                        <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-2 border-brand-500/20 animate-pulse bg-brand-50/50 dark:bg-brand-900/10">
                            {getAssetIcon()}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl w-full">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                        Scan <span className="text-brand-600">In Progress</span>
                    </h2>
                    <p className="text-base lg:text-lg font-bold text-gray-500 dark:text-gray-400 mb-10">
                        Analyzing Asset : <span className="text-brand-600 dark:text-white underline underline-offset-8 decoration-brand-500/30 ">{assetName || "Current Asset"}</span>
                    </p>

                    {/* Progress & Operation Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
                        <div className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex-shrink-0 text-3xl text-brand-500 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-700">
                                {technicalSteps[currentStep].icon}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Live Engine Operation</p>
                                <p className="text-base font-black text-gray-800 dark:text-white animate-pulse leading-snug">
                                    {technicalSteps[currentStep].text}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Deep Audit Progress</span>
                                <span className="text-brand-600 font-black text-[11px] animate-pulse bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-lg">Running...</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
                                <div className="bg-brand-600 h-full animate-[progress_15s_ease-in-out_infinite]" style={{ width: '71%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Unified Instruction Block */}
                    <div className="bg-brand-50/30 dark:bg-brand-900/5 border border-brand-100 dark:border-brand-900/10 rounded-3xl p-8 text-left">
                        <h4 className="text-[11px] font-black text-brand-700 dark:text-brand-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                            <RiRadarLine className="animate-spin text-lg" />
                            Security Operations Manual
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black text-brand-600 shadow-sm border border-gray-100 dark:border-gray-700">01</span>
                                    <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                                        Audit engine for <span className="text-brand-600 dark:text-white font-black ">{safeText(ASSETS.find((item) => item?.key == assetType)?.title || "Website")}</span> .
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black text-brand-600 shadow-sm border border-gray-100 dark:border-gray-700">02</span>
                                    <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                                        Scan residency is persistent in cloud environment.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black text-brand-600 shadow-sm border border-gray-100 dark:border-gray-700">03</span>
                                    <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                                        Safe to exit navigation; scan process is isolated.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black text-brand-600 shadow-sm border border-gray-100 dark:border-gray-700">04</span>
                                    <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                                        Final report available in history upon completion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-14 flex items-center gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-brand-600 transition-colors">
                        Enterprise AI Scan Active
                    </span>
                </div> */}
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { width: 10%; }
                    40% { width: 45%; }
                    80% { width: 85%; }
                    100% { width: 92%; }
                }
            `}</style>

        </ComponentCard>
    );
}
