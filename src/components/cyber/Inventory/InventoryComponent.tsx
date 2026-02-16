"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";
import { ASSETS_INPUTS } from "./Assets/AddAssets";
import { assets } from "./Assets/AssetsTypes";
import { useInventoryStore } from "@/store";
import { Badge, CyberColorClass, severityColor } from "./InventoryDetailsComponent";
import { GoEye } from "react-icons/go";

export default function InventoryComponent({ InventoryData }: any) {
  const router = useRouter();

  const { setLoader } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const columns = [
    {
      key: "id",
      title: "ID",
      render: (row: any) => (<>
        {row?.id || "-"}
      </>),
    },
    {
      key: "name",
      title: "Asset Name",
      render: (row: any) => (<>
        {row?.name || "-"}
      </>),
    },
    {
      key: "type",
      title: "Type",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {row?.type || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "url",
      title: "Website URL",
      render: (row: any) => (<>
        {row?.url || "-"}
      </>),
    },
    {
      key: "scan_count",
      title: "Scan Count",
      render: (row: any) => (<>
        {row?.scan_count || "-"}
      </>),
    },
    {
      key: "finding_count",
      title: "Finding Count",
      render: (row: any) => (<>
        {row?.finding_count || "-"}
      </>),
    },
    // {
    //   key: "vulnerabilities",
    //   title: "Vulnerabilities",
    //   render: (row: any) => {
    //     console.log("Row Data 👉", row); // 👈 row structure અહીં દેખાશે

    //     const vulnerabilities = row?.full_response?.finding_counts;

    //     return (
    //       <div className="flex flex-wrap gap-2">
    //         {vulnerabilities?.map((item: any, index: number) => (
    //           <Badge key={index} color={item?.color} classname="!text-xs ">
    //             {item?.count}
    //           </Badge>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   key: "security_score", title: "Security Score",
    //   render: (row: any) => (<>
    //     {/* // <Badge size="sm" color={row.risk_level && severityColor(row.risk_level) || '12'}>
    //     //   {row.risk_level || "Warning"}
    //     // </Badge> */}

    //     {safeText(row?.full_response?.output_score) || "Info"}
    //   </>),
    // },
    // {
    //   key: "serverity", title: "Serverity",
    //   render: (row: any) => (
    //     // <Badge size="sm" color={row.risk_level && severityColor(row.risk_level) || '12'}>
    //     //   {row.risk_level || "Warning"}
    //     // </Badge>

    //     <span
    //       className={`rounded-full px-2 py-0.5 text-xs font-medium ${CyberColorClass[row?.risk_color as keyof typeof CyberColorClass]} `} >
    //       {safeText(row?.risk_level) || "Info"}
    //     </span>
    //   ),
    // },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row?.created_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR) || "-"}</span>
      ),
    },
    // {
    //   key: "action", title: "Action",
    //   render: (row: any) => (
    //     <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => {
    //       router.push(`/scan-view?id=${encodeURIComponent(row?.id)}`);
    //       setLoader(true)
    //       // router.push(`/Inventory-details`); 
    //     }}>
    //       {/* {row.action || "view"} */}
    //       <GoEye size={18} />
    //     </button>
    //   ),
    // },
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
