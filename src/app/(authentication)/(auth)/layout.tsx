import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-100 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              {/* <GridShape /> */}
              <div className="flex flex-col items-center max-w-md">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/logo.png"
                    alt="Logo"
                  />
                </Link>
                <h3 className="mb-2 font-semibold text-gray-800 text-title-xs dark:text-white/90">
                  All-in-One Website Security & Domain Verification
                </h3>
                <p className="text-center text-gray-900 dark:text-white/60 mb-3">
                  A simple and secure platform to verify domains and check website security.
                </p>

                <label className="text-center font-semibold text-gray-900 dark:text-white/60">
                  Fast checks • Accurate results • Secure
                </label>
              </div>
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
