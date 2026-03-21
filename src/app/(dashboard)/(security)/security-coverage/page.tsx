"use client";
import React from "react";
import {
    RiLock2Line,
    RiGlobalLine,
    RiServerLine,
    RiSpyLine,
    RiBugLine,
    RiCodeLine,
    RiEarthLine,
    RiShieldFlashLine,
    RiShieldCheckLine,
    RiSmartphoneLine,
    RiCloudLine
} from "react-icons/ri";

const checkFeatures = [
    { icon: <RiGlobalLine size={32} />, title: "Web Application", desc: "Full security scan for browser-based applications", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { icon: <RiSmartphoneLine size={32} />, title: "Mobile Apps", desc: "Vulnerability analysis for Android and iOS (APK/IPA)", color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
    { icon: <RiCloudLine size={32} />, title: "Cloud Security", desc: "Infrastructure scans for AWS, Azure, and GCP", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400" },
    { icon: <RiCodeLine size={32} />, title: "API Inventory", desc: "Security auditing for REST and GraphQL endpoints", color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
    { icon: <RiLock2Line size={32} />, title: "SSL/TLS Security", desc: "Certificate validity & configuration analysis", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { icon: <RiBugLine size={32} />, title: "OWASP Top 10", desc: "Scanning for the most critical web vulnerabilities", color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
    { icon: <RiServerLine size={32} />, title: "Server Headers", desc: "Security headers & infrastructure disclosure checks", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
    { icon: <RiSpyLine size={32} />, title: "Open Ports", desc: "Identification of exposed and vulnerable network ports", color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
    { icon: <RiEarthLine size={32} />, title: "Domain Health", desc: "Whois, Registrar, and DNS record analysis", color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400" },
    { icon: <RiShieldFlashLine size={32} />, title: "Dark Web Sync", desc: "Real-time monitoring for leaked credentials", color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
];

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
                        <div className={`p-4 rounded-2xl mb-5 transition-transform group-hover:scale-110 ${feature.color}`}>
                            {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 leading-snug">{feature.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
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
