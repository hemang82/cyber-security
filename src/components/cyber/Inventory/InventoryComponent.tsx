"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";
import { ASSETS_INPUTS } from "./Assets/AddAssets";
import { assets } from "./Assets/AssetsTypes";
import { useInventoryStore } from "@/store";
import { severityColor } from "./InventoryDetailsComponent";
import { GoEye } from "react-icons/go";

export default function InventoryComponent({ InventoryData }: any) {
  const router = useRouter();

  const { setLoader } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const columns = [
    //  {
    //   key: "id",
    //   title: "ID",
    //   render: (row: any) => (<>
    //     {row?.id}
    //   </>),
    // },
    {
      key: "type",
      title: "Type",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {row?.scan_context}
          </span>
        </div>
      ),
    },
    {
      key: "website_url",
      title: "Website URL",
      render: (row: any) => (<>
        {row?.target_url}
      </>),
    },
    {
      key: "vulnerabilities", title: "Vulnerabilities", render: (row: any) => (
        <div className="flex flex-wrap gap-2">
          {
            // Array.isArray(["1", "2", "8", "5", "15"]) &&
            // ["1", "2", "8", "5", "15"] > 0 ? (
            ["1", "2", "8", "5", "15"].map((item: string, index: number) => (
              <Badge
                key={index}
                size="sm"
                color={Number(item) < 5 ? "error" : Number(item) < 10 ? "warning" : "success"}
              >
                {item}
              </Badge>
            ))
            // ) 
            // : (
            //   <span className="text-xs text-gray-400">—</span>
            // )
          }
        </div>
      ),
    },
    {
      key: "serverity", title: "Serverity",
      render: (row: any) => (
        // <Badge size="sm" color={row.risk_level && severityColor(row.risk_level) || '12'}>
        //   {row.risk_level || "Warning"}
        // </Badge>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor(row?.risk_level || "Info")}`} >
          {safeText(row?.risk_level) || "Info"}
        </span>
      ),
    },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row?.scanned_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
      ),
    },
    {
      key: "action", title: "Action",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400" onClick={() => {
          router.push(`/Inventory-view?id=${encodeURIComponent(row?.id)}`);
          setLoader(true)
          // router.push(`/Inventory-details`); 
        }}>
          {/* {row.action || "view"} */}
          <GoEye size={20}/>

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
