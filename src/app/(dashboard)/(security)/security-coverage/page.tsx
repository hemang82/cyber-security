"use client";
import React from "react";
import { RiShieldCheckLine } from "react-icons/ri";
import { SECURITY_COVERAGE_DATA } from "@/constants/securityCoverage";

const checkFeatures = SECURITY_COVERAGE_DATA;


export default function SecurityCoveragePage() {
    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <RiShieldCheckLine className="text-brand-500" />
                    Comprehensive Security Framework
                </h1>
                <p className="text-gray-500 dark:text-gray-400  text-lg">
                    Our multi-layered approach ensures that every aspect of your digital infrastructure — from code to cloud — is protected against 24/7 threats.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {checkFeatures.map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group h-full">
                        <div className={`p-4 rounded-2xl mb-5 transition-transform group-hover:scale-110 ${feature.color} ${feature.bgColor} dark:bg-opacity-20`}>
                            {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 leading-snug">{feature.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent p-10 border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Why Trust Our Security Framework?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Continuous Monitoring</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cybersecurity is not a static state. Our engine runs 24/7 to catch new vulnerabilities as they emerge in your infrastructure.</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Global Compliance Standars</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">We map our findings against SOC2, OWASP, and GDPR standards, helping you stay compliant while staying secure.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Zero-Trust Architecture</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">We assume every endpoint is a target. Our scans verify every server, port, and code snippet to eliminate hidden backdoors.</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Advanced Asset Mapping</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Whether it's a mobile app, a cloud resource, or a web frontend, we map your entire digital footprint for total visibility.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
