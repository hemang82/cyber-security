"use client"

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";

export default function InventoryComponent({ InventoryData }: any) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const columns = [
    {
      key: "assets_name",
      title: "Assets Name",
      // render: (row: Order) => (
      //   <div className="flex items-center gap-3">
      //     <Image
      //       src={row.user.image}
      //       width={40}
      //       height={40}
      //       alt={row.user.name}
      //       className="rounded-full"
      //     />
      //     <div>
      //       <div className="font-medium text-gray-800 dark:text-white/90">
      //         {row.user.name}
      //       </div>
      //       <div className="text-xs text-gray-500">{row.user.role}</div>
      //     </div>
      //   </div>
      // ),
    },
    {
      key: "type",
      title: "Type",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {row.type}
          </span>
        </div>
      ),
    },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY)}</span>
      ),
    },
    { key: "scan_status", title: "Scans", },
    {
      key: "vulnerabilities", title: "Vulnerabilities", render: (row: any) => (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(row?.vulnerabilities?.values) &&
            row.vulnerabilities.values.length > 0 ? (
            row.vulnerabilities.values.map((item: string, index: number) => (
              <Badge
                key={index}
                size="sm"
                color={Number(item) < 5 ? "error" : Number(item) < 10 ? "warning" : "success"}
              >
                {item}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: "serverity", title: "Serverity",
      render: (row: any) => (
        <Badge size="sm" color={row.serverity === "Active" ? "success" : "warning"}>
          {row.serverity}
        </Badge>
      ),
    },
    { key: "owner", title: "Owner" },
    {
      key: "action", title: "Action",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400" onClick={() => { router.push(`/Inventory-details`); }}>
          {row.action}
        </button>
      ),
    },
  ];

  return (
    <>
      <DynamicTable columns={columns} data={InventoryData} />
      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        perPage={perPage}
        totalCount={InventoryData.length}
        onChange={(newPage, newPerPage) => {
          setPage(newPage);
          setPerPage(newPerPage);
        }}
      />
    </>
  );
}
