"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Drawer({
    open,
    onClose,
    title = "Panel title",
    children,
}: DrawerProps) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-100" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/75" />
                </Transition.Child>

                {/* Drawer container */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                                        {/* Header */}
                                        <div className="px-4 sm:px-6 flex items-center justify-between">
                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                {title}
                                            </Dialog.Title>
                                            <button
                                                onClick={onClose}
                                                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            {children}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
