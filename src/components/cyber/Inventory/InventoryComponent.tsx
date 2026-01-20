"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";
import { ASSETS_INPUTS } from "./Assets/AddAssets";
import { assets } from "./Assets/AssetsTypes";
import { useInventoryStore } from "@/store";

export default function InventoryComponent({ InventoryData }: any) {
  const router = useRouter();

  const { setLoader } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const columns = [
    {
      key: "assets_name",
      title: "Assets Name",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row?.assets_details?.value?.[ASSETS_INPUTS.ASSETS_NAME.name]}
        </div>
      ),
    },
    {
      key: "type",
      title: "Type",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {assets.find((item: any) => item?.key === row.assets_type?.value)?.title}
          </span>
        </div>
      ),
    },
    {
      key: "website_url",
      title: "Website URL",
      render: (row: any) => (<>
        {row?.assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name]}
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
        <Badge size="sm" color={row.serverity === "Active" ? "success" : "warning"}>
          {row.serverity || "Warning"}
        </Badge>
      ),
    },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row.finel_validate_data?.value, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
      ),
    },
    {
      key: "action", title: "Action",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400" onClick={() => {
          router.push(`/Inventory-details?url=${encodeURIComponent(row?.assets_details?.value?.[ASSETS_INPUTS.WEBSITE_URL.name])}`);
          setLoader(true)
          // router.push(`/Inventory-details`); 
        }}>
          {row.action || "view"}
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
