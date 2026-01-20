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

type Column<T> = {
    key: keyof T | string;
    title: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
};

interface DynamicTableProps<T> {
    columns: Column<T>[];
    data: T[];
    className ?: string
}

export default function DynamicTable<T>({ columns, data , className}: DynamicTableProps<T>) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className={className ? className : "min-w-[1000px]"}>
                    <Table>
                        {/* HEADER */}
                        <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-[#ecf3ff]">
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={index}
                                        isHeader
                                        className={`px-5 py-3 text-start text-sm text-[#344054] font-medium text-gray-600 dark:text-gray-600 ${col.className ?? ""
                                            }`}
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
                                        // colSpan={columns?.length || 0}
                                        className="py-6 text-center text-gray-500"
                                    >
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex} className="px-5 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400" >
                                                {/* {col.render
                                                    ? col.render(row)
                                                    : (row[col.key as keyof T] as React.ReactNode)} */}

                                                {col.render
                                                    ? col.render(row)
                                                    : row[col.key as keyof T] !== undefined &&
                                                        row[col.key as keyof T] !== null &&
                                                        row[col.key as keyof T] !== "" ? (
                                                        row[col.key as keyof T] as React.ReactNode
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">N/A</span>
                                                    )}

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
