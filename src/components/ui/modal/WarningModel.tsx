"use client";
import React, { useRef, useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Button from "../button/Button";

interface WarningProps {
    title: string;
    description: string;
    onClose: () => void;
    handleModelSave: () => void;
}

export const WarningModel: React.FC<WarningProps> = ({ title = "Warning !", description = "No Description", onClose, handleModelSave }) => {

    return (
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="text-center">
                <div className="relative flex items-center justify-center z-1 mb-7">
                    <IoMdInformationCircleOutline className="text-warning-300 text-6xl" />
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
                    <Button size="sm" className={"bg-[#465fff] hover:bg-[#3641f5]"} onClick={handleModelSave}>
                        Okay, Got It
                    </Button>
                </div>
            </div>
        </div>
    );
};
