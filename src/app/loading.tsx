"use client";

import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent">
            <ThreeDots
                height="80"
                width="80"
                color="#465fff"
                ariaLabel="loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}
