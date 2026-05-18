"use client";

import React from "react";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { safeText } from "@/common/commonFunction";

type Column<T> = {
    key: keyof T | string;
    title: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
};

interface DynamicTableProps<T> {
    columns: Column<T>[];
    data: T[];
    className?: string
}

export default function DynamicTable<T>({ columns, data, className }: DynamicTableProps<T>) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
            <div className="max-w-full overflow-x-auto">
                <div className={className ? className : "min-w-[1000px]"}>
                    <Table>
                        {/* HEADER */}
                        <TableHeader className="border-b border-slate-200 dark:border-white/[0.05] bg-slate-50/50">
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={index}
                                        isHeader
                                        className={`px-5 py-4 text-start text-sm uppercase tracking-wider text-slate-500 font-bold dark:text-gray-400 ${col.className ?? ""}`}
                                    >
                                        {col.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        {/* BODY */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns?.length || 0}
                                        className="py-6 text-center text-gray-800 dark:text-gray-400"
                                    >
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex} className="px-5 py-4 text-start text-sm font-medium text-slate-700 dark:text-gray-300" >
                                                {/* {col.render
                                                    ? col.render(row)
                                                    : (row[col.key as keyof T] as React.ReactNode)} */}

                                                {col.render
                                                    ? col.render(row)
                                                    : safeText(row[col.key as keyof T])}

                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
