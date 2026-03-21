import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  RiLock2Line,
  RiGlobalLine,
  RiServerLine,
  RiBugLine,
  RiCodeLine,
  RiShieldFlashLine,
  RiSmartphoneLine,
  RiCloudLine,
  RiSpyLine
} from "react-icons/ri";

export default function AuthLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full !bg-[#e8f0fe] dark:bg-white/5 lg:flex items-center justify-center hidden p-12 overflow-y-auto">
            <div className="max-w-xl w-full">
              <div className="mb-12 text-center">
                <Link href="/" className="inline-block mb-6">
                  <Image
                    width={220}
                    height={45}
                    src="/images/logo/logo.png"
                    alt="Logo"
                    className="dark:brightness-110"
                  />
                </Link>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  Next-Gen Security <br />
                  <span className="text-brand-600">Unified Monitoring</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                  Global-standard security infrastructure for modern enterprises. Scan, detect, and remediate vulnerabilities in real-time.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { icon: <RiGlobalLine size={24} />, title: "Web Apps", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                  { icon: <RiSmartphoneLine size={24} />, title: "Android/iOS", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
                  { icon: <RiCloudLine size={24} />, title: "Cloud Infra", color: "text-sky-600 bg-sky-50 dark:bg-sky-900/20" },
                  { icon: <RiCodeLine size={24} />, title: "API Security", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
                  { icon: <RiLock2Line size={24} />, title: "SSL/TLS", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
                  { icon: <RiBugLine size={24} />, title: "OWASP 10", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
                  { icon: <RiShieldFlashLine size={24} />, title: "Pentesing", color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
                  { icon: <RiServerLine size={24} />, title: "Compliance", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                  { icon: <RiSpyLine size={24} />, title: "Threat Hunt", color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white text-xs uppercase text-center">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* <div className="mt-12 text-center">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
                        Global Security Shield Active
                    </span>
                 </div>
              </div> */}

              {/* <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex -space-x-2">
                         {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                            </div>
                         ))}
                         <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-brand-500 flex items-center justify-center text-[10px] text-white font-bold">
                            +1k
                         </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Trusted by 1000+ security professionals
                    </p>
                </div> */}
            </div>
          </div>
          {/* <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div> */}
        </div>
      </ThemeProvider>
    </div>
  );
}
