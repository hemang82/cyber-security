"use client"

import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <ThreeDots
                height="80"
                width="80"
                color="#465fff"
                ariaLabel="loading"
                visible={true}
            />
        </div>
    );
}