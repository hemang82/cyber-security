"use client"

import React from "react";

export default function AddUserSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                {/* Header Skeleton */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg h-9 w-9"></div>
                        <div className="space-y-2">
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                            <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                        </div>
                    </div>
                </div>

                <div className="m-4 p-8 space-y-10">
                    {/* Section 1: Basic Information Skeleton */}
                    <div className="space-y-6">
                        <div className="h-6 w-40 bg-gray-100 dark:bg-gray-800 rounded-md border-b border-gray-100 dark:border-gray-800 pb-2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                                    <div className="h-11 w-full bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Permissions Skeleton */}
                    <div className="space-y-6">
                        <div className="h-6 w-40 bg-gray-100 dark:bg-gray-800 rounded-md border-b border-gray-100 dark:border-gray-800 pb-2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                                    <div className="h-11 w-full bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Asset Permissions Skeleton */}
                    <div className="space-y-6">
                        <div className="h-6 w-40 bg-gray-100 dark:bg-gray-800 rounded-md border-b border-gray-100 dark:border-gray-800 pb-2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-4 border p-4 rounded-xl border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                                        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                    <div className="h-11 w-full bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-4">
                    <div className="h-11 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-11 w-36 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
