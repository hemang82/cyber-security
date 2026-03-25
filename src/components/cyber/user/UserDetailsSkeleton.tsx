export default function UserDetailsSkeleton() {
    return (
        <div className="mx-auto space-y-8 pb-10 animate-pulse">
            {/* Action Bar Skeleton */}
            {/* <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div> */}

            {/* Profile Card Skeleton */}
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                {/* Top Header */}
                <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                        {/* Avatar */}
                        <div className="shrink-0 h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-900"></div>

                        {/* Name & Company */}
                        <div className="flex-1 space-y-4">
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                                <div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                            </div>
                            <div className="h-9 w-52 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                            <div className="h-4 w-44 bg-gray-100 dark:bg-gray-800/60 rounded-md"></div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 pt-8 lg:pt-0 lg:pl-10 w-full lg:w-auto">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-7 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 lg:grid-cols-2">
                    {/* Account Info */}
                    <div className="p-8 lg:p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                                    <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quota Bars */}
                    <div className="p-8 lg:p-12 space-y-8 bg-gray-50/30 dark:bg-white/[0.01]">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="space-y-8">
                            {[70, 45, 55].map((w, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between">
                                        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                                        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full">
                                        <div className="h-full rounded-full bg-gray-300 dark:bg-gray-700" style={{ width: `${w}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
