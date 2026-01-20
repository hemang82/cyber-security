"use client";

import React, { useRef, useEffect } from "react";
import Button from "../button/Button";
import { TiTick } from "react-icons/ti";

interface SuccessProps {
    title: string;
    description: string;
    onClose: () => void;
    handleModelSave: () => void;
}

export const SuccessModel: React.FC<SuccessProps> = ({ title = "Success !", description = "No Description", onClose, handleModelSave }) => {

    return (
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="text-center">
                <div className="relative flex items-center justify-center z-1 mb-7">
                    <TiTick className="text-success-400 text-6xl" />
                </div>
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                    {title}
                </h4>
                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {description}
                </p>
                <div className="flex items-center gap-3 px-2 mt-6 justify-center">
                    <Button size="sm" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button size="sm" className={"!bg-success-500 hover:!bg-success-600"} onClick={handleModelSave}>
                        Okay, Got It
                    </Button>
                </div>
            </div>
        </div>
    );
};
