"use client"

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function AssetFilter({ resInventoryList }: { resInventoryList: any }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const selectedAssetId = searchParams.get("assets_id")?.toString() || "";

    const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("assets_id", value);
        } else {
            params.delete("assets_id");
        }
        params.set("page", "1"); // Reset to first page
        router.replace(`${pathname}?${params.toString()}`);
    };

    const assets = resInventoryList?.assets || (Array.isArray(resInventoryList) ? resInventoryList : []);
    const pathname_str = pathname || "";
    
    return (
        <div className="w-full max-w-xs">
            {/* 🔥 PREFETCH TRICK: Hidden links to trigger Next.js background loading for each asset filter */}
            <div className="hidden" aria-hidden="true">
                {assets?.map((asset: any) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("assets_id", asset.id);
                    params.set("page", "1");
                    return (
                        <Link key={asset.id} href={`${pathname_str}?${params.toString()}`} prefetch={true}>
                            prefetch
                        </Link>
                    );
                })}
            </div>
            <div className="relative">
                <select
                    value={selectedAssetId}
                    onChange={handleAssetChange}
                    className="cursor-pointer w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                    <option value="">All Assets</option>
                    {assets?.map((asset: any) => (
                        <option key={asset.id} value={asset.id}>
                            {asset.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
