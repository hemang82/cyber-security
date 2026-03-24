"use client"

import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Spinner({ message = "Loading...", isActive }: { message?: string, isActive: boolean }) {

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center dark:bg-gray-900/40 backdrop-blur-[2px]  duration-300">
            <div className="relative flex flex-col items-center dark:bg-gray-800  dark:border-gray-700  duration-200">
                <ThreeDots
                    height="100"
                    width="100"
                    color="#465fff"
                    ariaLabel="three-dots-loading"
                    visible={true}
                />

                <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
                    {message}
                </p>

                {/* Subtle outer ring animation */}
                <div className="absolute inset-0 border-2 border-brand-500/20 rounded-3xl animate-ping opacity-20" />
            </div>
        </div>
    );
}
